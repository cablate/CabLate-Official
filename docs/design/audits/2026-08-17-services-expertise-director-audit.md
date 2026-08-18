# CabLate 服務與 Expertise 設計總監唯讀審核

> 先做決策：請讀[服務與 Expertise 決策版](./2026-08-17-services-expertise-decision-brief.md)。本文件保留完整證據與逐 section 判斷。

日期：2026-08-17  
範圍：`/expertise/`、`/services/`、`/services/coaching/`、`/services/consulting/`、`/services/enterprise/`、`/services/partnerships/`、`/services/apply/`  
環境：`http://127.0.0.1:4322`，Chromium，desktop 1440px、mobile 390px  
性質：只讀取 source、執行本機頁面與截圖；本次沒有修改 source，也沒有安裝 dependency。

## 1. 結論先說

這一批頁面的內容已經比一般服務頁成熟：問題描述具體、合作界線誠實、價格與交付有寫清楚，`/expertise/` 的五層診斷也確實是 CabLate 自己的產品能力。現在主要限制不是「還缺更多文案」，而是所有頁面使用同一套紙張容器與 section 節奏，讓不同服務看起來像同一張長表單的不同版本；同時，真正能證明「合作後會得到什麼」的物件仍然太少。

因此這次不建議再加裝飾、再加一層小標或再加一組卡片。下一階段應該：

1. 保留紙張作為 CabLate 的產品材質，但讓它只承擔「文件、工作面、交接物」的角色，不要每一個 section 都變成同樣的紙卡。
2. 每個服務頁選一個真正屬於該服務的主角物件：診斷追跡、行動卡、五週進度、團隊交接、合作 brief／權利表，而不是用三欄卡片代替證據。
3. 把讀者的心理路徑重新排序成「我是不是遇到這個問題 → 這個服務會留下什麼 → 我需要準備什麼 → 怎麼開始」，再決定 section，而不是沿用「介紹 → 卡片 → 原則 → FAQ → CTA」的固定堆疊。
4. 手機版要重新編排主次，不只是把 desktop 的紙卡直向排列。現況沒有水平溢位，但頁面高度與資訊等權問題很明顯。

## 2. 證據方法與限制

### 證據標記

- **Observed／觀察**：在本機 1440px 或 390px 截圖、互動或 DOM 檢查中直接看見。
- **Confirmed／程式確認**：由 current source 或 CSS 明確確認。
- **Inferred／推論**：根據觀察與 `cablate-design-director` 的原則推導出的體驗風險，不等於已量測的轉換結果。
- **Not verified／未驗證**：本次環境或範圍沒有足夠證據，不把推測當成事實。

### 本次實際檢查

- 每個 route 都開了 desktop 1440 與 mobile 390 的 full-page 截圖；clean 版本先關閉本機分析同意視窗。
- 檢查了 `/services/apply/` 預設狀態，以及 `?service=coaching`、`?service=consulting`、`?service=enterprise`、`?service=partnerships` 的動態選擇狀態。
- 對 14 個 viewport 組合量測 `document.documentElement.scrollWidth` 與 `clientWidth`；本次全部相等，未觀察到水平溢位。
- 在預設申請表按下「送出申請」：錯誤總結會出現、必要欄位會標示 `aria-invalid`，焦點移到錯誤總結；這是已觀察到的 local client validation 行為。
- local Turnstile 在本次環境沒有成功載入，頁面顯示「表單驗證暫時無法載入」的 fallback。這是環境／外部服務狀態，不直接判定 production 失效。
- 截圖中可見 Astro dev toolbar；它不是產品 UI，但會遮住部分頁面，故涉及遮擋的視覺判斷只以未遮擋區域與 source 交叉確認。

### 截圖尺寸與頁面高度

| route | desktop full page | mobile full page | 主要視覺證據 |
|---|---:|---:|---|
| `/expertise/` | 1440×4068 | 390×6069 | [desktop](../../../artifacts/night-audit/services-expertise/expertise-desktop-clean.png) · [mobile](../../../artifacts/night-audit/services-expertise/expertise-mobile-clean.png) |
| `/services/` | 1440×4757 | 390×6315 | [desktop](../../../artifacts/night-audit/services-expertise/services-desktop-clean.png) · [mobile](../../../artifacts/night-audit/services-expertise/services-mobile-clean.png) |
| `/services/coaching/` | 1440×4681 | 390×5919 | [desktop](../../../artifacts/night-audit/services-expertise/services-coaching-desktop-clean.png) · [mobile](../../../artifacts/night-audit/services-expertise/services-coaching-mobile-clean.png) |
| `/services/consulting/` | 1440×4320 | 390×5342 | [desktop](../../../artifacts/night-audit/services-expertise/services-consulting-desktop-clean.png) · [mobile](../../../artifacts/night-audit/services-expertise/services-consulting-mobile-clean.png) |
| `/services/enterprise/` | 1440×5713 | 390×6564 | [desktop](../../../artifacts/night-audit/services-expertise/services-enterprise-desktop-clean.png) · [mobile](../../../artifacts/night-audit/services-expertise/services-enterprise-mobile-clean.png) |
| `/services/partnerships/` | 1440×5248 | 390×6082 | [desktop](../../../artifacts/night-audit/services-expertise/services-partnerships-desktop-clean.png) · [mobile](../../../artifacts/night-audit/services-expertise/services-partnerships-mobile-clean.png) |
| `/services/apply/` | 1440×2242 | 390×3220 | [desktop](../../../artifacts/night-audit/services-expertise/services-apply-desktop-clean.png) · [mobile](../../../artifacts/night-audit/services-expertise/services-apply-mobile-clean.png) |

動態申請狀態截圖：

- [coaching desktop](../../../artifacts/night-audit/services-expertise/apply-coaching-desktop-selected.png) · [coaching mobile](../../../artifacts/night-audit/services-expertise/apply-coaching-mobile-selected.png)
- [consulting desktop](../../../artifacts/night-audit/services-expertise/apply-consulting-desktop-selected.png) · [consulting mobile](../../../artifacts/night-audit/services-expertise/apply-consulting-mobile-selected.png)
- [enterprise desktop](../../../artifacts/night-audit/services-expertise/apply-enterprise-desktop-selected.png) · [enterprise mobile](../../../artifacts/night-audit/services-expertise/apply-enterprise-mobile-selected.png)
- [partnerships desktop](../../../artifacts/night-audit/services-expertise/apply-partnerships-desktop-selected.png) · [partnerships mobile](../../../artifacts/night-audit/services-expertise/apply-partnerships-mobile-selected.png)
- [預設表單錯誤狀態 mobile](../../../artifacts/night-audit/services-expertise/apply-default-390-validation.png) · [desktop](../../../artifacts/night-audit/services-expertise/apply-default-1440-validation.png)

## 3. 跨頁 Current Design Read

### 已經形成的 CabLate 人格

**Observed／Confirmed**

