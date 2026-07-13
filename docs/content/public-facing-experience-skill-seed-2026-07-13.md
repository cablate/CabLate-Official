---
status: seed
created: 2026-07-13
build_after: CabLate personal website completion and final human review
proposed_skill_name: public-facing-experience
scope: preserve the reusable decisions and source map for a future cross-format public-facing experience skill
---

# Public-Facing Experience Skill Seed

## 0. 文件定位

這份文件記錄 CabLate 個人網站改版過程中形成的 Skill 構想，避免網站完成後只留下成品，卻失去能重複使用的判斷方法。

現在不建立正式 Skill。應先完成網站、經過人工審查並確認實際上線結果，再從完整過程文件中提煉第一版。

這份 seed 只保存：

- 已確認的定位與設計原則。
- Skill 應涵蓋與不應涵蓋的範圍。
- 未來需要回讀的專案文件與實際失敗案例。
- 建立、驗證與 forward-test 的建議方式。

## 1. 核心決策

### 1.1 建立一份 Skill，不拆成多份

未來應建立一份 `public-facing-experience` Skill，而不是要求使用者在文案、CTA、Persona、視覺與 production audit 等多個 Skills 之間自行選擇。

這些能力共用同一個核心問題：

> 如何把既有資訊整理成一個可信任、容易理解，並能讓特定受眾產生預期結果的對外體驗。

Skill 本身負責辨識需求並選擇必要模組。詳細方法放在按需讀取的 references，不把所有內容塞進 `SKILL.md`。

### 1.2 Skill 是可選路徑的工具箱，不是強制流程

使用者不需要每次都經過素材盤點、策略、文案、視覺、實作與 production audit。

核心範圍規則：

> 只執行使用者要求的最小必要路徑。除非使用者明確要求完整規劃、重構或上線審查，否則不得自動展開成完整流程。

例如：

| 使用者要求 | 應啟用的部分 | 不應擅自擴張 |
| --- | --- | --- |
| 幫我規劃官網 | 目標、受眾、頁面角色、CTA 架構 | 不直接重寫全部頁面或換視覺 |
| 這段文案很像 AI 寫的 | 閱讀情緒、自然用語、冗餘與保真回讀 | 不重新設計整個漏斗 |
| 服務頁沒有說服力 | 訪客疑慮、證據、合作判斷與下一步 | 不把每段都改成銷售 CTA |
| 各頁看起來都一樣 | 頁面任務、內容結構與視覺語法 | 不推翻既有品牌系統 |
| 幫我檢查能不能上線 | Persona、真實連結、responsive、accessibility、build | 不順便進行大改版 |
| 我有一包 Notion 素材 | 素材盤點、證據、公開紅線與內容映射 | 不在未確認目標前直接塞進頁面 |
| 整個網站重新規劃 | 才串接完整流程 | 仍需保留 phase、checkpoint 與驗證邊界 |

## 2. 適用場景

這不是只服務官方網站的 Skill。只要產出會被客戶、讀者、合作方、學員、社群成員或一般公眾看見，且需要處理理解、信任、決策或行動，就可能適用。

主要場景：

- 個人品牌、企業官網與作品集。
- Landing Page、商品頁、服務頁與活動頁。
- 課程、知識產品與學習平台入口。
- 顧問、接案者、講師、作者與講者介紹。
- 簡報、演講 Deck 與課程教材。
- 客戶報告、研究報告、提案書與合作文件。
- 行銷信、公告、電子報與社群置頂文。
- Media Kit、品牌介紹與合作夥伴材料。
- 社群、會員制與 Discord 招募或 onboarding。
- 大型內容庫轉換成公開內容架構。
- 對外內容上線前的 Persona 與 production audit。

不需觸發的典型情況：

- 單純改錯字、轉檔、調整尺寸。
- 完全機械化且受眾與內容判斷已經明確的操作。
- 純內部、低風險且不涉及讀者理解的技術工作。

## 3. Skill 的共同判斷模型

無論媒介為何，都先回答：

1. 誰會看到？
2. 他在接觸前知道什麼、相信什麼、擔心什麼？
3. 他為什麼願意繼續讀？
4. 閱讀過程應產生什麼理解與情緒變化？
5. 哪些事實、作品、經驗或證據可以建立信任？
6. 看完後希望他理解、相信、決定或做什麼？
7. 目前有哪些冗餘、跳躍、硬湊、誤導或不自然的地方？
8. 這次任務真正需要做到哪裡就應該停止？

### 3.1 預期讀者結果，不等於每次都要轉換

Skill 不應把所有內容套成銷售漏斗。

不同產出的預期結果可能是：

- 官網：辨識問題、建立信任、選擇適合入口。
- 行銷頁：判斷產品是否適合並採取行動。
- 簡報：理解論點、記住核心訊息、接受下一步。
- 研究報告：相信證據足夠、理解限制、做出正確決策。
- 提案書：確認合作價值、範圍、風險與後續流程。
- 公告：準確理解變更、影響與需要採取的行動。

