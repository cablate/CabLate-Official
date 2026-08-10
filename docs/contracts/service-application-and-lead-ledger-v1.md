---
schema_version: behavior-contract/v1
id: cablate.service-application-and-lead-ledger
title: CabLate service application and lead ledger
status: local-ready-production-gated
owner_surface: shared
authority: D:/_CabLate_Agents/general/knowledge/business/revenue-pipeline-ledger.md
supersedes:
  - cablate.cabai-contact-conversion#services-primary-conversion
change_context:
  type: feature
  reason: 讓四種服務從「直接寄一封空白 Email」改成可辨認來源、能去重、且不誤報網站已收到的正式申請流程。
---

# Service Application And Lead Ledger Contract

## 現行架構

- 四個服務頁共用 `/services/apply/`，以 `service` 與 `source` query 預選合作類型並保留來源。
- 網站是靜態 Astro 站，沒有安全的服務申請後端；申請頁只在瀏覽器內整理內容並開啟 Email 草稿。
- 使用者必須在自己的 Email 應用程式實際寄出，CabLate 收到信件後，才算產生一筆 lead。
- 網站不把申請內容送進 Kit、GA4、CabAI、`localStorage` 或 `sessionStorage`。

## 可接受的狀態名稱

| 狀態 | 可以宣稱什麼 | 不可以宣稱什麼 |
|---|---|---|
| `draft` | 使用者正在填寫 | 已收到申請 |
| `email_prepared` | 已整理 Email 草稿與申請編號 | 已寄出、已保留名額 |
| `email_received` | CabLate 信箱確實收到信 | 已接受合作、已收款 |
| `ledger_recorded` | 已在唯一 Ledger 建立或更新同一筆 lead | 已成交 |
| `conversation` | 已開始確認需求與適配 | 已成立合約 |

## 申請資料契約

必要欄位：

- `application_version`
- `lead_id`
- `service`
- `name`
- `email`
- `current_work`
- `main_blocker`
- `desired_change`
- `cab_help`
- `consent`
- `source_path`
- `source_key`

選填欄位：`organization`、`attempted_work`、`preferred_timing`、`reference_links`、四個 UTM 欄位。

安全規則：

1. 不要求密碼、Token、未遮蔽客戶資料或公司機密原文。
2. `service` 只能是 `consulting`、`coaching`、`enterprise`、`partnerships`。
3. `source` 與 UTM 只接受英數、句點、底線、波浪號與連字號，最多 100 字元。
4. 每次整理草稿產生 `CAB-YYYYMMDD-XXXXXXX` 格式的申請編號。
5. `mailto:` 過長時不得自動開啟，以免信件內容遭截斷；必須保留完整內容供使用者複製。
6. 申請頁停用分析碼並設為 `noindex`，避免把個人資料或未完成申請當成轉換事件。

## 唯一 Lead Ledger

唯一 owning authority 是：

`D:/_CabLate_Agents/general/knowledge/business/revenue-pipeline-ledger.md`

收到申請 Email 後的人工處理：

1. 先用 `lead_id` 搜尋 Ledger；找得到就更新原列，不新增第二列。
2. 找不到時才在 `Current Pipeline` 新增一列，交付狀態先記 `lead`。
3. `對象` 用申請者或組織可辨認名稱；`類型` 使用四種公開服務名稱之一。
4. `owner` 預設 `Cab`；active lead 必須填 `next_action` 與 `next_date`，無日期則改成 `nurture` 或 `unknown`。
5. `source` 或「證據／缺口」至少記錄 `lead_id`、`source_key` 與收到 Email 的日期；不要把整封含個資信件複製進 Ledger。
6. 金額狀態維持 `unknown`，直到真的發生報價、同意、請款或付款證據。

## Production Gate

目前可在本機驗收，但正式發布前仍需要 Cab 核准：

- 隱私權文字與資料處理承諾。
- 退款、取消、改期與正式服務條款。
- 是否接受目前的 Email 草稿過渡方案。

若未來改成網站直接送出，必須另做後端契約與驗收：server-side validation、CSRF／spam 防護、保存期限、刪除流程、寄送失敗狀態與真實 receipt。只有後端確認成功後，頁面才能顯示「已收到申請」。

## 驗收

```gherkin
Scenario: visitor starts from a service page
  Given the visitor is reading one of the four service pages
  When they activate the primary application action
  Then they arrive at /services/apply/
  And the matching service is selected
  And the source identifies the originating service page

Scenario: visitor prepares an application
  Given all required fields and consent are valid
  When the visitor submits the form
  Then the page creates a unique lead ID
  And prepares an Email draft addressed to cablate@cablate.com
  And states that opening the draft does not mean Cab received it

Scenario: Cab receives an application Email
  Given the Email contains a lead ID
  When Cab records the lead
  Then the revenue pipeline ledger is searched by lead ID first
  And exactly one row owns the mutable pipeline state
```

## 自動檢查

- `npm run validate:service-application`
- `npm run check`
- `npm run validate:content`
- `npm run build`
- `git diff --check`