- 暖灰紙張、深藍墨色、紫色註記與 Noto Sans／Noto Serif／mono 的角色分工一致；這是可辨識的 CabLate 材質與編輯人格。
- 標題多從讀者正在遇到的卡點出發，例如「一直鬼打牆」、「已經做了一段時間，還是不知道到底哪裡有問題？」、「上過課，工作方式還是沒變」，比抽象的服務宣傳自然。
- 服務頁普遍寫出價格、期間、適合與不適合、資料安全、停止條件與交付方向；這些內容支撐「人的判斷、工程可信度、誠實邊界」。
- `/expertise/` 用五層診斷、真實任務、證據、最小修正與本機結果組成一個產品化工具，不是單純的文章頁。
- HTML 結構已有 `main`、skip link、`header`、`nav`、`footer`、`fieldset/legend`、labels、details、錯誤總結等語意基礎。

**Inferred／風險**

- 目前「內容的可信度」高於「視覺敘事的辨識度」。不同頁面的讀者很容易得到同一個答案：再往下滑，看下一張紙卡。
- 多數頁面仍停在「承諾一個合理的合作過程」，沒有把真實輸出、判斷轉折或交接物放到畫面中心；對需要花錢或投入時間的人，信任還缺一段可見證據。
- 服務頁把同一種紙張當所有資訊的邊界，紙張從產品材質變成裝飾皮膚；這也讓應該有不同美術方向的頁面缺少個別性。

## 4. 前五大跨頁問題

| 優先 | 問題與證據 | 讀者影響 | 依 direct skill 的判斷 | 原創改善方向與驗收 |
|---|---|---|---|---|
| P0 | **每個 section 都是同一種 `page-paper paper-card`**。`services.astro:62-155`、各服務頁 `service-section` 反覆套用；截圖可見整頁是等權的白紙塊。 | 讀者知道內容很多，卻不知道這一頁最重要的決定或結果是什麼；向下滾動像閱讀目錄，不像進入一個被設計過的工作場景。 | 違反「一個 viewport 一個主角」與「紙張應是產品材料，不是所有頁面的同一 skin」。 | 每頁只留 1–2 個紙張主容器，其餘改成工作面、清單、流程線或無框留白。驗收：首屏能說出頁面主決定；同一頁連續三個 section 不再出現相同外框／陰影語法。 |
| P0 | **可見證據不足，卡片與清單代替成果**。Coaching／enterprise／partnerships 多數是 `title/body/output`；consulting 唯一接近證據的是「一頁行動卡」與 decision example。 | 讀者可以相信 Cab 說得合理，但還不能快速想像「我會拿走什麼」或「做完如何判斷有沒有前進」。 | direct skill 要求 demo、圖片、影片、UI mockup 真正證明價值；不可用原則清單假裝 proof。 | 各頁選一個真實或明確標為示意的 artifact：coaching 五週 trace、consulting 行動卡、enterprise 交接／驗收表、partnerships brief／權利表。驗收：每頁在前兩個主段內有一個可讀、可引用、可說明來源的結果物；沒有捏造數字或案例。 |
| P1 | **裝飾性 section label 太密**。`section-label` 反覆出現在「我為什麼做陪跑」「你可以帶甚麼來」「下一步」「可能的合作方式」等位置；`expertise` 還有 01/02/03 進度小標。 | 視線被大量紫色小字切碎；真正的標題反而變成被模板包住的下一層。 | direct skill 明確禁止沒有導航、狀態、來源或操作責任的 kicker／eyebrow。 | 只保留能回答「我現在在哪裡／這是什麼狀態／要做什麼操作」的小標；其餘直接刪除或併入標題。驗收：section-label 逐一能說出功能；不能說明功能的全部移除。 |
| P1 | **手機是堆疊，不是重新構圖**。DOM 沒有水平溢位，但 mobile 高度約 5,300–6,564px；卡片、流程、FAQ、CTA 依序全部保留，層級近似 desktop。 | 手機讀者在看到服務差異與 CTA 前要滑很久；每段都同樣重要，導致疲勞與漏讀。 | direct skill 要求 mobile recomposition，不是 desktop stack；長度本身不是問題，等權視覺才是問題。 | 手機先保留「問題 → 結果物 → 一個 CTA」，其餘以 details／摘要／橫向 trace／短版內容收納；coaching sticky CTA 要留出安全底距。驗收：390px 前兩個 viewport 可理解服務；最後 CTA 不被 fixed UI 遮住；不以隱藏重要內容換取短。 |
| P1 | **申請流程有 good semantics，但關鍵外部與狀態仍未完成 production evidence**。預設表單可產生錯誤總結；local Turnstile 顯示 fallback；動態 route 會改寫 hero、focus、boundary。 | 真正提交時若安全檢查、郵件、錯誤 focus 或 URL attribution 出問題，讀者不知道下一步；動態狀態的視覺層級也沒有獨立測試規格。 | direct skill 的可信度包含操作、降級與可驗證 handoff；不能只看靜態畫面。 | 建立四個 service state 的 keyboard／focus／network acceptance matrix，測 production Turnstile、API、錯誤、重送、返回、reduced motion。驗收：每個狀態都有可理解的 title、唯一目前選項、錯誤總結可跳回欄位、外部失敗有可行 fallback。 |

次要跨頁問題：CTA 文字與「不適合我會直接說」的信任句在多頁重複，已從人格訊號變成模板訊號；`reveal` 與 page transition 存在，但未形成可解釋的揭露／交接動詞；服務照片目前主要是同一批「Cab 在台上說話」，尚未按頁面主題轉成不同產品物件。

## 5. 逐 route／section 審核

## `/expertise/` — AI 工作流健檢

**頁面任務與心理路徑**：先讓讀者承認「有一個真實任務卡住」→ 填寫任務現況 → 對五層各自判斷 → 選最值得先修的一層 → 寫出證據與最小修正 → 產生一份可複製的本機結果。這是本範圍裡最接近產品工具的頁面，應該讓工具性勝過宣傳性。

