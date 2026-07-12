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

Courses 不做課程商品牆，而是幫訪客回答「我現在該學到哪一層？」。閱讀順序是：先辨認自己所在的階段，再比較適合的入口，最後只前往目前真的能開始的內容。

## 情緒與決策順序

1. 先讓剛開始的人鬆一口氣：不用一次買最完整的內容。
2. 讓已經在使用的人看見下一個能力缺口，而不是被迫回到初學者起點。
3. 清楚標出尚未開放的講座與系統課程，避免把規劃中的內容誤認成可購買商品。
4. 將 Primary CTA 收斂為「開始一項目前可用內容」；每一個路徑項目只做對應的 contextual CTA。

## 版面語法

- Hero：紙面上的路線封面，使用 `LEARNING MAP / 04` 作索引，不放課程數量或促銷詞。
- Learning map：一條由「先判斷方向」走到「反覆查閱與診斷」的縱向路線。編號、階段、成果、適合情境與狀態沿同一條軸排列，讓訪客能快速比較。
- Available now：只列目前可採取的入口，作為地圖後的落點；不可用項目不渲染假連結。
- Boundary note：以短文說明免費內容與付費內容的分界，避免把所有內容都導向購買。

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
- 保留目前的三段閱讀順序：先看地圖、再看可開始入口、最後理解免費／付費分界。
- 桌機維持寬鬆的編輯文件節奏；手機只縮短間距與節點尺寸，不把四階段改成橫向卡片或水平滑動。
- 細修只限 Courses 相關頁面、文件與參考圖；Starter Pack 的既有未提交變更不在本輪範圍。
