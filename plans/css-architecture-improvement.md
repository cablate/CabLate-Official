# CSS 架構改善規劃

> 最後更新：2026-04-29
> 狀態：已完成 ✅（Phase 1-3 全部實作並 commit）
> 專案：CabLate Astro 靜態站（`F:\_Program\OwnProject\CabLate`）

---

## 一、系統定位

CabLate.com 是一個 Astro 5 靜態站，使用**純 CSS（無 Tailwind）**搭配 CSS Variables 做設計系統。目前約 50 頁、~2,700 行 CSS。

本規劃的目標：**在不換框架的前提下，修正已出現的可維護性問題，讓未來新增頁面時不需要複製貼上樣式。**

---

## 二、現況審計

### 2.1 架構概覽

```
src/styles/
  base.css        — 117 行：CSS 變數（45 個）、reset、typography
  utilities.css   — 168 行：layout utilities、section 樣式、reveal 動畫
  animations.css  —  16 行：keyframes（僅 bounce-down）
  global.css      — 306 行：nav、btn、footer、back-to-top

載入鏈（BaseLayout.astro <style is:global>）：
  base.css → utilities.css → animations.css → global.css
```

**CSS 分佈：88% scoped（~2,400 行）、12% global（~300 行）。**

### 2.2 驗證過的事實（工具證據）

| 指標 | 數值 | 驗證方式 |
|------|------|----------|
| Spacing tokens 使用率 | **0%**（定義 6 個，使用 0 次） | `grep -r 'var(--spacing' src/` = 0 matches |
| 硬編碼 rem 值（padding/margin/gap） | **229 處** | grep 計數 |
| 硬編碼狀態色 | **24 行，跨 3 個檔案** | grep 精確匹配（CourseLayout 12 行 + courses/index 12 行） |
| 卡片樣式重複 | **13 個檔案**含相似 card pattern | border-radius 10-14px + border 1px solid |
| Breakpoint 種類 | **6 種**（768/600/900/1024/480/380px） | grep `@media.*max-width` |
| Breakpoint 出現次數 | **30 次**（768px 佔 21 次） | grep 計數 |
| `!important` 數量 | **45 個**（Newsletter 42 + NewsletterCTA 3） | grep 計數 |
| 最大 scoped style | Portfolio 575L、ArticleLayout 529L、CourseLayout 480L | 行數計算 |

### 2.3 卡片樣式差異比對表（Phase 2 基礎）

| 屬性 | testimonial | audience | feature | faq | course-card | service-card |
|------|------------|----------|---------|-----|-------------|--------------|
| padding | 1.5rem | 1.5rem | 1rem 1.25rem | 不定 | 1.75rem | 1.75rem |
| border | 1px solid var(--border) | 同左 | 同左 | 同左 | 同左 | 同左 |
| border-radius | 12px | 12px | 12px | 12px | 12px | **14px** ⚠️ |
| transition | 無 | 無 | 無 | border-color 0.2s | all 0.2s | all 0.2s |
| hover | 無 | 無 | 無 | border-color 變 | translateY + shadow | border + shadow |

**發現**：service-card 用 14px 其餘全部 12px，padding 從 1rem~1.75rem 不等。

### 2.4 已有且正常

| 項目 | 說明 |
|------|------|
| 色彩系統 | 核心色（accent/text/bg/border）全部用 CSS 變數，一致 |
| 圓角系統 | 5 級 scale，有被使用 |
| 陰影系統 | 3 級 scale，有被使用 |
| 命名風格 | kebab-case + 元件前綴，~70% 一致 |
| 全域 CSS 精簡 | 只有該全域的才全域（nav/btn/footer） |
| Scoped 隔離 | 元件間不互相干擾 |
| Astro scoped 優先級 | scoped 用 `[data-astro-cid-*]` attribute selector，specificity (0,2,0) 勝過 global class (0,1,0) |

### 2.5 已有但有缺陷

| 項目 | 問題 | 嚴重度 |
|------|------|--------|
| Spacing tokens | 定義了但 0% 使用，形同虛設 | MEDIUM |
| 狀態色 | `#16a34a` / `#dc2626` / `#d97706` 硬編碼在 CourseLayout + courses/index | MEDIUM |
| Breakpoint | 6 種數值散落 30 處，無統一定義 | LOW |
| `--gold-light` 與狀態色重疊 | base.css L41 `--gold-light: #fde68a`，與預計新增的 `--status-warning-border` 同值 | LOW |