CTA 只是其中一種可能結果，不是所有產出的強制元素。

## 4. 與格式專屬 Skills 的關係

`public-facing-experience` 是橫向的受眾、內容、信任與閱讀體驗層，不應取代專業格式工具。

| 任務 | 建議組合 | 分工 |
| --- | --- | --- |
| 製作簡報 | Public-Facing Experience + Presentations | 前者決定受眾、敘事與證據；後者負責投影片結構、排版與檔案 |
| 製作網站 | Public-Facing Experience + Product Design／Frontend | 前者決定頁面角色與閱讀旅程；後者負責 UI、responsive 與實作 |
| 撰寫書面報告 | Public-Facing Experience + Documents／Report | 前者決定讀者結果與論證；後者負責文件結構與格式 |
| 數據報告 | Public-Facing Experience + Data Analytics | 前者處理決策語境；後者處理數據、圖表與分析正確性 |
| 電子報或信件 | Public-Facing Experience + Email | 前者處理受眾、訊息與行動；後者負責發送與分析 |
| 主視覺與素材 | Public-Facing Experience + ImageGen | 前者提供視覺目的與語境；後者生成影像 |

## 5. 預定的 Skill 結構

```text
public-facing-experience/
├─ SKILL.md
├─ agents/
│  └─ openai.yaml
├─ references/
│  ├─ source-and-evidence.md
│  ├─ goals-audience-and-outcomes.md
│  ├─ page-role-and-cta.md
│  ├─ reader-emotion-and-copy.md
│  ├─ visual-grammar.md
│  ├─ persona-audit.md
│  ├─ production-review.md
│  └─ cablate-adapter.md
├─ assets/
│  ├─ master-plan-template.md
│  ├─ page-role-matrix-template.md
│  └─ persona-audit-template.md
└─ scripts/
   ├─ audit-links.mjs
   └─ capture-viewports.mjs
```

### 5.1 `SKILL.md` 只負責

- 判斷產出類型與外部受眾。
- 確認預期讀者結果與當前範圍。
- 選擇需要讀取的 reference。
- 定義這次應產出的 artifact 與驗證方式。
- 在完成使用者要求後停止，不自動擴張。

### 5.2 References 負責

- 保存詳細方法、檢查表、反模式與案例。
- 依需求載入，不要求每次全讀。
- 通用方法與 CabLate 專屬資訊分離。

### 5.3 CabLate adapter 負責

- 品牌與產品目標。
- CabAI、服務、課程與社群關係。
- 聯絡資訊與真實 destination。
- 客戶匿名、無營收數字、公開安全證據等紅線。
- 目前採用的紙面視覺與頁面語法。

其他品牌或專案不載入這份 reference。

## 6. 這次網站過程應成為哪些 Skill 資產

### 6.1 可重複使用的規則

- 先定義網站或產出的目的，再決定內容與版面。
- 每頁、每區與每個 CTA 都應有清楚任務。
- 從讀者當下的理解與情緒決定下一步，不從現有素材數量決定要塞什麼。
- 證據的視覺權重應符合它在說服中的實際價值。
- 內容正確不代表呈現有效；必須看真實渲染、斷句與閱讀順序。
- 說明與實作必須由 behavior contract、截圖與 browser verification 對齊。
- 完整改版需要 checkpoint、scope boundary、phase 與 rollback 能力。

### 6.2 應收錄的反模式

- 有什麼素材就塞什麼，造成每頁都在重複展示能力。
- 先生成漂亮視覺，再勉強把內容塞進去。
- 每個區塊都加 CTA，卻沒有考慮讀者當下想做什麼。
- 把強證據縮成角落小字，把抽象口號做成最大標題。
- 每頁使用相同卡片結構，沒有反映頁面角色。
- 只看程式碼或單一 viewport，沒有確認真實斷句與 safe padding。
- 說會這樣做，但實作採用另一套邏輯。
- 為了解決一個 responsive 問題，破壞已確認的視覺語法。
- 依過期內容承諾不存在的文章、電子報、課程或聯絡方式。

### 6.3 應做成模板的產出

- Site／artifact purpose master plan。
- Audience、job、emotion、evidence、next-action matrix。
- Page／section role matrix。
- CTA hierarchy table。
- Copy before／after review。
- Persona reading audit。
- Behavior contract。
- Production verification checklist。
- Screenshot evidence index。

### 6.4 適合腳本化的部分

- 多 viewport 截圖與 geometry 檢查。
- 連結、mailto、external target 與 dead route audit。
- 搜尋重複 CTA、placeholder email、未替換文字與高風險詞。
- Heading hierarchy、horizontal overflow 與最小 touch target spot check。
- Build、diff、dependency 與 generated route verification。

