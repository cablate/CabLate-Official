---
status: implemented-with-corrections
page: expertise
updated: 2026-07-14
source_of_truth:
  - docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md
  - docs/content/expertise-first-destination-correction-master-plan-2026-07-13.md
  - docs/design/shared-paper-surface-contract-2026-07-11.md
---

# Expertise 版面重構計畫

## 頁面責任

Expertise 是「失效診斷入口」，不是方法名詞清單，也不是首頁診斷區的長版。訪客讀完要能回答：我看到的現象比較像哪一層？下一個最小檢查是什麼？修到什麼程度可以先停？接著要自己學，還是討論實際情境？

Primary CTA：`查看學習路線`。Secondary CTA：`討論實際情境`。Articles 保留直接造訪，但本頁暫停主動導流。

## 閱讀路徑

```text
我遇到的現象
→ 先確認問題出在哪一層
→ 知道該檢查什麼、避免哪個誤判
→ 對照修好訊號與下一層條件
→ 依現況選擇學習或合作
```

## 區塊結構

### 1. Hero：先讓訪客認出問題

- 只回答「為什麼一直加 Prompt 仍然沒有改善」。
- 保留一句白話解釋與一個跳到診斷表的入口。
- 不在 Hero 放方法名詞、產品或服務 CTA。

### 2. Diagnosis table：從症狀開始排查

- 區塊標題先說行動：「先找到最像的現象，再做一個能排除原因的檢查。」
- 每列固定呈現 Case 編號、症狀與提問、先檢查、常見誤判；方法分類只在症狀之後作為弱化輔助資訊。
- Diagnosis 依讀者症狀排列 Case A 至 D，不為了方法分類而重排。
- Desktop 使用穩定欄位對齊；Mobile 改為「症狀 → 先檢查 → 常見誤判」的單欄順序。

### 3. Method map：把方法放回問題裡

- 以三列比較 Context Engineering、Skill 路線設計、Harness Engineering。
- 每列回答「修好後會看見什麼」與「接著怎麼判斷」。
- 方法名稱是定位標籤，不是主角；主角仍是訪客正在排查的問題。
- Route 以 `01 Context → 02 Skill → 03 Harness`、導引線、箭頭與中文標籤呈現；不能只把三個名詞並排。
- `仍不確定？回到診斷表` 使用可辨識的 bordered paper button，並以原生連結回到 `#diagnosis`。
- 在 Route 下方用一段正常閱讀權重說明：不是每個問題都需要 Agent；能用簡單自動化穩定解決，就先用簡單方法。

## 視覺語法

- 共用紙張只承擔材質與內距；診斷列用細線、欄位標籤與編號建立文件感。
- 紫色只用於方法標籤、編號、連結與目前閱讀入口，不作大面積底色。
- 迴紋針只放在診斷表紙面左上，讓它有「排查文件」的用途；Hero 與方法對照不重複放。
- 不使用全頁時間軸、不用三張等寬卡片、不用額外統計數字。
- 標題採明確人工斷句；Mobile 重新確認紙張安全內距、正常正文寬度與至少 44px 互動高度。

## 驗收條件

- 五秒內知道這頁是「找出 AI 失效層級」的診斷入口。
- Desktop 診斷列的症狀、檢查、誤判可以橫向掃讀；Mobile 按自然閱讀順序堆疊。
- 方法對照不會重複診斷表全文，也不把 Agent 包裝成預設答案。
- Method map 與 Route 的語意、DOM 與視覺順序一致為 Context → Skill → Harness；Diagnosis 繼續依症狀排序。
- Route recovery CTA 一眼可辨識為按鈕，不能只驗收連結存在、可聚焦或高度達標。
- 無水平溢位，紙張內容不超出安全內距。
- `npm.cmd run check`、`npm.cmd run build` 通過，並完成桌機／手機實際畫面核對。

## 2026-07-12 視覺提案轉譯

選用參考：

- `docs/design/generated/expertise/expertise-desktop-diagnostic-document-v1.png`
- `docs/design/generated/expertise/expertise-mobile-diagnostic-document-v2-selected.png`

保留的結構不是圖片像素，而是三個可用的閱讀機制：

1. 診斷區使用固定欄位，讓 Desktop 能橫向比較「現象／最小檢查／常見誤判」。
2. 方法區和診斷區使用不同語法：方法區負責比較改善訊號、下一層條件與判斷邊界，並補上一條 Context → Skill → Harness 的建議路徑。
3. 「不是每個問題都需要 Agent」獨立成邊界備註，不再埋在頁尾小字。

Mobile 第一版提案 `expertise-mobile-diagnostic-document-v1-rejected-squeezed-table.png` 因把 Desktop 表格壓縮進窄畫面而否決。實作採第二版原則：每筆診斷依「現象 → 最小檢查 → 常見誤判」垂直展開，保留正常字級與紙張安全內距；Route recovery CTA 於窄畫面使用紙張內滿寬按鈕。

ImageGen 中的圖示、章戳與細節不逐像素照抄；production 只使用 HTML、CSS、既有紙張材質、細線、編號與少量 pseudo-element 裝飾完成。