### 2.6 不存在（需新增）

| 項目 | 影響 |
|------|------|
| 狀態色 CSS 變數 | 改一次色要手動搜尋替換 3 個檔案 |
| 共用 badge 樣式 | CourseLayout + courses/index 重複定義 status/level badge |
| Breakpoint 約定 | 新增元件時不知道該用哪個 breakpoint |

---

## 三、設計決策

### ADR-1：不引入 Tailwind

**決定**：維持純 CSS + CSS Variables。
**理由**：50 頁靜態站遷移成本 > 收益。現有 CSS 變數系統核心部分（色彩/圓角/陰影）運作良好。問題不在框架選擇，而在共用樣式未抽取。
**何時翻案**：站點超過 100 頁，或需要多人協作時。

### ADR-2：不強制遷移現有 spacing 到 token

**決定**：現有 229 處硬編碼 rem 值不做批量替換。新寫的元件鼓勵用 spacing token。
**理由**：批量搜尋替換有高回歸風險（間距微調會破壞視覺）。值的語意不一定對應 token（如 `1.75rem` 不在 6 級 scale 裡）。
**漸進策略**：未來新增或大改元件時順手遷移。

### ADR-3：不拆分 Portfolio.astro

**決定**：575 行 scoped CSS 維持原狀。
**理由**：它是獨立元件、不影響其他頁面、不常修改。拆分會增加檔案數但不增加可維護性。
**何時翻案**：需要在其他頁面複用 Portfolio 子元件時。

### ADR-4：不碰 Newsletter !important

**決定**：45 個 `!important` 維持原狀。
**理由**：這是覆蓋 FormKit/ConvertKit 第三方樣式的必要手段。移除會 break 表單外觀。除非換掉 ConvertKit 表單元件，否則沒有乾淨解法。

### ADR-5：不抽取共用 .card class

**決定**：不建立全域 `.card` class。
**理由**：Stage 5 Repo Reality Check 揭露卡片樣式差異太大（padding 1rem~1.75rem、border-radius 12~14px、hover 行為 4 種、部分無 transition）。抽出的 `.card` 會因為太通用而每個消費者都需要覆蓋，失去抽象意義。Astro scoped style 的 attribute selector specificity (0,2,0) 能勝過 global class (0,1,0)，所以覆蓋技術上可行，但「先加 class 再覆蓋」不比「直接寫 scoped style」更簡潔。
**何時翻案**：新增 3+ 個頁面都需要相同樣式的卡片時，再考慮抽取。

### ADR-6：`--gold-light` 與 `--status-warning-border` 同值處理

**決定**：維持 `--gold-light: #fde68a` 不動，新增 `--status-warning-border: #fde68a` 作為獨立語意變數。
**理由**：兩者語意不同——`--gold-light` 是 Portfolio 等元件的裝飾色，`--status-warning-border` 是狀態系統的 border 色。即使目前同值，未來可能分別調整。值相同不代表語意相同。

---

## 四、實作計畫

### Core vs Optional 分類

| Phase | 分類 | 理由 |
|-------|------|------|
| Phase 1（狀態色變數） | **Core** | 直接解決硬編碼維護問題 |
| Phase 2（共用 badge） | **Core** | 解決最明顯的重複（badge 完全相同） |
| Phase 3（breakpoint 約定） | **Optional** | 純文件，不解決技術問題，skip 不影響主線 |

---

### Phase 1：抽出狀態色 CSS 變數

**目標**：消除硬編碼狀態色，統一到 `base.css`。

**改動清單：**

| 檔案 | 變更 |
|------|------|
| `src/styles/base.css` | `:root` 區塊新增 9 個狀態色變數 |
| `src/layouts/CourseLayout.astro` | 替換 12 行硬編碼色值為 `var()` |
| `src/pages/courses/index.astro` | 替換 12 行硬編碼色值為 `var()` |

**新增變數（base.css `:root`）：**

```css
/* 狀態色 */
--status-success: #16a34a;
--status-success-bg: #f0fdf4;
--status-success-border: #bbf7d0;
--status-error: #dc2626;
--status-error-bg: #fef2f2;
--status-error-border: #fecaca;
--status-warning: #d97706;
--status-warning-bg: #fffbeb;
--status-warning-border: #fde68a;
```