| Section | Observed／Confirmed | Inferred | Not verified | 嚴重度 | 保留 | 原創改善方向 | 驗收條件 |
|---|---|---|---|---|---|---|---|
| Hero：`AI 一直鬼打牆，先別只改 Prompt。` | desktop 是左側 `AI WORKFLOW / 05 / LAYERS` index + 右側 serif 標題、說明、CTA；mobile 保留窄 index。source `expertise.astro:15-38`。 | 問題句自然且明確；但 05 index 目前是視覺宣告，尚未在首屏展示任何診斷結果或工作物件。 | 初次訪客是否理解 05 代表五層檢查，未以使用者測試確認。 | P1 | 保留 issue-first 標題、五層數字與 real task CTA。 | 將 05 連到一個可見的「診斷紀錄／層級 trace」物件；index 不再獨立裝飾。小字免責只在需要時收進可展開說明。 | 首屏 5 秒內能說出「我要拿一個真實任務來查哪裡卡」；05 與五層結果有明確關係；小字不搶 CTA。 |
| 任務準備：三個 textarea | source `WorkflowDiagnostic.astro:6-17`；說明資料只留瀏覽器、不送伺服器，語意 labels 完整。 | 這是可信的最小輸入，但三格同時出現，還沒給一個具體填寫例子；首個互動成本偏高。 | 實際完成一輪健檢所需時間、textarea 內容是否保存／離開後遺失的理解度未驗證。 | P1 | 保留本機處理與「不要檢查整個人生」的邊界。 | 首格先成為主輸入，另外兩格用「看見結果後再補」的分段揭露；提供一個不帶真實資料的短示例。 | 未填完整三格也能先看到下一個診斷動作；重新整理後遺失狀態有明確提示；不把長表單當 landing 首屏。 |
| 第 01 層：題目與完成條件 | source `workflowDiagnostic.ts:16-29`、`WorkflowDiagnostic.astro:19-43`；顯示檢查／症狀／最小修正與三個狀態 radio。 | 內容最能把 CabLate 的判斷能力說清楚；目前與後面四層完全同樣的紙板節奏，主角不夠突出。 | radio 選擇後是否有即時回饋或協助下一步，未作完整操作紀錄。 | P1 | 保留輸入、輸出、限制、停止條件、驗收的具體語言。 | 把第一層做成一張「任務契約」工作面，顯示一個前後句型差異，而非只是一列文字。 | 使用者能以一個例子完成「輸入→輸出→驗收」；選擇狀態後能看見下一個要補的證據。 |
| 第 02 層：Context 與資料 | source `workflowDiagnostic.ts:30-42`；重點是實際讀到的來源、版本、優先順序。 | 這是很好的工程觀點，但仍以抽象文字呈現，尚未讓讀者看到版本衝突或來源列表如何被檢查。 | 無真實 anonymized context trace 可供核對。 | P1 | 保留「不要只是一次塞入更多資料」的判斷。 | 做成一個小型 source ledger／版本比對，資料值可用示意且標示「示意」。 | 讀者能指出「AI 實際看見了什麼」；示意資料不被誤認為 Cab 的真實客戶資料。 |
| 第 03 層：工具與權限 | source `workflowDiagnostic.ts:43-55`；檢查讀寫、搜尋、執行、部署、通知及人工批准。 | 內容很有差異化，卻與其它層相同的 `dl + choice-row` 讓它像另一張表。 | 真實工具／權限狀態與失敗回報的 UI 行為未驗證。 | P1 | 保留「可用工具、禁止動作、人工批准、失敗回報」。 | 使用 permission map／操作邊界圖；把「AI 想做」與「實際能做」並列。 | 至少能標出一個不能自動執行的節點與人工接手點；mobile 不需橫向閱讀。 |
| 第 04 層：Memory 與狀態 | source `workflowDiagnostic.ts:56-68`；區分長期原則、本次狀態、過期資料。 | 這層與 CabLate 的 Skill 能力很接近，應該是獨特主角；目前仍是文字說明，和五層同質。 | 是否讓讀者理解「本機結果不會保存」與 memory 概念的差異，未透過測試確認。 | P1 | 保留不把所有對話當永久記憶的邊界。 | 做成 state timeline：長期方法／本次進度／已過期項目三種材質；結果可直接帶到 Skill／手冊。 | 讀者能分出可重用判斷與一次性狀態；結果文字保留這個區分。 |
| 第 05 層：驗收與失敗恢復 | source `workflowDiagnostic.ts:69-81`；檢查測試、核對清單、中間結果、錯誤位置、重啟條件。 | 這層最能把工程可信度轉成成果，但現在仍在頁尾前段，讀者要先走過很長四層。 | 失敗復原是否真的在 demo 中運作，未驗證。 | P1 | 保留「最後正確節點、第一個錯誤訊號、重新開始條件」。 | 把它當可視化恢復 trace，讓讀者看到「出錯後不是全部重跑」的結果。 | 至少有一個可觀察驗收與 restart point；使用者能複製到自己的流程。 |
| 第一個修正：選擇最值得先修 | source `WorkflowDiagnostic.astro:45-60`；五個 radio 選擇，旁有說明「不是自動判分」。 | 誠實地把判斷交還使用者；但 02/03 section label 與前面的五層編號容易造成多組數字競爭。 | 選擇後是否有 visually selected summary，未在本次逐項輸入測試。 | P1 | 保留「一次先修一層」與人工判斷。 | 移除裝飾性 `02 / 決定第一步`，改為一個具操作意義的 heading；選擇後在同一工作面顯示「為何先修它」。 | 選擇後有清楚狀態、理由與下一個 required field；不靠小字解釋 01/02/03 的關係。 |
| 結果建構：四個 textarea + 產生結果 | source `WorkflowDiagnostic.astro:62-77`；需要證據、修正、預期行為、下一層，才能產生本機結果。 | 結果欄位很有用，但在 6,069px mobile 頁面尾段才出現，使用者已經付出大量輸入；先給回饋的節點太晚。 | 是否每個 field 在實際缺漏時都能提供足夠上下文，未做完整可用性測試。 | P1 | 保留「證據→修正→預期→下一層」的 output contract。 | 先用一個最小結果物產生 draft，再讓四欄補全；結果物可用一頁 action trace 而非再一張紙卡。 | 未完成所有欄位也能知道缺哪一項；完成後結果中的四項與輸入逐項對應。 |
| Result panel / copy / reset | source `WorkflowDiagnostic.astro:79-99`、script `169-248`；結果可複製、重設，依 layer 送往 Skill 或 handbook。 | 這是頁面最重要的真正 handoff；目前埋在頁尾，且 `你的本機結果` 小標仍偏 editorial。 | clipboard fallback、focus、target destination 在 Safari／實際 mobile browser 未驗證。 | P0 | 保留本機、不送伺服器、可複製、結果 CTA。 | 把 result object 往前提為整頁終點主角，紙張只承擔結果文件；CTA 說明交接到哪裡以及為何。 | 完成後 focus 到結果；copy 成功／失敗都有 status；reset 清理且有確認；外部 CTA 內容與 layer 一致。 |

### `/expertise/` 必要收斂

這頁不要再加更多說明。應該刪掉裝飾性 01/02/03、小字免責與重複框線，把「五層」改成一條有結果的 diagnostic trace。保留輸入與結果的完整性，但讓第一個可見價值在前兩個 viewport 出現。

## `/services/` — 合作方式總覽

**頁面任務與心理路徑**：辨識「一次拆清楚」與「找人一起做」的差別 → 看共同合作結果 → 了解合作流程 → 若是團隊／主辦方走另一個入口 → 理解邊界 → 選路徑。這頁應是路由器，不應自己變成所有服務細節的縮小版。

