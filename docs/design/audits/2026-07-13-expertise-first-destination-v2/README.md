# Expertise First Destination V2 Evidence

日期：2026-07-13；Route 與 recovery CTA 最後複核：2026-07-14
驗證基線：`cdee402 fix: enforce symptom-first expertise flow`

Hero CTA 人工複核修正：`fix: restore expertise hero button`

最新 Route 截圖來自 `npm run build` 後的 production preview，不含 Astro Dev Toolbar；五張完整長頁與三張 Route 局部圖均已逐張打開，排除空白、載入中、錯頁與遮罩後才納入證據。

## 驗證範圍

本資料夾驗證首頁 `查看診斷方法` 進入 `/expertise/` 後的完整旅程：

1. 先從症狀辨認問題，不先要求訪客理解方法名詞。
2. 依 Case A 至 D 完成最小檢查。
3. 再用 Context、Skill、Harness 確認改善訊號與下一層條件。
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

- `desktop-1440x900-hero-button.png`：Desktop Hero filled primary button 與首屏層級。
- `desktop-1440x900-diagnosis.png`：完整 Case A 至 D 診斷表。
- `desktop-1440x900-method-map.png`：Context、Skill、Harness 方法對照、Route 與 Boundary note。
- `desktop-1440x900-page-end.png`：Courses／Services 頁尾行動。
- `mobile-390x844-diagnosis.png`：Mobile 症狀優先順序與安全內距。
- `mobile-390x844-hero-button.png`：Mobile Hero 滿寬按鈕與紙張安全內距。
- `mobile-390x844-method-map.png`：Mobile 方法對照、Route 與 Boundary note。
- `mobile-390x844-page-end.png`：Mobile 頁尾行動。
- `mobile-320x568-page-end.png`：最窄尺寸按鈕、Footer 與水平溢位核對。
- `mobile-320x568-method-route-v4.png`：320px 最窄尺寸的 Route 可讀性、箭頭與零水平溢位。

## 幾何與篇幅量測

所有尺寸均符合 `scrollWidth === clientWidth`，沒有水平溢位。

| Viewport | Diagnosis 高度 | Method map 高度 | Method／Diagnosis |
| --- | ---: | ---: | ---: |
| 320 × 568 | 2400px | 1809px | 0.754 |
| 360 × 800 | 2315px | 1770px | 0.765 |
| 390 × 844 | 2202px | 1685px | 0.765 |
| 1280 × 720 | 1330px | 1096px | 0.824 |
| 1440 × 900 | 1297px | 1141px | 0.880 |

- Hero button 與 Route recovery button 高度均為 48px。
- Desktop Hero button 為 232 × 48px；390px Mobile 為 326 × 48px，左右各保留 32px 安全內距。
- Courses 與 Services CTA 高度為 48px。
- 390px Mobile 點擊 Hero 後，固定 Headbar bottom 為 70px，Diagnosis heading top 為 260px，保留 190px 安全距離。
- 320、360、390、1280、1440 的方法對照都短於 Diagnosis；Mobile 沒有靠縮字或壓縮紙張內距達成。

## DOM 與內容核對

五種尺寸的 production DOM 均符合：

- Case A 至 D 與症狀出現在方法分類之前。
- 方法分類只在症狀與提問後顯示為 `可能卡在：資訊脈絡／Context` 等弱化輔助資訊。
- 公開方法名稱固定為 Context、Skill、Harness；中文只作輔助說明。
- Method map 已移除 `method.definition`，只回答「修好後會看見什麼」與「接著怎麼判斷」。
- Route 使用 `01 Context → 02 Skill → 03 Harness`，包含紫色導引線、箭頭與中文輔助標籤。
- `仍不確定？回到診斷表` 是有邊界的 bordered paper button，不是角落的小型底線連結。
- Boundary note 保留正常閱讀權重。
- Expertise 可執行的 Article CTA 為 0。

## 真實鍵盤操作

使用實際 Tab、Shift+Tab 與 Enter 事件完成以下路徑：

1. 從頁首連續四次 Tab 聚焦 Hero `先從你看到的問題開始`。
2. Shift+Tab 返回前一個焦點，再 Tab 回到 Hero CTA，確認雙向焦點順序。
3. Enter 前往 `#diagnosis`，標題未被固定 Headbar 遮住。
4. Route 的 recovery button 通過 focus 與 Enter；390px 啟動後 `#diagnosis` 位於 Headbar 下方約 110px。
5. Courses CTA 以 Enter 前往 `/courses/`。
6. 再以 Tab 聚焦 Services CTA，Enter 前往 `/services/`。

所有行動均為原生 `<a href>`，且紙張背景上的 `:focus-visible` 清楚可見。

Hero 與 Route recovery button 的實測 focus ring 為 2px 實線、2px offset。Route recovery button 為 48px 高；390px Enter 跳轉後 Headbar bottom 約 70px，Diagnosis section top 約 179px，保留約 110px 間距。

Route recovery button 的 production hover 會切換為淡紫底、紫色邊框與深紫文字；focus、hover 與一般狀態不只靠同一種顏色表示。

## 自動檢查

- `npm run check`：通過，0 errors、0 warnings；17 個既有 Astro hints。
- `npm run validate:content`：通過。
- `npm run build`：通過，共 48 pages。
- `git diff --check`：通過。

## 人工視覺結論

- 1440 與 1280：四個案例可以橫向比較，右側紙張安全內距完整；Method map 的責任與 Diagnosis 有清楚差異。
- 390、360 與 320：標題沒有孤立標點或複合詞斷裂，Case label 不壓縮正文，CTA 與 Footer 沒有超出紙張。
- Route 在 1440、390 與 320 都能一眼讀出 Context → Skill → Harness；最窄尺寸仍保留編號、箭頭、中文標籤與明確按鈕邊界。
- 頁面仍維持紫色、紙張、細線、迴紋針與診斷文件語法，沒有退回一般三卡式方法介紹或商品頁。

## 相關 checkpoints

- `f3317f2 chore: checkpoint before expertise correction`
- `300f909 feat: complete expertise diagnosis journey`
- `612c60a fix: refine expertise responsive experience`
- `8dfb9ad docs: verify expertise correction`
- `ecefb96 docs: reopen expertise correction audit`
- `cdee402 fix: enforce symptom-first expertise flow`