**替換規則：**

| 硬編碼值 | 替換為 | 出現檔案（含行號） |
|----------|--------|-------------------|
| `#16a34a` | `var(--status-success)` | CourseLayout L282,L426,L484 / courses/index L134,L152 |
| `#f0fdf4` | `var(--status-success-bg)` | CourseLayout L280,L422 / courses/index L132,L150 |
| `#bbf7d0` | `var(--status-success-border)` | CourseLayout L281,L423 / courses/index L133,L151 |
| `#dc2626` | `var(--status-error)` | CourseLayout L492 / courses/index L146 |
| `#fef2f2` | `var(--status-error-bg)` | courses/index L144 |
| `#fecaca` | `var(--status-error-border)` | courses/index L145 |
| `#d97706` | `var(--status-warning)` | CourseLayout L276 / courses/index L140 |
| `#fffbeb` | `var(--status-warning-bg)` | CourseLayout L274 / courses/index L138 |
| `#fde68a` | `var(--status-warning-border)` | CourseLayout L275 / courses/index L139 |

**驗證標準：**
- [ ] `npm run build` 通過
- [ ] `grep -rn '#16a34a\|#dc2626\|#d97706\|#f0fdf4\|#fef2f2\|#fffbeb\|#bbf7d0\|#fecaca\|#fde68a' src/` — 只剩 base.css 定義本身 + base.css L41 的 `--gold-light`（保留不動）
- [ ] 視覺無變化（值相同，只是從變數讀取）

**實作約束：**
- ✅ 逐檔案逐行替換（不用 replace_all 跨檔案，避免誤改 base.css 的變數定義行）
- ✅ base.css L41 的 `--gold-light: #fde68a` 保留不動（語意不同，見 ADR-6）
- ❌ 不替換 CourseLayout 的 audience-card 背景色（`#fafff9`、`#d1e7dd`、`#fffbfa`、`#f5c6cb`）——這些是 audience 卡片專屬色，不屬於狀態色系統
- ❌ 不替換 `rgba()` 值（如 Newsletter 的 `rgba(16, 191, 122, 0.1)`）
- ❌ 不動 LatestArticles.astro 的 `#fef3c7`（featured badge 背景，不同色值）

---

### Phase 2：抽出共用 badge 樣式

**目標**：把 CourseLayout + courses/index 重複的 badge 樣式抽到 `utilities.css`。

> v1 版本原計劃同時抽 `.card` class。Stage 5 審查後決定不做（見 ADR-5），改為只抽 badge——badge 在兩個檔案完全相同，是最乾淨的抽取目標。

**改動清單：**

| 檔案 | 變更 |
|------|------|
| `src/styles/utilities.css` | 新增 ~30 行 badge 共用樣式 |
| `src/layouts/CourseLayout.astro` | 移除 scoped badge 樣式，HTML 改用共用 class |
| `src/pages/courses/index.astro` | 移除 scoped badge 樣式，HTML 改用共用 class |

**新增共用 class（utilities.css）：**

```css
/* ─── 共用 badge ─── */
.badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-accent {
  background: var(--accent-subtle);
  border: 1px solid var(--accent-border);
  color: var(--accent);
}

.badge-success {
  background: var(--status-success-bg);
  border: 1px solid var(--status-success-border);
  color: var(--status-success);
}

.badge-warning {
  background: var(--status-warning-bg);
  border: 1px solid var(--status-warning-border);
  color: var(--status-warning);
}

.badge-error {
  background: var(--status-error-bg);
  border: 1px solid var(--status-error-border);
  color: var(--status-error);
}
```

**HTML 改動對照表：**

| 檔案 | 原 class | 新 class | 說明 |
|------|----------|----------|------|
| CourseLayout.astro | `class="course-badge level-badge"` | `class="badge badge-accent"` | level badge 用 accent 色 |
| CourseLayout.astro | `class="course-badge status-badge status-${status}"` | `class="badge badge-warning"` (pre-sale) / `class="badge badge-success"` (active) | 需根據 status 動態選 class |
| courses/index.astro | `class="course-badge level-${level}"` | `class="badge badge-success"` (初級) / `class="badge badge-warning"` (中級) / `class="badge badge-error"` (高級) | 需根據 level 動態選 class |
| courses/index.astro | `class="course-badge status-${status}"` | `class="badge badge-warning"` (pre-sale) / `class="badge badge-success"` (active) | 同上 |

