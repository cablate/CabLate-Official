---
status: approved-for-implementation
page: work
source_of_truth:
  - docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md
  - docs/content/full-site-content-map-2026-07-11.md
  - docs/content/copy-voice-guidelines-2026-07-11.md
  - docs/contracts/full-site-visual-system-2026-07-11.md
---

# Work 案例檔案版面計畫

## 這一頁要完成的事

Work 不是作品牆，也不是完整履歷。訪客來這裡是想知道：CabLate 做過哪種問題、在限制下怎麼判斷，以及哪些結果可以被公開檢查。頁面只需要讓人看懂「問題 → 取捨 → 可查證結果」這條線，最後再決定是否進入合作頁。

Primary CTA：閱讀代表檔案；頁尾只用一個情境式連結前往 Services。

## 視覺語法

- 仍沿用 Open Desk Archive 的側欄、紙面、紫色重點與共用內距。
- 不把整頁切成四張同樣大小的卡片；主要內容是一份「案例索引」，每個項目像檔案夾中的一張紀錄。
- Hero 像檔案封面：小型編號與標籤、清楚的主張、短引言與「查看公開檔案」入口。
- 公開作品區用編號列與細分隔線，第一件作為 featured dossier，保留較寬的問題／判斷欄；其餘項目維持同一閱讀骨架但縮短高度。
- 每個案例固定呈現四個欄位：原本的問題、關鍵判斷、公開證據、可前往的檔案。這些欄位是閱讀順序，不是裝飾性 metadata。
- 合作紀錄放在另一張「Project Notes」紙張，明確區分可公開範圍與揭露限制；用迴紋針與小標籤增加檔案感，但不靠圖片素材填版。

## 內容調整原則

1. 先寫訪客能理解的問題，再在需要時出現 MCP、Skill、Webhook 等術語。
2. 不宣稱未授權的客戶成果；匿名合作只說明範圍與限制，不把它包裝成 Case Study。
3. Proof 附日期，動態數字不寫成永久事實；沒有可公開證據的項目不硬補數字。
4. 每個案例只保留一個主要判斷，避免把技術名詞清單塞進描述。
5. CTA 以目的命名，例如「查看公開檔案」或「查看合作方式」，不使用空泛的「了解更多」。

## 版面結構

```text
Hero / CASE FILES 03
  └─ 一句作品觀 + 短引言 + 查看公開檔案

Selected dossiers / 公開檔案
  ├─ featured：Claude Code 工程手冊
  ├─ dossier：mcp-google-map
  ├─ dossier：金流課程系統
  └─ dossier：banini-tracker

Project Notes / 有限揭露合作紀錄
  ├─ 企業 AI 導入與內訓
  └─ 電商平台 MCP 合作測試
  └─ 情境式 CTA → Services
```

## Responsive 與驗收

- 桌機：案例索引保留編號欄、主內容欄、證據欄；featured 檔案可有獨立的證據側欄。
- 手機：每件案例依序讀「編號／類型 → 標題 → 問題 → 判斷 → 證據 → 入口」，不使用橫向滾動或壓縮成窄欄。
- 所有案例容器設定 `min-inline-size: 0`，長標題與 URL 不得撐破紙張；使用 Grid 的 `minmax(0, 1fr)`。
- 驗收 1440×900 與 423×900：`scrollWidth === clientWidth`，紙張內距至少 20px，標題不溢出，手機 CTA 維持可點擊尺寸。
- 實作完成後執行 `npm.cmd run check`、`npm.cmd run build`、`git diff --check`，並建立 implementation checkpoint。