| Section | Observed／Confirmed | Inferred | Not verified | 嚴重度 | 保留 | 原創改善方向 | 驗收條件 |
|---|---|---|---|---|---|---|---|
| Hero | `services.astro:62-78`；標題直接區分「一次看懂／找人一起做」，兩個 CTA，含 Cab 照片與 fine print。 | 方向正確；photo、CTA、fine print 佔據同一張紙，首屏仍像一般服務 landing hero。 | CTA 點擊後實際 route attribution 與 GA 事件只由 source data attribute 推定，未做網路事件驗證。 | P1 | 保留二分問題、兩個入口、誠實不成交聲明。 | 把 hero 變成 decision split：兩條路各有「適合何時／帶走什麼／不適合什麼」，照片作為人的判斷證據而非裝飾。 | 首屏不用往下滑就能選諮詢／陪跑；團隊／合作入口有明確但次級的出口。 |
| 個人服務比較 | `service-paths` 兩個大 article，含描述、四項 outcomes、CTA。 | 這是最有效的差異化內容，但兩欄仍像同尺寸卡片，四個 outcome 讀起來像清單。 | 真正使用者是否在此處完成選擇，未有轉換資料。 | P0 | 保留「你會帶走」與兩種服務不同的時間／工作關係。 | 使用一條「問題型 → 服務型 → 結果物」決策線，讓 primary path 有更大尺度，secondary path 不再假裝等權。 | 讀者能用一個具體句子選路；每條路至少展示一個 artifact 或交付例子。 |
| Shared progress | `service-result-strip` 四個進展：看清楚、排順序、做一次、留得下來。 | 內容是 CabLate 的共同承諾，卻被放在另一張等權紙卡；會稀釋前一段服務選擇。 | 四個詞是否需要對應真實交付，未有 case evidence。 | P1 | 保留四個可理解的結果動詞。 | 併入兩條服務的交付軌跡，讓每個動詞連到實際物件，而不是獨立 slogan strip。 | 每個動詞旁有交付／驗收例子；不再單獨佔一整張紙。 |
| Process | `service-process` 四步：看現況、選方式、說條件、照進度做。 | 對信任有幫助，但是通用服務流程，視覺上又一張編號卡；沒有與兩條服務的差異連接。 | actual time／responsibility handoff 未量測。 | P1 | 保留條件、責任、進度的透明度。 | 改成一條從「提交真實問題」到「交付物」的 routing trace；各路在第二步分叉。 | 不看完整頁也能知道下一個動作、誰負責、產物是什麼。 |
| 組織／邀約合作 | `organizationPaths` 兩個入口，source `services.astro:126-143`。 | 對團隊與合作方有清楚邊界，內容好；但仍是個人服務後方的相同 card。 | 團隊／品牌訪客是否能在首屏注意到入口，未驗證。 | P1 | 保留企業與 partnership 的不同語言與 handoff。 | 用獨立的「另一種合作關係」區域，採 metadata／brief 形式，不再做兩張相似服務卡。 | 目標訪客能在首屏或第一次決策後找到正確入口；不與個人服務競爭主 CTA。 |
| Principle close | 四個原則，source `services.astro:145-155`；內容誠實但沒有 CTA。 | 這是 brand contract，不必做成另一張紙卡；放在頁尾會有 manifesto 感。 | 讀者是否需要在此處再次閱讀原則，未驗證。 | P2 | 保留不為 AI、交接、責任與範圍排序的原則。 | 轉成短的 operating terms／服務邊界欄，或併入申請頁；刪掉裝飾性 section wrapper。 | 頁面結尾回到選擇或 CTA，不再以四條原則作最後重量。 |

## `/services/coaching/` — AI 應用陪跑

**頁面任務與心理路徑**：確認「我不是缺另一堂課，而是缺一起把事情做下去的人」→ 認出自己的卡住類型 → 看五週如何工作與價格 → 判斷 fit → 送出短申請。這頁的內容最接近真人說話，但最需要用「進度物件」取代長篇敘事。

| Section | Observed／Confirmed | Inferred | Not verified | 嚴重度 | 保留 | 原創改善方向 | 驗收條件 |
|---|---|---|---|---|---|---|---|
| Hero／方案 facts | `coaching.astro:81-99`；標題「有件事想做？我陪你做下去」、五週／五次／NT$39,800、真實照片、免費聊聊 CTA。 | 這是很好的服務事實與人的承諾；照片與文字尚未共同證明五週成果。 | 30 分鐘申請到正式邀請的實際排程／SLA 未在頁面之外驗證。 | P1 | 保留價格、期間、會議數、AI 不硬塞、本人閱讀表單。 | 圖片改為「一起看工作物件」或配一張五週 trace；不能假裝有客戶案例。 | 首屏同時回答「是不是陪跑」「要投入多久」「先做什麼」；價格與 CTA 不被裝飾小標分散。 |
| Story：不是另一堂課 | `coaching.astro:101-110`；兩段個人敘事。 | 文案自然，建立 Cab 的判斷來源；視覺是一般文章段落，與後面的 service card 無關。 | 讀者是否需要完整兩段，未驗證。 | P1 | 保留「課程教共通方法、陪跑處理當下判斷」的對比。 | 以一個匿名、明確標示示意的「課程做不到／陪跑會留下」對照物呈現；不要新增空泛故事。 | 讀者能以一句話分清課程與陪跑；內容不依賴額外 section label。 |
| Stuck situations | `coaching.astro:112-121`；四個 `article` 列出想太多、工具太多、已有第一版、已有經驗。 | 四種入口有助於自我辨識，但四格是最典型的卡片牆；沒有分支到不同成果。 | 哪一種情況最常轉換，未有資料。 | P1 | 保留四種自我辨識語句與非 AI 專屬範圍。 | 做成一條「你現在在哪裡 → 下一步要把什麼拿來」的 diagnostic intake，不用四張同等紙卡。 | 每種情況連到一個要帶來的真實材料或預期交付；mobile 不必滑四個等高盒子。 |
| Five-week offer／price | `coaching.astro:123-143`；價格與五項服務內容。 | 這是頁面最重要的證據，但目前上下均是紙卡，交付仍以文字 list 呈現。 | 五週實際產出範例、回覆量、完成率未驗證，不可暗示。 | P0 | 保留價格、折抵條件、會議／留言／整理等具體承諾。 | 用五週 timeline，將每週的「檢查物／動作／留下什麼」列出；未知結果標為「可能依題目調整」。 | 讀者能理解五週與五次會議的關係；至少看到一個真實交付模板或示意文件。 |
| Fit／not fit | `coaching.astro:145-166`；Check／X 兩欄與範圍 note。 | 邊界寫得好，卻再次使用通用兩欄 fit grid；與 consulting／enterprise 的 fit 語法相似。 | 不適合讀者是否在前段已被排除，未驗證。 | P1 | 保留「不代做、不保證營收／效率、可直接說不用 AI」。 | 把 fit 變成申請前的短判斷，不再做全寬紙卡；將每項連到要準備的東西。 | 3 個問題即可判斷是否送表單；不重複前面已說過的承諾。 |
| FAQ | `coaching.astro:168-173`；五題 details。 | FAQ 有必要，但在長頁末段容易成為閱讀負擔；內容其實可併進申請頁的動態說明。 | details 使用者展開率、鍵盤與 screen reader 體驗未驗證。 | P2 | 保留優惠、30 分鐘、AI 是否必要、回覆時間等真問題。 | 只保留決策阻礙，其他移入 apply route；mobile 不再讓 FAQ 成為另一張紙卡。 | FAQ 每題只解一個阻礙；展開後不被 sticky CTA 遮住。 |
| Final CTA／mobile sticky | `coaching.astro:175-186`；頁尾 CTA，mobile 有 fixed `service-coaching-sticky`。 | sticky 讓 CTA 可達，但固定 bar 與頁面高度、dev toolbar 疊加時可能遮內容；重複 CTA 也會削弱最後選擇。 | 真實 mobile browser 的 safe-area、鍵盤、焦點遮擋未驗證。 | P1 | 保留「申請免費聊聊」與最多三位的稀缺事實（前提是資料仍正確）。 | sticky 只在讀者離開 hero CTA 後出現，並預留 `env(safe-area-inset-bottom)`；頁尾只留一次 CTA。 | fixed bar 不遮住任何可互動控制；焦點移動可見；reduced motion 不影響可用性。 |

