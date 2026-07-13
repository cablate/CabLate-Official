---
status: approved-for-implementation
page: courses
source_of_truth:
  - docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md
  - docs/content/full-site-content-map-2026-07-11.md
  - docs/content/copy-voice-guidelines-2026-07-11.md
  - src/config/authority.ts
---

# Courses 學習地圖版面規劃

## 頁面任務

Courses 不做課程商品牆，而是幫訪客回答「我現在該學到哪一層？」。閱讀順序是：先降低一次學完的壓力，再依目前卡點選一個入口，最後理解內容會如何交付。

## 情緒與決策順序

1. 先讓剛開始的人鬆一口氣：不用一次買最完整的內容。
2. 讓已經在使用的人看見下一個能力缺口，而不是被迫回到初學者起點。
3. 清楚保留尚未開放的講座與工作坊，讓訪客知道完整路線；以較低權重標示狀態，避免誤認成可購買商品。
4. 將 Primary CTA 收斂為「開始一項目前可用內容」；每一個路徑項目只做對應的 contextual CTA。

## 版面語法

- Hero：紙面上的路線封面，使用 `LEARNING MAP / 04` 作索引，不放課程數量或促銷詞。
- Unified learning map：呈現由「先判斷方向」走到「反覆查閱與診斷」的完整縱向路線。每個節點以訪客的卡點開頭，再交代入口、成果、適合情境、價格與 contextual CTA。
- Pending route：未開放的講座與工作坊保留完整節點，以虛線、較淡底色與文字狀態降級，不渲染假連結；日後補上 `href` 與價格即可直接轉為可開始項目。
- CabAI delivery note：用較小的紙面區塊說明試看、購買內容、Google 帳號與 Discord 身分的關係，不與學習入口競爭主決策。
- 免費／付費分界併入地圖導語，不再另建重複區塊。

## 內容閘門

- 只使用 `authority.ts` 的 `learningPath`，避免頁面再次複製產品狀態與 CTA。
- 不補未確認的開課日期、價格、學員人數或成果承諾。
- 「目前未開放公開報名」是狀態說明，不是可點擊的 CTA。
- 不把課程詳情頁的測試資料誤曝光到學習路線索引。

## Responsive QA

- 桌機維持左側固定導覽與紙面間距；路線內容在同一軸上對齊。
- 手機改為單欄縱向路線，編號與文字保持清楚的內縮，不能產生水平溢位。
- 標題使用 `text-wrap: balance`，段落使用 `text-wrap: pretty`，並檢查長標題與外部 CTA 的斷句。
- 驗證 1440 × 900 與 424 × 900 的截圖、`scrollWidth === clientWidth`、`npm.cmd run check`、`npm.cmd run build`。

## 本輪視覺方向（ImageGen 只作參考）

- 桌機方向圖：`docs/design/generated/courses/courses-desktop-learning-map-direction-v1.png`
- 手機方向圖：`docs/design/generated/courses/courses-mobile-learning-map-direction-v1.png`
- 方向圖保留「紙面上的學習路線」概念：一條清楚的縱向軸、節點編號、可開始／未開放狀態，以及紙條與迴紋針作為定位提示。
- 方向圖中的虛構文字、狀態、圖示與尺寸不直接搬入網站；網站仍以 `learningPath` 的真實資料為唯一內容來源。
- 程式實作只採用既有紙質背景、紫色識別、共用安全內距與原生 CSS；不新增圖片依賴，也不改變頁面文案任務。

## 實作邊界

- 強化路線節點與狀態的掃讀層級，讓「現在可開始」與「尚未開放」在不閱讀全文時也能分辨。
- 保留三段閱讀順序：Hero 降低焦慮、統一地圖完成選擇、CabAI 說明交付方式。
- 同一個可開始入口在主要內容中只完整呈現一次。
- 桌機維持寬鬆的編輯文件節奏；手機只縮短間距與節點尺寸，不把四階段改成橫向卡片或水平滑動。
- 細修只限 Courses 相關頁面、文件與參考圖；Starter Pack 已退役，不再納入 Courses 路線圖。
