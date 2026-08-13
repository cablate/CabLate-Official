---
schema_version: behavior-contract/v2
id: cablate.service-application-and-lead-ledger
title: CabLate service intake, delivery, and learning loop
status: local-implementation-production-config-gated
owner_surface: shared
authority: D:/_CabLate_Agents/general/knowledge/business/revenue-pipeline-ledger.md
change_context:
  type: feature
  reason: 將 Email 草稿與高負擔長表單，改成可直接送達、低摩擦分流且能累積服務洞察的正式入口。
---

# Service Intake, Delivery, And Learning Loop Contract

## 前台目的

表單只收會改變三件事的資訊：

1. 應該走哪一條服務路線。
2. Cab 會前要先準備什麼。
3. 哪些需求反覆出現，值得改善服務與文案。

不符合以上用途的問題移到會談或會後紀錄，不把完整診斷與市場研究成本轉嫁給訪客。

## 兩條主要路線

| 路線 | 公開承諾 | 表單只多問什麼 | 不承諾什麼 |
|---|---|---|---|
| 60 分鐘付費諮詢 | 針對一個具體問題做診斷、取捨與下一步 | 這次最需要帶走的判斷 | 不包含代開發與五週持續陪跑 |
| 30 分鐘免費陪跑訪談 | 理解情境並確認五週陪跑是否適合 | 目前最接近的使用／卡關階段 | 不是免費諮詢，不承諾當場解完問題 |

企業與講師合作沿用同一個低摩擦骨架，但各自有一題可彙整的合作類型。

## 最小資料契約

必要欄位：

- `application_version`
- `submission_id`
- `service`
- `name`
- `email`
- `situation`：同一題取得想推進的事與主要卡點
- `focus`：依服務路線變化的單選題
- `consent`
- `source_path`
- `source_key`
- `cf_turnstile_response`

選填欄位：`organization`、`preferred_timing`、`reference_links`、四個 UTM 欄位。

已刪除的前台重複題：`current_work`、`main_blocker`、`attempted_work`、`desired_change`、`cab_help`。需要時在會談中追問，不再全部設為表單必填。

## 安全與送達

1. 前端以原生 `<form>`、label、fieldset、radio、autocomplete 與 HTML constraint validation 為基礎。
2. POST 由 `/functions/api/service-application.js` 處理；client-side validation 只改善體驗，server 重新驗證所有欄位。
3. 只接受 same-origin JSON 請求，並用 honeypot 與 Cloudflare Turnstile 阻擋大量機器提交。
4. Turnstile token 必須在 server 端呼叫 Siteverify；production 同時檢查 action 與 hostname。
5. Turnstile token 單次使用且會過期；失敗時前端 reset，不重用 token。
6. Resend API key、Turnstile secret、寄件與收件設定只存在 Cloudflare secrets／environment，不寫入 repository。
7. Resend 使用 `submission_id` 作為 24 小時 idempotency key，避免重試造成重複信件。
8. 不要求密碼、Token、未遮蔽客戶資料或公司機密原文。
9. 申請頁維持 `noindex` 並停用 GA4；不得把個資放進分析事件。

## 可接受的狀態名稱

| 狀態 | 可以宣稱什麼 | 不可以宣稱什麼 |
|---|---|---|
| `draft` | 訪客正在填寫 | Cab 已收到 |
| `submitting` | 正在驗證與寄送 | 一定送達 |
| `received` | Pages Function 已取得 Resend 成功回應，顯示申請編號 | 已接受合作、已收款、已保留時段 |
| `email_received` | CabLate 信箱可看到申請信 | 已成交 |
| `ledger_recorded` | 唯一 Ledger 已建立或更新同一筆 lead | 已成交 |
| `conversation` | 已開始確認需求與適配 | 已成立合約 |

只有後端確認成功後，頁面才能顯示「申請已送達」。送達不等於付款、保留時段或接受合作。

## 唯一 Lead Ledger

唯一 owning authority 是：

`D:/_CabLate_Agents/general/knowledge/business/revenue-pipeline-ledger.md`

Cab 收到申請後：

1. 先用 `lead_id` 搜尋 Ledger；找得到就更新原列，不新增第二列。
2. 找不到時才在 `Current Pipeline` 新增一列，交付狀態先記 `lead`。
3. `類型` 使用公開服務名稱；`owner` 預設 `Cab`。
4. active lead 必須有 `next_action` 與 `next_date`；無日期則改成 `nurture` 或 `unknown`。
5. `source` 或證據欄只記 `lead_id`、`source_key` 與收到日期，不把整封含個資信件複製進 Ledger。

## 會談後的服務學習紀錄

表單不是完整研究問卷。會談結束後，內部才補：

- 表面問題與真正根因
- AI 是否是主要解法
- 使用者描述問題的原話
- 適合／不適合的服務與原因
- 決策障礙或常見異議
- 下一步與後續結果

重複出現的模式才用來修改服務頁、FAQ、產品內容與會談流程；個人原始內容不得直接公開成案例。

## Production Gate

本機可以用 Cloudflare 官方測試 Turnstile key 與 `SERVICE_APPLICATION_DRY_RUN=true` 驗收。正式發布前必須由 Cab 完成：

- 建立 production Turnstile widget，限制 hostname 為 `cablate.com`／`www.cablate.com`。
- 在 Cloudflare Pages 設定 encrypted secrets：`TURNSTILE_SECRET_KEY`、`RESEND_API_KEY`。
- 設定 environment variables：`TURNSTILE_SITE_KEY`、`SERVICE_APPLICATION_FROM`、`SERVICE_APPLICATION_TO`。
- Resend 寄件網域已驗證，正式寄件地址成立。
- Preview 與 production 分開設定；production 不得使用官方測試 key 或 dry-run。
- 進行一次真實收信 read-back；未觀察到信箱收件前，狀態維持 `unverified`。

## 驗收

```gherkin
Scenario: visitor enters from consulting page
  Given the URL contains service=consulting
  Then consulting is preselected and the service grid is collapsed
  And only the consulting focus question is required

Scenario: visitor enters from coaching page
  Given the URL contains service=coaching
  Then the page explains the 30-minute interview boundary
  And the visitor is not promised a free diagnosis

Scenario: valid application is delivered
  Given all required fields, consent, and Turnstile are valid
  When the visitor submits once
  Then the Function validates again on the server
  And Resend receives one request with an idempotency key
  And the page shows a lead ID only after the provider returns success

Scenario: provider delivery fails
  When Resend does not confirm the request
  Then the page keeps the form data on screen
  And states that the application was not delivered
  And offers the CabLate contact email as recovery
```

## 自動檢查

- `npm run validate:service-application`
- `npm run check`
- `npm run validate:content`
- `npm run build`
- `git diff --check`