## `/services/consulting/` — 專案卡關諮詢

**頁面任務與心理路徑**：讀者承認已投入時間仍找不到問題 → 看到 60 分鐘會留下的 action card → 確認手上有可看的材料 → 看流程、費用與限制 → 提交情境。這是目前服務頁中最接近「證據導向」的一頁，應以 decision example 為核心重構。

| Section | Observed／Confirmed | Inferred | Not verified | 嚴重度 | 保留 | 原創改善方向 | 驗收條件 |
|---|---|---|---|---|---|---|---|
| Hero | `consulting.astro:28-41`；問題句、60 分鐘、NT$5,000、工作坊照片、提交 CTA。 | 讀者知道何時需要諮詢；照片仍是 Cab 在現場，不是諮詢的交付物。 | 付款／時段 route 的實際流程未驗證。 | P1 | 保留價格、輸入條件、先確認適合再付款。 | 圖片可退到次要位置，讓「一頁行動卡」成為首屏旁的主物件；照片只證明 Cab 真的在做判斷。 | 首屏能看見「帶什麼來／拿什麼走／多少錢」。 |
| Deliverables + decision example | `consulting.astro:43-56`；四項 deliverables，唯一有症狀→可能卡點→這次要做的事的具體例子。 | 這是全套頁面最有說服力的 section；若保留通用四卡，decision example 會被稀釋。 | 例子是否來自真實匿名案例、或僅為示意，source 未標明。 | P0 | 保留「一直換工具，不一定是工具不夠好」與三段判斷。 | 把 decision example 升為主導 artifact；若非真實案例，明確標「示意」，並展示輸入與一頁行動卡的前後差異。 | 讀者看完能描述諮詢的決策輸出；不能把示意誤認為客戶成果。 |
| Fit／not fit | `consulting.astro:58-81`；「手上要有東西可以看」與四條適合／不適合。 | 邊界清楚；但與其他頁面同一 fit-grid pattern，缺少諮詢獨有的「證據準備」動作。 | 提交前資料品質與拒絕率未驗證。 | P1 | 保留不能只要萬用 Prompt、不能代開發、不能保證營收。 | 改為「請帶一個可看物件」的 checklist，直接連到申請表情境欄。 | 讀者能列出一個檔案、流程、輸出或失敗紀錄；送出前不需寫完整需求書。 |
| Process | `consulting.astro:83-94`；四步含付款與 60 分鐘 action card。 | 流程透明；視覺上仍是一個 generic numbered list。 | 付款、取消、改期條件未在本次頁面 audit 外驗證。 | P1 | 保留「先確認適合再付款」與交付結果。 | 將流程改成「情境 → 判斷 → 行動卡」三段，付款作為中間 gate metadata，不搶主敘事。 | 下一步、費用、何時保留時段一眼可找；不把 4 個編號當成品牌裝飾。 |
| FAQ | `consulting.astro:96-104`；四題 details。 | 題目與前段互補，數量適中；仍被包在同一紙卡。 | 展開／收合的 keyboard、長答案在 390px 的折返未驗證。 | P2 | 保留費用、是否適合非 AI、是否代開發、付款時段。 | 把 FAQ 變成 action card 邊上的「先排除這些誤會」短列。 | 每題可在 10 秒內掃讀；展開內容不改變 CTA 可見性。 |
| Final CTA | `consulting.astro:106-109`；「不用先寫完整需求書」與提交 CTA。 | 自然且低摩擦；但頁尾又一張紙卡與重複 CTA。 | CTA 轉換與 attribution 未驗證。 | P2 | 保留低摩擦語言與機密資料提醒。 | 讓 CTA 接在 action card 後，成為「把你手上的東西交給我看」的 handoff，不再獨立另起 section。 | 讀者看到 artifact 後能立即提交；最後不再出現新的小標或重複承諾。 |

## `/services/enterprise/` — 企業與團隊合作

**頁面任務與心理路徑**：讓團隊看見「上課後工作沒變」可能是流程、資料、角色或驗收問題 → 了解不固定賣課程 → 看三種合作方式 → 確認合作結束要留下的東西 → 判斷組織是否準備好 → 提交情境。內容差異化很強，但目前最像長版 proposal。

| Section | Observed／Confirmed | Inferred | Not verified | 嚴重度 | 保留 | 原創改善方向 | 驗收條件 |
|---|---|---|---|---|---|---|---|
| Hero | `enterprise.astro:53-65`；團隊結果句、AI 不只是工具、企業 CTA、AI meetup 照片。 | 問題對組織讀者有針對性；照片仍是一般演講證據，沒有團隊交接／驗收物。 | 真實企業案例、客戶 logo、結果數字未提供，不能補造。 | P1 | 保留工作／角色／資料／安全／驗收的框架與不先賣課程。 | 用一張明確標示「示意」的 team handoff／verification trace 做主角；照片作為人的工作背景。 | 首屏能回答「不是買課程，那會留下什麼」；所有數字／案例均有來源或不使用。 |
| Problem signals | `enterprise.astro:67-75`；三種狀況：不知道怎麼用、資料拿不到、無人檢查。 | 分類能幫主管從症狀進入問題；目前是 `dl` 清單，與後面 options 斷開。 | 哪一種 signal 對企業最常見未驗證。 | P1 | 保留不把所有問題歸因於工具的判斷。 | 變成 symptom → likely layer → first evidence 的診斷入口，連到方案選擇。 | 讀者能選一個最像的症狀並知道要準備哪個 evidence。 |
| Cooperation options | `enterprise.astro:77-92`；三個編號選項含 fit／可能提供。 | 內容清楚但三個均等列又像服務菜單，與「不先拿課程菜單」的文案有張力。 | 方案實際客製範圍與價格未驗證。 | P1 | 保留診斷、真實工作坊、小規模導入三個角色。 | 用階段式 decision map，不列成三張商品；每一階段由上一個證據決定。 | 讀者知道何時從診斷進入試點、何時不應直接買課程；不需要先選固定方案。 |
| Evidence / what remains | `enterprise.astro:94-108`；五項「合作結束前至少要留下」。 | 這是應該成為頁面主角的交接清單，但現在只有抽象 bullet，沒有可讀 artifact。 | 「現場做出的成果」的真實樣本未驗證。 | P0 | 保留共同問題、現場成果、規則／檢查、主管可見變化、接手人。 | 做成一頁 team handoff／驗收表，欄位有 owner、evidence、未解問題、停止條件；若是示意要標示。 | 不宣稱效率／營收改善；讀者可以看見交接文件長什麼樣子、誰在何時填。 |
| Fit／not fit | `enterprise.astro:110-132`；角色、負責人、決策人、安全與驗收條件。 | 企業可信度高；但同樣的兩欄 fit-grid 使它像其他個人服務頁。 | 實際採購／資安審查流程未驗證。 | P1 | 保留不使用未授權資料、不保證營收／採用率。 | 改成 stakeholder／責任 map；把「誰做、誰決定、誰驗收」畫成關係，不作兩欄卡。 | 讀者能填入至少三個角色與一個驗收人；資料安全限制可在第一眼找到。 |
| Process | `enterprise.astro:134-141`；五步含交接或停止。 | 「停止」是很好的 CabLate 動詞；目前編號列表仍偏 generic。 | 真實交接與停止案例未驗證。 | P1 | 保留提交、釐清、方案、執行、交接／停止的順序。 | 使用 process trace，讓每一步有輸入、決策、輸出；停止不是尾端文案而是明確 gate。 | 每步都有 owner／evidence／下一決定；手機可掃讀，不需讀五張等高卡。 |
| FAQ | `enterprise.astro:143-148`；四題安全、報價、演講與方案。 | 問題實際且有助於降低企業風險；長頁末段才看到，可能來不及支撐前面的承諾。 | 企業採購者是否需要更多條款資訊未驗證。 | P2 | 保留資料最小化、演講不等於導入、方案時機。 | 將安全與「演講不能取代改變」移到 decision map 旁；FAQ 只留條款細節。 | 主要風險在選擇前已可找到；FAQ 不重複前段。 |
| Final CTA | `enterprise.astro:150-157`；不用完整標案、提交企業情境、不要附機密。 | 低摩擦且符合企業入口；和前面多張紙卡的結尾形式相同。 | 提交到 API 的企業欄位與實際回覆未驗證。 | P1 | 保留簡短情境、資料安全、先確認適合。 | CTA 直接接在 handoff／responsibility artifact 後；表單 preview 顯示會問哪些責任與驗收問題。 | 企業訪客不需準備完整標案；能提交「哪一群人／哪一段工作／誰負責」三件事。 |