## 7. 未來優先回讀的專案文件

以下文件不是未來 Skill 的內容本身，而是提煉規則與案例的來源：

### 長期目標與頁面分工

- `docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md`
- `docs/content/site-production-copy-visual-master-plan-2026-07-12.md`
- `docs/content/full-site-content-map-2026-07-11.md`

### 文案、閱讀旅程與自然語氣

- `docs/content/madebypan-copy-journey-analysis-and-cablate-direction-2026-07-11.md`
- `docs/content/copy-voice-guidelines-2026-07-11.md`
- `docs/content/site-speak-human-cleanup-master-plan-2026-07-13.md`

### Persona 與實際訪客障礙

- `docs/design/audits/2026-07-12-persona-site-audit.md`
- `docs/design/audits/2026-07-13-current-persona-review.md`
- `docs/design/audits/2026-07-13-five-persona-implementation/`

### 視覺語法與頁面差異

- `docs/contracts/full-site-visual-system-2026-07-11.md`
- `docs/contracts/site-visual-language-rollout-2026-07-12.md`
- `docs/design/about-layout-plan-2026-07-12.md`
- 其他頁面 layout plans 與 ImageGen references。

### 說做一致、修正與 production evidence

- `docs/contracts/homepage-narrative-refinement-2026-07-11.md`
- `docs/contracts/sitewide-paper-and-copy-refinement-2026-07-12.md`
- `docs/contracts/site-p1-p2-hardening-2026-07-13.md`
- `docs/contracts/cabai-contact-conversion-integration-2026-07-13.md`
- `docs/content/homepage-trust-conversion-correction-master-plan-2026-07-13.md`
- `docs/contracts/homepage-trust-conversion-correction-2026-07-13.md`
- `docs/design/audits/2026-07-13-homepage-trust-conversion/`

## 8. 不應直接搬進 Skill 的內容

- 全部原始對話紀錄。
- 一次性的情緒反應或沒有形成結論的嘗試。
- 過期的頁面內容、商品狀態與數字。
- 只對 CabLate 有效、卻被寫成通用規則的視覺偏好。
- 大量重複截圖與沒有標註用途的設計版本。
- 已經由既有格式 Skill 處理的通用簡報、文件或前端知識。

過去對話與失敗版本應轉成：

- 可辨識的反模式。
- 能重現的測試 prompt。
- before／after artifact。
- 驗收條件與 regression boundary。

## 9. 網站完成後的建立順序

1. 完成個人網站與最後人工審查。
2. 盤點所有 master plans、contracts、audits、截圖與 commits。
3. 將內容分類為：通用規則、CabLate adapter、格式工具責任、歷史噪音。
4. 定義 8 至 12 個具體使用情境，包含只使用單一模組與完整流程。
5. 使用 `skill-creator` 的 `init_skill.py` 初始化正式 Skill。
6. 先建立 references、templates 與 scripts，再撰寫精簡的 `SKILL.md` routing layer。
7. 執行 `quick_validate.py`。
8. 以沒有本次對話背景的新任務進行 forward-test。
9. 根據測試結果縮短規則、補足缺失，移除只能靠 CabLate 隱性背景才能成功的部分。

## 10. 第一輪 forward-test 場景

正式 Skill 至少應獨立測試：

1. 只 review 一段服務頁文案，不改版。
2. 從一包素材建立個人官網 master plan，不實作。
3. Review 一份公開簡報的受眾、敘事與證據。
4. Review 一份客戶報告是否能支持決策。
5. 改善課程銷售頁的信任與選擇路徑。
6. 對既有網站執行五種 Persona 閱讀 audit。
7. 只執行 production-ready 檢查，不重寫內容。
8. 對 CabLate 專案載入 adapter，對其他專案不載入。

## 11. 成功標準

第一版 Skill 只有在以下條件成立時才算成功：

- 使用者可以只使用需要的部分，不被迫完成整套流程。
- 能跨官網、行銷頁、簡報、報告與提案等不同媒介使用。
- 能明確區分「理解、信任、決策、行動」等不同預期讀者結果。
- 不把所有內容硬改成銷售文案或 CTA。
- 不把格式製作能力與受眾策略混為一談。
- 能保留事實、紅線與使用者已確認的視覺方向。
- 能從真實 artifact、browser、render 或檔案結果驗證，而不是只提供抽象建議。
- 說明、計畫、實作與驗證結果保持一致。
- `SKILL.md` 維持精簡，詳細內容依需求從 references 載入。

## 12. 最終提醒

這次個人網站的價值不只在完成一個網站，而是在反覆規劃、失敗、回退、人工審查與 production verification 中，累積了一套能辨識「對外內容為什麼沒有作用」的方法。

文件留存的目的不是保存所有過程，而是讓未來能從證據中提煉出穩定、可選用、可驗證，而且不依賴本次對話記憶的 Skill。
