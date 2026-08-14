# CabLate 服務漏斗 Analytics v1

狀態：本地完成，待 release 後做 GA4 Realtime read-back  
適用範圍：CabLate 全站頁面、服務頁、服務申請頁與工作流健檢  
GA4：`G-HY45BRFPS6`

## 這套量測要回答什麼

1. 哪一種服務有人看，但沒有人進入申請？
2. 使用者是在服務頁、申請頁，還是填表過程離開？
3. 哪個頁面位置的 CTA 比較能帶來申請？
4. 送出失敗主要是欄位、Turnstile，還是伺服器問題？
5. 哪個來源帶來的不是只有流量，而是真的有完成申請？

## 同意與資料邊界

- 預設 `analytics_storage: denied`。
- 未同意前不載入 Google Tag、不建立 GA4 Cookie、不送事件。
- 頁尾永遠保留「分析設定」，可重新允許或停用。
- 停用後不再送新事件，並清除本站可移除的 `_ga` 第一方 Cookie。
- 只傳頁面路徑、服務類型、來源代碼、CTA 位置、流程階段與標準化錯誤分類。
- 不傳姓名、Email、表單內容、公開連結、申請編號、submission ID 或 Turnstile token。
- `page_location` 會移除 query 與 hash；referrer 只保留 origin。
- Google signals、廣告個人化與廣告儲存固定關閉。
- localhost 只留下 DOM 測試訊號，不載入 Google Tag，避免污染正式數據。

## 事件合約

| 事件 | 發生時機 | 允許欄位 | 用途 |
|---|---|---|---|
| `page_view` | 同意後進入每一頁 | GA 標準頁面欄位；網址已去除參數 | 全站基礎流量 |
| `service_hub_view` | 進入合作總覽 | 無 | 服務入口瀏覽 |
| `service_page_view` | 進入單一服務頁 | `service` | 各服務需求量 |
| `service_route_click` | 從總覽前往服務詳情 | `service`, `placement` | 總覽選路表現 |
| `service_cta_click` | 從服務頁前往申請 | `service`, `placement` | CTA 表現 |
| `application_view` | 進入申請頁 | `service`, `source` | 到達申請頁 |
| `form_start` | 第一次聚焦表單欄位 | `service`, `source` | 真正開始填寫 |
| `service_choice_change` | 在申請頁改選服務 | `service` | 選路不確定性 |
| `form_submit_attempt` | 點擊送出 | `service` | 送出意圖 |
| `form_submit_invalid` | 前端欄位或 Turnstile 尚未完成 | `service`, `reason` | 前端阻礙分類 |
| `form_submit_error` | API 或伺服器回覆失敗 | `service`, `error_type` | 系統阻礙分類 |
| `generate_lead` | 申請成功被系統接受 | `service`, `source`, `delivery` | 主要轉換事件 |
| `diagnostic_start` | 開始工作流健檢 | 固定版本、入口位置 | 免費入口啟動 |
| `diagnostic_complete` | 完成健檢 | 固定版本 | 免費入口完成 |
| `diagnostic_result_layer` | 產生失效層結果 | `layer` | 問題分布 |
| `primary_cta_click` | 從健檢結果前往商品 | `layer`, `placement`, `destination` | 免費到商品轉換 |
| `article_scroll` | 文章讀到 25／50／75／100% | `percent` | 內容閱讀深度 |

## 核心 KPI

先累積真實 baseline，不預先捏造目標值。第一輪以三個 KPI 為主：

| KPI | 計算方式 | 判讀方式 |
|---|---|---|
| 服務頁 → 申請頁到達率 | `application_view ÷ service_page_view` | 低：承諾、證據、價格或 CTA 位置仍有問題 |
| 申請開始率 | `form_start ÷ application_view` | 低：申請頁第一屏、服務選擇或填寫負擔仍太高 |
| 申請完成率 | `generate_lead ÷ form_start` | 低：欄位、信任、Turnstile 或錯誤處理造成流失 |

診斷指標：

- CTA 位置表現：依 `placement` 比較 `service_cta_click`。
- 送出阻礙率：`(form_submit_invalid + form_submit_error) ÷ form_submit_attempt`。
- 服務改選率：`service_choice_change ÷ application_view`；高時要檢查服務差異是否說清楚。
- 來源完成率：依 `source` 比較 `generate_lead ÷ application_view`。

品質護欄：

- 不以增加送出量為唯一成功；後續需在名單紀錄補上「合格、已約、成交」三個商業階段。
- GA4 不保存申請人的識別資料；名單品質不可由 GA4 單獨判斷。
- 若同意率偏低，不用深色模式或阻擋內容逼迫允許，仍以清楚說明與信任為優先。

## Release 後 read-back

1. 無既有同意的新瀏覽器進站：確認無 Google Tag request、同意卡可見。
2. 選擇允許：確認 GA4 Realtime 出現 `page_view` 與頁面階段事件。
3. 從四種服務各點一次申請 CTA：確認 `service`、`placement`、`source` 正確。
4. 用測試資料走一次 production-safe 測試：確認 `form_start`、錯誤事件與 `generate_lead`。
5. 在 GA4 將 `generate_lead` 標記為 key event。
6. 檢查事件參數與 DebugView，確認沒有姓名、Email、自由文字、申請編號或完整 query URL。
7. 記錄 release commit、Realtime 證據與 rollback commit。