## `/services/partnerships/` — 講師、內容與產品合作

**頁面任務與心理路徑**：讓邀約方先分辨演講／內容／產品合作 → 了解需要提供的 brief → 看到使用權與責任要先說清楚 → 判斷是否準備好 → 寫第一封信。內容已經非常具體，視覺應該把 brief／權利表變成主物件。

| Section | Observed／Confirmed | Inferred | Not verified | 嚴重度 | 保留 | 原創改善方向 | 驗收條件 |
|---|---|---|---|---|---|---|---|
| Hero | `partnerships.astro:53-65`；邀約問題句、受眾／形式／日期／預算／使用方式、工作坊照片。 | 問題自然、CTA 低摩擦；照片仍是一般現場圖，未顯示合作物件。 | 檔期查詢與真正合作條款未驗證。 | P1 | 保留「先給條件，我直接回覆是否適合」。 | 讓 brief 的五個欄位成為 hero 的視覺索引，照片降為人物證據。 | 首屏能知道第一封信要寫什麼；不需要先看 FAQ。 |
| Partnership types | `partnerships.astro:67-82`；featured speaker/workshop + content + product 三篇 article。 | 內容差異化很清楚；desktop 有 featured，但 mobile 會變成三段相似紙卡，特色消失。 | 各類合作的實際樣本與權利案例未驗證。 | P0 | 保留三種合作類型、受眾／成果／形式思路。 | desktop 用一個 featured「工作坊」主角 + 兩個小型 route；mobile 保留 featured 的尺度與引導，不平均堆疊。 | mobile 第一個合作類型仍是主路徑；每類都有 output 與必要 input。 |
| Brief metadata | `partnerships.astro:84-95`；受眾與結果、形式與責任、時程與預算、使用與權利四組 `dl`。 | 這是全頁最產品化、最有用的內容；目前被包成普通 section，沒有真正成為可填／可轉寄的 brief。 | 權利詞彙的法律完整性未驗證，不把本次 audit 當法律意見。 | P0 | 保留四組欄位與「不用寫企劃書」。 | 做成一張可複製的 partnership brief／rights sheet，加入「需要對方回答」的欄位；不要新增裝飾文字。 | 邀約方能直接照欄位寫第一封信；錄影、剪輯、廣告、改作、使用期間不被混在一起。 |
| Process | `partnerships.astro:97-104`；五步含內容／署名／錄影／改作權利、完成結案。 | 透明度高；和 enterprise 共同使用五步 process，失去 partnership 的權利交接特色。 | 合約與署名確認流程未驗證。 | P1 | 保留不把口頭邀約當排程、權利先確認。 | 改成 brief → scope → rights → production → release handoff 的合作 trace。 | 每一步都有應確認的文件／決定；未確認權利前不暗示已排程。 |
| Fit／not fit | `partnerships.astro:106-128`；受眾、預算、負責人、使用範圍與不接受條件。 | 邊界自然、很有品牌人格；仍是通用 fit-grid。 | 受邀方的實際拒絕條件與法務流程未驗證。 | P1 | 保留預算、責任、使用權、曝光不能取代報酬。 | 以 rights／responsibility check 取代「適合／不適合」雙欄；讓判斷屬於合作條件而非人格審核。 | 邀約方能自我檢查四項條件；不以紫色小標重複判斷。 |
| FAQ | `partnerships.astro:130-135`；檔期、錄影／重播／廣告、產品交換、預算。 | 對第一封信很實用；可移動到 brief 下方作為條款提示。 | 法律內容、實際定價與範本未驗證。 | P2 | 保留使用權與模糊曝光的澄清。 | FAQ 只解真正阻擋送信的問題，其餘由 brief 欄位先引導。 | 每題能降低一個合作風險；不重複 process。 |
| Final CTA | `partnerships.astro:137-144`；「把邀約重點放進一封信就好」。 | 語氣最符合頁面任務；頁尾再次進入相同紙卡節奏。 | Email／form handoff 及使用方式未驗證。 | P2 | 保留低摩擦句子與提交摘要。 | CTA 直接接 brief／rights sheet，提供「複製欄位」或表單 preview；不再另加 section label。 | 讀者能在 1–2 分鐘整理摘要；提交不暗示檔期保留或合作成立。 |

## `/services/apply/` — 服務申請與 routing handoff

**頁面任務與心理路徑**：先說清楚現在要處理什麼 → 選最接近的合作方式 → 填姓名、Email、情境與服務專屬焦點 → 了解安全檢查與回覆方式 → 送出或在錯誤時修正。這頁是實際操作面，不應套用服務頁的長篇敘事。

