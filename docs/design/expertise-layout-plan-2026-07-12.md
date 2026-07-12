---
status: approved-for-implementation
page: expertise
source_of_truth:
  - docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md
  - docs/design/shared-paper-surface-contract-2026-07-11.md
---

# Expertise 版面重構計畫

## 頁面責任

Expertise 是「失效診斷入口」，不是方法名詞清單，也不是首頁診斷區的長版。訪客讀完要能回答：我看到的現象比較像哪一層？下一個最小檢查是什麼？接著去哪一篇文章？

Primary CTA：閱讀對應問題文章。

## 閱讀路徑

```text
我遇到的現象
→ 先確認問題出在哪一層
→ 知道該檢查什麼、避免哪個誤判
→ 對照方法的適用範圍
→ 閱讀一篇對應文章
```

## 區塊結構

### 1. Hero：先讓訪客認出問題

- 只回答「為什麼一直加 Prompt 仍然沒有改善」。
- 保留一句白話解釋與一個跳到診斷表的入口。
- 不在 Hero 放方法名詞、產品或服務 CTA。

### 2. Diagnosis table：從症狀開始排查

- 區塊標題先說行動：「先找到最像的現象，再做一個能排除原因的檢查。」
- 每列固定四個欄位：編號／方法入口、症狀與提問、先檢查、常見誤判。
- 每列只保留一個文章入口，讓文章成為證據與延伸，不讓整頁變成連結清單。
- Desktop 使用穩定欄位對齊；Mobile 改為「症狀 → 先檢查 → 常見誤判 → 文章」的單欄順序。

### 3. Method map：把方法放回問題裡

- 以三列比較 Context Engineering、Harness Engineering、Skill 設計。
- 每列回答「這個方法在看什麼」與「什麼情況適合先看它」。
- 方法名稱是定位標籤，不是主角；主角仍是訪客正在排查的問題。
- 在表格下方用一小段說明：不是每個問題都需要 Agent；能用簡單自動化穩定解決，就先用簡單方法。

## 視覺語法

- 共用紙張只承擔材質與內距；診斷列用細線、欄位標籤與編號建立文件感。
- 紫色只用於方法標籤、編號、連結與目前閱讀入口，不作大面積底色。
- 迴紋針只放在診斷表紙面左上，讓它有「排查文件」的用途；Hero 與方法對照不重複放。
- 不使用全頁時間軸、不用三張等寬卡片、不用額外統計數字。
- 標題採明確人工斷句；Mobile 重新確認每個欄位有至少 16px 內文寬度與 44px 連結點擊區。

## 驗收條件

- 五秒內知道這頁是「找出 AI 失效層級」的診斷入口。
- Desktop 診斷列的症狀、檢查、誤判可以橫向掃讀；Mobile 按自然閱讀順序堆疊。
- 方法對照不會重複診斷表全文，也不把 Agent 包裝成預設答案。
- 無水平溢位，紙張內容不超出安全內距。
- `npm.cmd run check`、`npm.cmd run build` 通過，並完成桌機／手機實際畫面核對。

## 2026-07-12 視覺提案轉譯

選用參考：

- `docs/design/generated/expertise/expertise-desktop-diagnostic-document-v1.png`
- `docs/design/generated/expertise/expertise-mobile-diagnostic-document-v2-selected.png`

保留的結構不是圖片像素，而是三個可用的閱讀機制：

1. 診斷區使用固定欄位，讓 Desktop 能橫向比較「現象／最小檢查／常見誤判／文章」。
2. 方法區和診斷區使用不同語法：方法區負責比較適用情境、邊界與閱讀入口，並補上一條 Context → Harness → Skill 的建議路徑。
3. 「不是每個問題都需要 Agent」獨立成邊界備註，不再埋在頁尾小字。

Mobile 第一版提案 `expertise-mobile-diagnostic-document-v1-rejected-squeezed-table.png` 因把 Desktop 表格壓縮進窄畫面而否決。實作採第二版原則：每筆診斷依「層級 → 現象 → 最小檢查 → 常見誤判 → 文章」垂直展開，保留正常字級與至少 44px 的文章入口。

ImageGen 中的圖示、章戳與細節不逐像素照抄；production 只使用 HTML、CSS、既有紙張材質、細線、編號與少量 pseudo-element 裝飾完成。