**移除的 scoped style（CourseLayout）：**
- `.course-badge`（L268-272）
- `.level-badge`（L274-278）→ 改用 `.badge-accent`
- `.status-badge`（L280-283）→ 改用 `.badge-warning`
- `.status-active`（L285-288）→ 改用 `.badge-success`

**移除的 scoped style（courses/index）：**
- `.course-badge`（L125-130）
- `.level-初級`（L132-136）→ 改用 `.badge-success`
- `.level-中級`（L138-142）→ 改用 `.badge-warning`
- `.level-高級`（L144-148）→ 改用 `.badge-error`
- `.status-active`（L150-153）→ 改用 `.badge-success`
- `.status-pre-sale`（L155-159）→ 改用 `.badge-accent`

**驗證標準：**
- [ ] `npm run build` 通過
- [ ] badge 視覺效果與改動前一致（檢查 viewport: 1440px + 375px）
- [ ] `grep -rn 'course-badge\|level-badge\|status-badge' src/layouts/CourseLayout.astro` = 0 matches
- [ ] `grep -rn 'course-badge\|level-初級\|level-中級\|level-高級' src/pages/courses/index.astro` = 0 matches
- [ ] CourseLayout scoped style 行數從 ~480 行降低

**實作約束：**
- ✅ badge 的 padding/font-size/font-weight/border-radius 兩個檔案完全一致（已驗證），可安全抽取
- ✅ 動態 class 用 Astro 的 ternary/map 語法：`class={`badge ${statusClass}`}`
- ❌ 不抽 `.card` class（見 ADR-5）
- ❌ 不動其他檔案的 badge-like 樣式（如 ArticleLayout 的 `.article-category`——語意不同）
- ❌ 不改 HTML 結構，只改 class 名

---

### Phase 3：統一 Breakpoint 約定（Optional）

**目標**：記錄 3 個標準 breakpoint，作為未來元件的約定值。

> 此 Phase 為 Optional。Skip 不影響 Phase 1-2 的交付。

**改動清單：**

| 檔案 | 變更 |
|------|------|
| `src/styles/base.css` | 頂部新增 breakpoint 註解區段 |

**新增內容（base.css 頂部）：**

```css
/* ═══════════════════════════════════════════════════════════
   BREAKPOINTS（約定值，CSS 原生不支援 media query 變數）
   
   --bp-sm: 600px   — 小螢幕手機
   --bp-md: 768px   — 平板 / 手機橫向（主要斷點）
   --bp-lg: 1024px  — 小筆電 / 平板橫向
   
   使用方式：@media (max-width: 768px) { ... }
   新增元件時請優先使用這 3 個值，避免發明新的 breakpoint。
   特殊值：900px（Portfolio carousel）、380px（nav mobile）允許存在但不新增。
   ═══════════════════════════════════════════════════════════ */
```

**驗證標準：**
- [ ] 註解已新增
- [ ] `npm run build` 通過
- [ ] 無程式碼變動（純註解）

**實作約束：**
- ✅ 只加註解，不改任何 media query
- ❌ 不用 CSS custom properties 做 media query（原生不支援）
- ❌ 不引入 postcss 或 sass

---

## 五、Phase 依賴圖

```
Phase 1 (狀態色變數) ──── Core
  ↓
Phase 2 (共用 badge) ──── Core（依賴 Phase 1 的 --status-* 變數）
  |
Phase 3 (breakpoint 約定) ── Optional（無技術依賴，可隨時 skip）
```

---

## 六、不做的事

| 項目 | 理由 |
|------|------|
| 引入 Tailwind | 見 ADR-1 |
| 批量遷移 spacing tokens | 見 ADR-2 |
| 拆分 Portfolio.astro CSS | 見 ADR-3 |
| 移除 Newsletter !important | 見 ADR-4 |
| 抽取共用 `.card` class | 見 ADR-5 |
| 統一命名（`.la-*` → `.latest-articles-*`） | 改名影響範圍大、收益低 |
| 新增 typography tokens | 值域太連續（1.3~1.8），token 化反而限制微調 |
| 遷移現有 media query 到統一 breakpoint | 30 處搜尋替換風險 > 收益 |
| 替換 audience-card 背景色 | `#fafff9`、`#d1e7dd` 等是專屬色，不屬於狀態色系統 |
| service-card border-radius 14px→12px | 不在本次範圍，需要視覺確認 |