| Section／狀態 | Observed／Confirmed | Inferred | Not verified | 嚴重度 | 保留 | 原創改善方向 | 驗收條件 |
|---|---|---|---|---|---|---|---|
| Back + default hero | source `apply.astro:25-56`；desktop 左 sticky hero、右 form；mobile 先 hero 再 form。預設標題「先讓我看懂，你現在要處理什麼。」 | routing context 清楚；desktop sticky hero 是好的 handoff，但 mobile 頁面很長，hero 說明與 form heading 有資訊重疊。 | sticky 在所有瀏覽器、zoom、鍵盤 focus 下的行為未驗證。 | P1 | 保留本人閱讀、適合才回覆、不自動成交的透明度。 | hero 只說「收到後如何決定」；把「留幾個關鍵資訊」留給 form，不重複。 | 390px 首屏可理解送出後下一步；scroll／focus 不讓 sticky 或 fixed nav 遮住欄位。 |
| Service choice default | source `apply.astro:91-108`；fieldset、legend、四個 radio card、choice feedback。 | 這些是可操作 controls，不屬於禁止的裝飾卡片；選項 summary 有助於 routing。 | 鍵盤 tab order、radio group screen reader label 尚未以輔助技術驗證。 | P1 | 保留「選最接近的就好，我會再判斷」與四個差異摘要。 | 讓選項 card 顯示「你會準備什麼／我會怎麼回」而非再次解釋服務頁；selected state 加一個清楚的 route result。 | 未選狀態提交會聚焦錯誤 summary；選取後只有一個目前 route；不啟用的 focus controls 不進 tab。 |
| Selected service state | source `apply.astro:219-237`、`391-464`；`?service=` 會預選 radio、隱藏 choice、顯示 select 與 route feedback，並啟用對應 focus group；`coaching` 會隱藏 boundary（`apply.astro:426`）。截圖已涵蓋四種 service。 | URL handoff 設計成熟，但「上一頁帶來的已選 service」與 form 內 select 的關係需要更明確；coaching 取消 boundary 可能讓頁面高度與其他 route 不一致。 | browser back、深連結 refresh、analytics source、history state 未完整驗證。 | P1 | 保留 service-specific hero copy、focus question、offer note 與 source attribution。 | 把 selected route 做成一個單一「目前要處理的問題」標籤；不要讓 select 看起來像第二個獨立選擇流程。 | 四種 deep link refresh 後狀態一致；選擇改變後 focus、title、CTA、boundary 同步；回上一頁不重複送出。 |
| Contact + situation fields | source `apply.astro:110-149`；姓名、Email、情境、service-specific focus，required／minlength／labels 完整。 | 字段數量合理，情境語言自然；mobile 會成為長表單，重要欄位上下間距需控制。 | 實際手機鍵盤、輸入法、email autocomplete、長文字溢位未驗證。 | P1 | 保留只問必要資訊、可選補充、不要提交機密原文。 | 將 service-specific focus 與情境欄的關係視覺化成「你正在做什麼／這次要先判斷什麼」，避免欄位像無關問卷。 | 390px 填寫時 label、help、error 緊鄰；minlength 錯誤有清楚下一步；不需要先寫完整企劃書。 |
| Optional details | source `apply.astro:151-168`；時間、組織、公開連結。 | 用 details 收納 optional 是正確的 progressive disclosure。 | details 的折疊狀態、鍵盤／SR 宣告未驗證。 | P2 | 保留非必要資料不阻塞申請。 | summary 直接說「只有在有時間限制或公開材料時才打開」，避免泛用「再補充」。 | default 狀態不增加認知負擔；展開後欄位不與 submit／fixed nav 重疊。 |
| Security / Turnstile | source `apply.astro:170-174`、`252-273`、`557-594`；透過 API 取得 key，再載入 Cloudflare Turnstile；local 顯示 fallback email。 | 降級說法誠實；但 fallback 出現在表單核心位置，production failure 時會決定是否能送出。 | production key、Cloudflare load、CSP、API timeout、郵件 delivery 未驗證。 | P0 | 保留安全檢查、不要假裝已送出、可寄信 fallback。 | 加上狀態機：載入中／可送出／失敗／重試／轉寄；讓 fallback 明確成為可行替代流程，不只是狀態文字。 | 外部腳本失敗時，使用者知道等、重試或寄信；不會卡在 disabled submit；CSP／network error 有測試紀錄。 |
| Client validation／error summary | source `apply.astro:176-180`、`485-531`、`596-629`；本次按空表單已觀察 summary、aria-invalid、focus。 | a11y 基礎做得好；手機截圖中 error summary 與 dev toolbar 同時出現，真實產品仍需確認焦點與 fixed UI。 | screen reader 實讀、不同 validation error 組合、server field error 未驗證。 | P1 | 保留集中錯誤、可點按回欄位、aria-invalid 與不自動扣款說明。 | 把 summary 的第一句寫成可操作的下一步；錯誤項目順序與實際 tab／視覺順序一致。 | submit 後 focus summary；點錯誤按鈕回到正確 control；修正後 error 狀態清除；沒有無限 scroll。 |
| Ready／success | source `apply.astro:192-201`、`638-669`；成功後隱藏 form、顯示回覆 email／lead id；dry run 有明示「測試資料已接受」。 | 這是完整 handoff 的必要終點，且沒有虛構已寄信。 | 實際 API 成功、email delivery、重複送出、lead id 隱私呈現未驗證。 | P1 | 保留明確的 delivery／dry run 狀態與回合作方式。 | 成功畫面可提供「我下一步會做什麼／何時回覆」的簡短 timeline，避免只留下編號。 | 真成功、dry run、server failure 三種結果都明確；refresh／back 不會重送；lead id 不暴露不必要資訊。 |
| Boundary | source `apply.astro:205-215`；三條合作差異與選錯沒關係。coaching selected 時隱藏。 | default 狀態有助於 routing，但本質是另一個 paper card；selected route 若保留會重複已選答案。 | hidden boundary 對 screen reader／layout transition 的實際表現未驗證。 | P2 | 保留選錯沒關係與兩種個人服務差異。 | 把 boundary 壓縮成 form 上方的可展開 decision note；企業／合作 route 改顯示對應條件，而不是固定兩條個人路。 | 只有仍然能幫助選擇時才出現；selected service 不顯示過時比較；不製造額外長度。 |

## 6. 保留、強化、限制與刪除建議

### 保留

- 暖紙材質、深藍正文、紫色操作／狀態色；但紙張只包住可被拿走、交接或操作的東西。
- Noto Sans 作資訊與操作、Noto Serif 作少量 assertion／人的聲音、mono 作數據／版本／狀態；不要用固定字體套所有頁面，而是保持角色。
- issue-first 文案：「已經做了一段時間」「不是另一堂課」「不用先寫完整標案」等自然入口。
- 真實照片與 Cab 的真人判斷；照片要有工作關係，不要只是服務頁 hero decoration。
- 價格、時間、適合／不適合、資料安全、停止條件與交付限制；這些是信任證據，不要因為想變漂亮而刪掉。
- semantic HTML、skip link、labels、fieldset／legend、details、錯誤總結、reduced-motion 分支與本機結果的 copy/reset。

### 強化

- 讓每頁有一個「產品物件」：expertise = diagnostic trace；consulting = action card；coaching = five-week workbench；enterprise = owner／evidence／stop handoff；partnerships = brief／rights sheet；apply = route state + response contract。
- 把 section 標籤改為操作狀態、資料來源、步驟或路由；沒有責任的紫色小字全部刪除。
- 把 CTA 從「看更多」改成明確交接：「提交一個可看的卡點」「送出合作摘要」「把這份判斷交給下一個工具／人」。
- 讓 motion 表達揭露、分叉、交接、驗證、完成；若沒有可說明的狀態變化，就維持靜態。現況只看到 global reveal／page transition 的基礎，未形成各頁專屬動詞。

