---
status: approved-for-implementation
page: articles
source_of_truth:
  - docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md
  - docs/content/full-site-content-map-2026-07-11.md
  - docs/content/copy-voice-guidelines-2026-07-11.md
  - src/content/config.ts
---

# Articles 編輯目錄版面規劃

## 頁面任務

Articles 不只是依日期排列的文章倉庫，而是一份讓訪客在 30 秒內找到閱讀起點的編輯目錄。主索引按「現在遇到的問題」分流，分類與標籤放在次要層。

## 情緒與決策順序

1. 先承認訪客通常不是想瀏覽所有文章，而是想解決眼前的一個卡點。
2. 用四條已存在的閱讀路徑，讓他從症狀直接進入一篇有上下文的實作紀錄。
3. 路徑讀完後才提供分類索引，讓想延伸研究的人可以按主題繼續。
4. 其餘文章只出現一次，避免同一篇同時佔據推薦、分類與列表，讓頁面看起來像塞內容。

## 版面語法

- Hero：編輯目錄封面，使用 `FIELD NOTES / 01`；主標題說明「先找到起點」，不展示文章數量作為主視覺。
- Reading routes：四條問題入口以編輯索引行呈現：編號、症狀、文章標題、閱讀理由、箭頭。桌機可快速掃描，手機改為連續的短檔案。
- Topic index：以兩欄目錄列出實際分類與篇數，附標籤總覽；不再使用大量膠囊按鈕。
- Other notes：路徑未涵蓋的文章才進入下方清單，顯示分類、標題、摘要與日期，保留完整性但不搶主動線。

## 內容閘門

- 路徑 slug 必須存在於已發布文章；草稿不渲染。
- 同一篇文章只能在閱讀路徑或其他筆記清單其中一處出現。
- 日期保留在文章索引，避免把時效性研究寫成永久結論。
- 不使用電子報或固定更新承諾作為 CTA；主 CTA 是開始閱讀一篇對應問題的文章。

## Responsive QA

- 桌機維持左側固定導覽與紙面封面；索引採單一閱讀軸，不回到另一套 landing-page 卡片。
- 手機路徑改為一欄，症狀與標題不互相擠壓；分類列可以換行但不造成水平捲動。
- 標題使用 `text-wrap: balance`，文章摘要使用 `text-wrap: pretty`，日期和分類固定在可掃讀的位置。
- 驗證 1440 × 900 與 424 × 900 截圖、`scrollWidth === clientWidth`、`npm.cmd run check`、`npm.cmd run build`。

## 本輪視覺方向（ImageGen 只作參考）

- 桌機方向圖：`docs/design/generated/articles/articles-desktop-editorial-index-direction-v1.png`
- 手機方向圖：`docs/design/generated/articles/articles-mobile-editorial-index-direction-v1.png`
- 方向圖把 Articles 視為編輯桌上的 field notes index：先以四條問題入口建立閱讀方向，再以分類數量與其他筆記收束，不以文章數量或更新承諾搶注意力。
- 紙張紋理、細線、紙標籤與迴紋針只作定位提示；不直接採用方向圖的虛構標題、分類、數字或排版尺寸，真實文章仍來自內容集合。

## 實作邊界

- 保留既有閱讀路徑、主題索引與其他筆記三段順序；只強化每一列的編號、問題、標題、理由與 CTA 層級。
- 桌機維持單一縱向索引軸；手機讓問題、標題與摘要依序換行，CTA 不被推到紙張外。
- 不增加電子報、固定更新或「文章總數」主視覺；分類與標籤是延伸入口，不取代問題導向閱讀。
- 不修改文章 slug、內容集合或 SEO JSON-LD；本輪只限 Articles 頁面樣式、參考圖與規劃文件。