---

## 七、預估工作量

| Phase | 分類 | 改動檔案數 | 預估時間 |
|-------|------|-----------|----------|
| 1（狀態色） | Core | 3 | 15 分鐘 |
| 2（共用 badge） | Core | 3 | 20 分鐘 |
| 3（breakpoint） | Optional | 1 | 5 分鐘 |

---

## 八、風險評估

| 風險 | 可能性 | 影響 | 對策 |
|------|--------|------|------|
| 替換色值遺漏 | 低 | 視覺不一致 | grep 驗證 0 殘留 |
| badge class 動態綁定邏輯錯誤 | 中 | badge 顯示錯色 | build 後檢查列表頁 + 詳細頁 |
| utilities.css badge 與 scoped style 衝突 | 低 | 不會——已移除 scoped badge style | Phase 2 明確列出要刪除的 scoped rules |

---

## 九、執行就緒評估（Stage 5）

### 5.1 Repo Reality Check

| 項目 | 狀態 |
|------|------|
| `src/styles/base.css` | ✅ 存在（117 行） |
| `src/styles/utilities.css` | ✅ 存在（168 行），全域載入（BaseLayout `is:global`） |
| `src/layouts/CourseLayout.astro` | ✅ 存在（712 行） |
| `src/pages/courses/index.astro` | ✅ 存在（317 行） |
| `src/pages/services.astro` | ✅ 存在（264 行）——本次不動 |
| Astro scoped specificity | ✅ 確認：`[data-astro-cid-*]` attribute selector (0,2,0) > class (0,1,0) |
| CSS 載入鏈 | ✅ 確認：base → utilities → animations → global（BaseLayout L198-203） |

### 5.2 Data Source Mapping

N/A——本計畫無新增畫面或資料展示。

### 5.3 Phase Sizing

| Phase | 改動檔案 | 風險 | 判定 |
|-------|---------|------|------|
| 1 | 3 檔，純搜尋替換 | 🟢 | 適當 |
| 2 | 3 檔，HTML class + 移除 scoped style | 🟡 | 可接受（有明確改動對照表） |
| 3 | 1 檔，純註解 | 🟢 | 適當 |

### 5.4 Core vs Optional

見第四節開頭分類表。Phase 1-2 為 Core，Phase 3 為 Optional。

### 5.5 Spike Requirements

無。所有技術假設已驗證：
- Astro scoped specificity：✅ 確認 (0,2,0) > (0,1,0)
- `--gold-light` 與 `--status-warning-border` 同值：✅ 可共存（見 ADR-6）

### 5.6 Conditional Review Rules

| 觸發條件 | 檢查結果 |
|----------|----------|
| UI/UX 變更 | ✅ 驗證標準指定 viewport: 1440px + 375px |
| Codebase 重構 | ✅ Phase 2 列出所有要移除的 scoped rules 行號範圍 |
| 新的抽象層 | ✅ `.badge` class 有 4 個消費者（CourseLayout 2 處 + courses/index 2 處），不算過度抽象 |

### Verdict: ✅ Ready

一個全新的 Claude Code session，只讀這份計畫，可以穩定完成所有 Phase。

---

## v2 修訂紀錄

| 變更 | 原因 |
|------|------|
| 移除 Phase 2 的 `.card` class 抽取 | Stage 5 揭露卡片差異太大（padding 1rem~1.75rem、radius 12~14px、hover 4 種），抽象無意義（ADR-5） |
| Phase 2 範圍縮小為只抽 badge | badge 兩檔完全一致，是最乾淨的抽取目標 |
| 新增 ADR-5（不抽 .card）和 ADR-6（gold-light 同值處理） | Stage 5 Repo Reality Check 發現的問題 |
| Phase 1 替換規則加入行號 | Stage 5 要求：一個新 session 只讀計畫就能不走歪路地實作 |
| Phase 2 加入 HTML 改動對照表 + 要刪除的 scoped rules 清單 | 同上 |
| 新增 Core vs Optional 分類 | Stage 5 要求 |
| 新增 2.3 卡片差異比對表 | 作為 ADR-5 的事實依據 |
| 新增第九節執行就緒評估 | Stage 5 新增要求 |