### 限制／退休

- 連續重複的 `page-paper paper-card` 外框、陰影與相同 padding。
- 沒有導航／狀態／來源／操作責任的 `section-label`、小 kicker、角落編號。
- 四格／三格清單直接當成果 proof；若沒有真實來源，改標示「示意」或改成產品工作物件。
- 每頁都使用相同的「fit／not fit + process + FAQ + final paper card」順序；內容可保留，版型不必複製。
- 重複使用「不適合我會直接說」作為每頁的固定人格句；保留一次，其餘用各服務真正的邊界說明。

## 7. 建議的下一階段實作順序

### P0：先修讀者能否看見價值

1. `/expertise/`：把 result panel／diagnostic trace 提到頁面故事中心，五層保留功能但去除等權紙卡。
2. `/services/consulting/`：以一頁行動卡／decision example 做第一個服務 proof pattern，明確標記示意或來源。
3. `/services/coaching/`、`/services/enterprise/`、`/services/partnerships/`：各做一個不捏造案例的 artifact prototype，再重排 section。
4. `/services/`：改成真正 routing page，將服務比較、組織合作與共同進展合成決策圖，不再把所有內容平鋪。

### P1：重新構圖與操作驗收

1. 砍除無功能 section labels，建立「保留／移除」清單後再調 CSS，避免刪文案後留下空間。
2. 每個 route 建立 390px storyboard：首屏、主 artifact、一次 CTA、補充 details、結尾 handoff。
3. 對 coaching sticky、apply sticky／dynamic state、error summary 做 keyboard、focus、safe-area、reduced-motion 測試。
4. 建立 apply route 的 production Turnstile／API／email 狀態測試，記錄 loading、retry、dry-run、server validation、network failure。

### P2：細節與性能

1. 重新分配各頁照片：不同頁面有不同視覺工作，不用同一張「台上說話」照片證明所有服務。
2. 只對短標題使用 `text-wrap: balance`，對長文保持自然折行；必要時以作者控制的語意換行，不用大量 `<br>` 製造桌面版構圖。
3. 量測 production Lighthouse／Web Vitals、圖片 decode、CSS／font loading、第三方 Turnstile 與 analytics 預算；本次沒有把 local server 的結果當成性能結論。

## 8. Accessibility、motion、performance evidence

### 已觀察／已確認

- 14 個 viewport 沒有水平溢位。
- 共用 layout 有 skip link、`main#main-content`、網站導覽與 footer；服務申請使用 labels、fieldset／legend、required、`aria-describedby`。
- `/expertise/` 的 radio／textarea、結果 panel、copy/reset、no-script fallback 均在 source 中存在。
- `/services/apply/` 空表單送出後，錯誤總結以 `role=alert` 顯示，欄位設 `aria-invalid`，焦點到總結；這是本次已執行的互動證據。
- `prefers-reduced-motion` 在診斷 smooth scroll 與 global／service image reveal 中有分支；service CSS 至少對部分 transition／rotation 做 reduced-motion 處理。
- 服務 hero 圖片有明確 `width`、`height`、`alt`、`loading="eager"` 與 `fetchpriority="high"`；每頁通常只有一張主圖。

### 未驗證／下一步必測

- 未以 NVDA／VoiceOver 真正閱讀；尤其是 visually hidden radio、details、selected-service select、error summary、fixed sticky CTA。
- 未驗證 200% zoom、text-only zoom、Windows high contrast、prefers-contrast、鍵盤只用 Tab／Shift+Tab 的完整路徑。
- 未取得 production Lighthouse、LCP／CLS／INP、第三方腳本大小、圖片 decode 與 font swap 數據；不能因 local 截圖順利就宣稱效能良好。
- 未驗證 Turnstile、API、郵件與 Cloudflare failure；local 顯示 fallback 只代表本次外部服務不可用或尚未配置。
- 未驗證 Astro ViewTransitions 在所有 route、back／forward、表單輸入與 focus 下的狀態保存；source 有 `astro:page-load`／`astro:after-swap` hook，但不等於完整測試。

## 9. 反抄襲檢查

本次建議不是複製 Made By Pan 的黑白、大字、紙張或特定構圖。可借用的能力與抽象轉換如下：

| 可學的能力 | CabLate 的原創轉換 | 明確排除 |
|---|---|---|
| 先讓首屏提出一個讀者能承認的問題 | 用「AI 任務卡點／團隊交接／合作 brief」作為 CabLate 的入口 | 不複製 Pan 的固定首屏照片＋文字排列 |
| 每頁有自己的視覺世界 | expertise 用診斷 trace、consulting 用 action card、enterprise 用 owner/evidence map、partnerships 用 rights sheet | 不把所有頁面做成同一種黑白 editorial poster |
| 用尺度、留白、裁切建立閱讀節奏 | 紙張只承擔產品工作物；暖灰底、紫色狀態、真人照片來自 CabLate 現有語彙 | 不複製特定紙張邊框、照片角度、貼紙、分頁數字或 Pan 文案 |
| 動畫讓讀者知道揭露／交接發生 | 只做 diagnostic reveal、route split、validation、handoff；可靜態則靜態 | 不為了「像」而安裝 GSAP、Framer Motion 或抄 scroll choreography |
| 文案像真人在理解讀者 | 使用 Cab 的工程邊界、價格、責任、停止條件與實際交付 | 不使用 Pan 的句型、隱喻、口吻或原文段落 |

每次實作前必須在 PR／設計稿附上四項 anti-copy note：

1. 這次參考的是哪一種設計能力，而不是哪一個表面樣式。
2. 抽象能力如何轉成 CabLate 自己的產品物件、輸入、輸出與語氣。
3. 哪個 layout／動畫／文案是本頁特有，為何合理。
4. 哪些類似 Made By Pan 的構圖、隱喻、素材或句型被排除，以及排除理由。

## 10. 讀過的 skill／reference

- `C:\Users\user\.codex\skills\cablate-design-director\SKILL.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\design-language.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\case-cablate.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\output-contracts.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\implementation-guardrails.md`
- `D:\_CabLate_Agents\coder\.agents\skills\modern-web-guidance\SKILL.md`
- `modern-web-guidance` CLI search：`improve-text-layout-and-legibility`（用於短標題 `text-wrap: balance`、作者控制的語意換行與避免無證據加 dependency）

本報告沒有把 `public-content` 當成本次審核依賴，因為此階段是唯讀視覺／互動／資訊架構 audit，不是直接改寫公開文案；若進入下一階段 copy rewrite，應另載入該 skill，並逐頁保留事實、價格、限制與承諾範圍。

## 11. 本次未修改內容

- source：未修改。
- dependency：未安裝。
- 只新增本報告與 `artifacts/night-audit/services-expertise/` 下的審核截圖。
- repository 既有工作樹中 `src/pages/index.astro`、`src/styles/global.css` 的修改未碰觸。
