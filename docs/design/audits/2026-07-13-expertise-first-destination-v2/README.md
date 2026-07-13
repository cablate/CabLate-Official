# Expertise First Destination V2 Evidence

日期：2026-07-13  
驗證版本：`cdee402 fix: enforce symptom-first expertise flow`

## 驗證範圍

本資料夾驗證首頁 `查看診斷方法` 進入 `/expertise/` 後的完整旅程：

1. 先從症狀辨認問題，不先要求訪客理解方法名詞。
2. 依 Case A 至 D 完成最小檢查。
3. 再用 Context、Harness、Skill 確認改善訊號與下一層條件。
4. 保留「不是每個問題都需要 Agent」的判斷邊界。
5. 最後前往 Courses 自行學習，或前往 Services 討論實際情境。

本輪沒有修改首頁、About、Work、Courses、Services，也沒有恢復 Article CTA，或新增 CabAI、Discord、Email、商品直連、動畫與套件。

## 截圖索引

### 完整旅程

- `homepage-entry-1440x900.png`：首頁進入 Expertise 的既有入口。
- `desktop-1440x900-full.png`：1440px 完整頁面。
- `desktop-1280x720-full.png`：1280px 一般筆電完整頁面。
- `mobile-390x844-full.png`：390px 完整頁面。
- `mobile-360x800-full.png`：360px 完整頁面。
- `mobile-320x568-full.png`：320px 最窄支援尺寸完整頁面。

### 局部核對

- `desktop-1440x900-diagnosis.png`：完整 Case A 至 D 診斷表。
- `desktop-1440x900-method-map.png`：Context、Harness、Skill 方法對照與 Boundary note。
- `desktop-1440x900-page-end.png`：Courses／Services 頁尾行動。
- `mobile-390x844-diagnosis.png`：Mobile 症狀優先順序與安全內距。
- `mobile-390x844-method-map.png`：Mobile 方法對照、Route 與 Boundary note。
- `mobile-390x844-page-end.png`：Mobile 頁尾行動。
- `mobile-320x568-page-end.png`：最窄尺寸按鈕、Footer 與水平溢位核對。

## 幾何與篇幅量測

所有尺寸均符合 `scrollWidth === clientWidth`，沒有水平溢位。

| Viewport | Diagnosis 高度 | Method map 高度 | Method／Diagnosis |
| --- | ---: | ---: | ---: |
| 320 × 568 | 2400px | 1809px | 0.754 |
| 360 × 800 | 2315px | 1770px | 0.765 |
| 390 × 844 | 2202px | 1685px | 0.765 |
| 1280 × 720 | 1330px | 1096px | 0.824 |
| 1440 × 900 | 1297px | 1141px | 0.880 |

- Hero 與 Route 的頁內連結高度為 44px。
- Courses 與 Services CTA 高度為 48px。
- 390px Mobile 點擊 Hero 後，固定 Headbar bottom 為 70px，Diagnosis heading top 為 260px，保留 190px 安全距離。
- 320、360、390、1280、1440 的方法對照都短於 Diagnosis；Mobile 沒有靠縮字或壓縮紙張內距達成。

## DOM 與內容核對

五種尺寸的 production DOM 均符合：

- Case A 至 D 與症狀出現在方法分類之前。
- 方法分類只在症狀與提問後顯示為 `可能卡在：資訊脈絡／Context` 等弱化輔助資訊。
- 公開方法名稱固定為 Context、Harness、Skill；中文只作輔助說明。
- Method map 已移除 `method.definition`，只回答「修好後會看見什麼」與「什麼時候往下一層查」。
- Route 壓縮為 `Context → Harness → Skill`，並保留真正的 `回到診斷表` 連結。
- Boundary note 保留正常閱讀權重。
- Expertise 可執行的 Article CTA 為 0。

## 真實鍵盤操作

使用實際 Tab、Shift+Tab 與 Enter 事件完成以下路徑：

1. 從頁首連續四次 Tab 聚焦 Hero `先從你看到的問題開始`。
2. Shift+Tab 返回前一個焦點，再 Tab 回到 Hero CTA，確認雙向焦點順序。
3. Enter 前往 `#diagnosis`，標題未被固定 Headbar 遮住。
4. Route 的 `回到診斷表` 通過 Shift+Tab、Tab 與 Enter。
5. Courses CTA 以 Enter 前往 `/courses/`。
6. 再以 Tab 聚焦 Services CTA，Enter 前往 `/services/`。

所有行動均為原生 `<a href>`，且紙張背景上的 `:focus-visible` 清楚可見。

## 自動檢查

- `npm run check`：通過，0 errors、0 warnings；17 個既有 Astro hints。
- `npm run validate:content`：通過。
- `npm run build`：通過，共 48 pages。
- `git diff --check`：通過。

## 人工視覺結論

- 1440 與 1280：四個案例可以橫向比較，右側紙張安全內距完整；Method map 的責任與 Diagnosis 有清楚差異。
- 390、360 與 320：標題沒有孤立標點或複合詞斷裂，Case label 不壓縮正文，CTA 與 Footer 沒有超出紙張。
- 頁面仍維持紫色、紙張、細線、迴紋針與診斷文件語法，沒有退回一般三卡式方法介紹或商品頁。

## 相關 checkpoints

- `f3317f2 chore: checkpoint before expertise correction`
- `300f909 feat: complete expertise diagnosis journey`
- `612c60a fix: refine expertise responsive experience`
- `8dfb9ad docs: verify expertise correction`
- `ecefb96 docs: reopen expertise correction audit`
- `cdee402 fix: enforce symptom-first expertise flow`
