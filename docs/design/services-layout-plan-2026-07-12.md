---
status: approved-for-implementation
page: services
source_of_truth:
  - docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md
  - docs/content/full-site-content-map-2026-07-11.md
  - docs/content/copy-voice-guidelines-2026-07-11.md
  - src/config/authority.ts
---

# Services 合作簡報版面規劃

## 頁面任務

Services 要讓有具體情境的訪客自行判斷「這個問題適合合作嗎、合作後會留下什麼」。它不是服務價目表，也不是把所有能力寫成一張長清單。

## 情緒與決策順序

1. 先承認訪客已經試過工具、卻仍反覆重做的挫折，讓他知道問題不一定是能力不足。
2. 先說合作後會變得更清楚的三件事，再讓訪客比較三種合作深度。
3. 每種合作都同時說明適合情況、交付物與不適合情況，降低錯配與過度期待。
4. 用四步合作流程把抽象服務變成可想像的進展，最後才邀請訪客提交真實情境。

## 版面語法

- Hero：合作簡報封面，使用 `SERVICE BRIEF / 05`；Primary CTA 只指向合作目標區，避免一進頁就要求私訊。
- Outcomes：三個「合作後能看見的變化」，使用編號欄與短段落，不做三張同尺寸行銷卡。
- Service tracks：三份連續的合作摘要，每份保持相同欄位：合作結果、適合誰、會留下什麼、不適合什麼。
- Process：診斷 → 設計 → 推進 → 驗收的橫向步驟，手機改成縱向簡報頁碼。
- Proof／boundaries：放已授權的合作範圍與限制；不把匿名合作包裝成完整案例，不補營收或成效數字。
- CTA：最後才指向 Threads，並說明要提供的五項情境資料。

## 內容閘門

- 只使用 `authority.ts` 的 `serviceTracks`，保持服務名稱、成果與邊界單一來源。
- 「Agent」只在確實涉及產品或系統導入時出現；診斷與內訓不預設需要 Agent。
- 合作 proof 保留日期與公開限制；不寫未授權客戶名稱、Logo、照片或內部成果。
- 不承諾營收、流量或未定義的商業結果。

## Responsive QA

- 桌機沿用左側固定導覽、紙面背景與同一內距；合作軌道的欄位要能對齊掃讀。
- 800px 以下改為單欄，先顯示結果與適配，再顯示交付與限制。
- 520px 以下確認 CTA 不被推到紙張外、列表文字不造成水平溢位。
- 驗證 1440 × 900 與 424 × 900 截圖、`scrollWidth === clientWidth`、`npm.cmd run check`、`npm.cmd run build`。

## 本輪視覺方向（ImageGen 只作參考）

- 桌機方向圖：`docs/design/generated/services/services-desktop-collaboration-brief-direction-v1.png`
- 手機方向圖：`docs/design/generated/services/services-mobile-collaboration-brief-direction-v1.png`
- 方向圖把 Services 視為一份可翻閱的合作簡報：封面先說情境，接著列出可看見的結果，再比較合作深度，最後用流程、邊界與 CTA 收束。
- 紙張、紙條、迴紋針與紫色標記只用來建立閱讀定位，不直接搬入虛構文字、圖示或尺寸；真實文案與服務欄位仍以 `authority.ts` 為唯一來源。

## 實作邊界

- 保留既有紙質背景、固定導覽與安全內距；只改善 Services 內部的欄位對齊、狀態層級與手機縱向節奏。
- Outcomes 維持編號編輯列表，不改成三張相同尺寸的行銷卡；service tracks 維持「結果／適合／交付／不適合」的固定掃讀欄位。
- Process 在桌機保持四欄步驟，在手機改為清楚的縱向頁碼軸；CTA 保持最後出現，避免一進頁就要求私訊。
- 不新增服務承諾、客戶識別、營收或成效數字，也不讓 ImageGen 產出的字樣成為網站內容。
