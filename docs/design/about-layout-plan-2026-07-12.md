---
status: approved-for-implementation
page: about
source_of_truth:
  - docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md
  - docs/design/visual-language-reference-2026-07-12/about-current-desktop-long.png
  - docs/design/visual-language-reference-2026-07-12/about-current-mobile-long.png
---

# About 版面重構計畫

## 頁面任務

About 是信任補強頁，不是履歷，也不是第二個 Work。訪客讀完要明白：CabLate 的判斷方式不是憑空出現，而是從一次次「做出來卻不能放心使用」的經驗中形成；接著能帶著這個理解去看代表作品。

## 閱讀情緒

```text
我想知道你為什麼值得相信
→ 原來你也遇過交付失敗的落差
→ 這些轉折形成了一套可說明的方法
→ 你不只說理念，還留下可檢查的作品
→ 我可以再去看案例，而不是被要求立刻合作
```

## 版面骨架

### 1. Identity opening

- 一張寬紙面，左側大標題，右側身份與工作定義。
- 不放時間、統計數字或產品名單。
- 只完成一個任務：建立「這個人如何看待交付」的第一印象。

### 2. Turning point

- 一張完整紙面，標題為「我在意交付，因為做出來不等於能使用」。
- 左側是轉折句，右側是兩到三段短文。
- 以留白和細分隔線形成工作筆記感，不加全頁裝飾線。

### 3. Timeline

- 時間軸只存在這個區塊內，包含三個節點：非本科轉職、進入複雜系統、投入 AI 應用。
- Desktop：左欄時間，中央節點，右欄標題與說明；節點線在紙面上下邊界內連續。
- Mobile：時間在標題上方，節點線位於內容左側安全區；內容保持至少 16px 內文寬度，不讓 rail 搶走文字空間。
- 三個節點各自回答「當時遇到什麼」「因此開始在意什麼」，避免變成職歷列表。

### 4. Evidence

- 公開作品使用單一清單，不使用三張相同卡片。
- 每列固定為：作品名稱、它證明的能力、可公開指標、日期。
- 作品是人物故事的證據，不在 About 展開完整案例；完整限制與判斷留給 Work。

### 5. Principles

- 四項工作原則是故事收束，不是時間軸節點。
- Desktop 使用 2×2 的工作筆記格；Mobile 改為單欄短段落。
- 每項原則只保留一句標題與一句白話說明，避免變成方法名詞清單。

### 6. Next step

- 一個主要 CTA：「查看代表作品」。
- 專業方法、GitHub、Threads 只作低層級次要連結。
- 不再添加服務、課程或電子報分流，避免 About 變成首頁。

## 共用視覺轉譯

- ImageGen 只作紙張材質、留白、分欄和時間軸節奏的方向參考；不照抄圖片文字或邊框。
- 紙張背景由共用 `.paper-card` 提供；區塊內距由頁面 CSS 固定在安全範圍，不能靠背景圖假裝留白。
- 紫色只用於節點、標籤與 CTA；正文仍使用深藍與灰階。
- 迴紋針／標籤只在 timeline 或 evidence 區支援定位，不每個區塊都放。

## 驗收條件

- Desktop 與 Mobile 都能在五秒內辨識「人物故事＋三個轉折＋代表作品」。
- 時間軸只影響三個轉折區塊，其他區塊不被 rail 或階段標籤侵入。
- Mobile 內容寬度不低於 16px 文字可讀性與 44px 互動目標；無水平溢位。
- 不新增產品承諾、數字、案例或未經確認的經歷。
- `npm.cmd run check`、`npm.cmd run build`、長條 PC／Mobile 截圖均通過後，才建立 About 實作 checkpoint。
