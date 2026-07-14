---
status: proposed
approval_status: pending_user_review
created: 2026-07-14
parent_plan: docs/content/remaining-primary-pages-visual-conversion-master-plan-2026-07-14.md
acceptance_standard: docs/design/page-reading-and-interaction-acceptance-standard.md
baseline_audit: docs/design/audits/2026-07-14-remaining-primary-pages-plan/README.md
execution_mode: serial-small-slices
---

# About、Work、Courses、Services 小步執行計畫

## 0. 文件定位與目前判定

這是 2026-07-14 四頁 Master Plan 的施工切片，不另行改寫產品方向、頁面角色或核准狀態。它把原本的 Phase 0–5 拆成可在一次短 session 內完成、驗證、停止與回退的小步驟。

目前判定：**Pending User Review**。本文件可直接用於審閱與估工；只有父計畫與本切片獲核准後，才進入 `P1` 以後的程式實作。

深層目標不是更快累積改動，而是縮短「做出變更 → 看見真實結果 → 修正判斷」的距離。每一步只承擔一種主要風險，避免文案、DOM、共用 CSS、Responsive 與跨頁 QA 同時變動，導致失敗時無法定位。

## 1. Goal model 與切片原則

### 1.1 Goal model

- **Primary goal G0：** About、Work、Courses、Services 各自完成一個清楚的訪客決策，且不讓已驗證的 Home、Expertise 退步。
- **Supporting goals：** CTA 可辨識、順序與 DOM 一致、Mobile 可讀、證據靠近主張、真實資料不漂移、訪客有回復路徑。
- **Soft goals：** 每次變更容易理解、容易驗證、容易回退；新 session 不必依賴聊天記憶。
- **Domain invariants：** 沿用父計畫 1.4 全部規則；特別保護真實 Email、CabAI attribution、產品狀態、價格、日期、公開證據、Rail、Headbar、Footer、Home 與 Expertise。
- **Non-goals：** Articles detail、Course detail、Search、Starter Pack、品牌重做、大量生成圖片、未核准的新案例／數字／服務承諾。

### 1.2 Goal-to-slice traceability

| Goal | Slice owner | Observable outcome | Evidence |
| --- | --- | --- | --- |
| G0 | `G1–G4` | 六個主要頁面同時維持正確角色與下一步 | 六頁 production captures、runtime facts、final diff |
| G1 About 信任 | `A1–A4` | 首屏、CabAI 證據與頁尾都能自然導向 Work | About targeted／full-page evidence |
| G2 Work 證據 | `W1–W4` | 案例可掃讀、連結名稱不過長、合作入口清楚 | DOM outline、focus name、Work captures |
| G3 Courses 選擇 | `C1–C4` | 四條路不是必修漏斗，三條可走路線可明確啟動 | route facts、CTA states、Courses captures |
| G4 Services 適配 | `S0–S6` | 服務、經驗、流程、邊界與聯絡各自完成單一任務，且不靠小字或過度主張維持完整感 | heading outline、type／CTA rect、mailto facts、Services captures |
| S1／S3 共用互動 | `F1–F4` | 共用 CTA 狀態成立且 Home／Expertise 不回歸 | contract、state captures、regression captures |

## 2. 執行節奏與硬規則

### 2.1 每個 slice 的固定生命週期

```text
讀取父計畫與前一 gate 結果
→ git status 確認乾淨或只有本 slice 變更
→ 記錄 before facts
→ 只做本 slice
→ 跑 lightweight gate
→ 以真實 browser/runtime 取得 targeted evidence
→ 人工開圖或回讀 DOM
→ 更新 slice ledger
→ 通過才進下一 slice
```

一個 slice 應修改不超過 1–3 個 production files。超過時先停下來重新切分，不以「順便整理」擴大範圍。

### 2.2 驗證分層

| Gate | 何時執行 | 必做項目 |
| --- | --- | --- |
| L0：文件／事實 | planning、contract、copy responsibility | source 回讀、連結／資料來源檢查、`git diff --check` |
| L1：單一變更 | 每個 production code slice | `npm run check`、targeted DOM／尺寸／互動、1440 與 390 關鍵區截圖 |
| L2：單頁 gate | 每頁最後一個 slice | `validate:content`、`check`、`build`、五 viewport、完整長頁、鍵盤／anchor／zero overflow |
| L3：跨頁 gate | 全部頁面完成後 | 六頁回歸、forced-colors、reduced-motion、CTA inventory、fresh production evidence |

L1 失敗時只回修當前 slice。L2 失敗時不能進下一頁。L3 只做整合修正；若發現頁面本身設計錯誤，回到該頁 slice，不在全域 CSS 用補丁掩蓋。

### 2.3 每個 UI slice 的最小 change contract

每個 slice 在執行記錄中至少回答：

1. **Behavior boundary：** 本步唯一改變的可觀察行為，以及明確不動的相鄰行為。
2. **Entrypoints／consumers：** route、anchor、外站、鍵盤與 Mobile／Desktop 使用者。
3. **Baseline facts：** 目前 DOM、尺寸、href、順序或渲染畫面。
4. **Intentional change：** 哪個行為刻意改變，理由來自父計畫哪個 goal。
5. **Acceptance example：** 具體 Given／When／Then，至少覆蓋最高風險路徑。
6. **Evidence mapping：** 自動檢查、runtime facts、截圖與人工判讀各證明什麼。

`F1` 會建立正式共用 contract。各頁 slice 不重複發明 schema，而是在 evidence README 追加 narrow change record。

### 2.4 序列施工與 checkpoint

- 全部 production implementation 採序列執行；`global.css` 與跨頁 gate 不平行施工。
- 每個 slice 可以獨立停止；每個頁面 gate 通過後建立父計畫指定的 checkpoint commit。
- 不 push。若需要更細 rollback，可在同一頁內建立 `chore: checkpoint <slice-id>` 暫時 commit；頁面完成前可 squash，但不得重寫別人的 commit。
- 每個 checkpoint 前列出 `git status --short` 與 staged files；只納入本頁與新 evidence。

## 3. Preflight：先鎖定核准與現況

### P0：核准邊界

**類型：** decision gate，零 production files。

- 核准父計畫與本切片的頁面角色、CTA taxonomy、文案待確認項、執行順序與 non-goals。
- 未核准時維持 `pending_user_review`，不得因「方向應該沒問題」先改 code。

**DoD：** 文件寫入核准日期與批准範圍；若只有部分頁面獲准，ledger 明確標記可執行頁面，其餘保持 blocked-by-decision。

### P1：Repo facts refresh

**類型：** read-only fact gate。

- 確認 `master`、working tree、最新 commit 與父計畫建立後的程式差異。
- 回讀八個 production files：`global.css`、Home、Expertise、About、Work、Courses、Services、`authority.ts`。
- 確認 `siteConfig.contactEmail`、`withCabAiAttribution()`、四條 course route、三種 service track 與既有 href 未漂移。
- 重跑 baseline commands；若 repo facts 已改，先更新父計畫與本文件，不硬套舊行號或舊截圖。

**DoD：** baseline facts 與 pending risks 寫進本輪 execution README；worktree 沒有不明變更。

## 4. Foundation：先建立共用行為，不碰四頁敘事

### F1：建立 CTA 與 sequence behavior contract

**Exact files：** 新增 `docs/contracts/remaining-primary-pages-cta-and-sequence-contract-2026-07-14.md`。

- 記錄 `.btn`、bordered paper action、contextual action row、recovery、navigation 的 baseline 與 intentional changes。
- 明列 first paint、ready、hover、active、focus-visible、reduced-motion、forced-colors、disabled-like status。
- Acceptance 至少覆蓋：Home 不變、Expertise 不變、Course unavailable 無 href、Email 與 CabAI 來源不變。

**Gate：** L0。**DoD：** contract schema 完整，所有父計畫 CTA role 都有 evidence mapping。

### F2：只整理共用 CTA states

**Exact files：** `src/styles/global.css`。

- 只補共用的 filled／bordered paper state、focus、active、reduced-motion、forced-colors。
- 不修改 `.text-link` 的全站語意，不新增頁面 layout selector，不碰四頁文案或 DOM。

**Acceptance：** Given Home／Expertise 使用現有 `.btn`，When 套用新共用 states，Then default 尺寸、focus 與 layout 不變，只新增缺少的互動狀態。

**Gate：** L1；只截共用 state sandbox 或既有按鈕關鍵區。

### F3：Home regression

**Exact files：** 零 production files；只有 `docs/design/audits/2026-07-14-shared-action-regression/` evidence。

- 驗證 Home Hero、診斷、route、案例、CabAI CTA 的尺寸、順序、href、hover、focus。
- 1440、390 targeted captures；若失敗回 F2，不改 Home scoped CSS。

**Gate：** L1。**DoD：** Home contract 無 regression。

### F4：Expertise regression 與 Foundation checkpoint

**Exact files：** 零 production files；延續 F3 evidence。

- 驗證診斷 anchor、三方法順序、Hero 與頁尾 CTA。
- 1440、390 targeted captures；確認後建立 `chore: establish shared paper action contract` checkpoint。

**Gate：** L1。**DoD：** Foundation contract、global states、兩頁證據一致。

## 5. About：四小步完成信任路徑

### A1：內容責任去重

**Exact files：** `src/pages/about.astro`。

- 只處理 Hero、交付信念、timeline 前言的同義重述與核准 heading phrase grouping。
- 不改 CTA 樣式、時間軸 DOM、數字、日期、作品、CabAI URL 或頁尾順序。

**Gate：** L1。**DoD：** 完整閱讀不再重複同一主張，source facts 不變。

### A2：Hero 與 CabAI contextual actions

**Exact files：** `src/pages/about.astro`，必要時只消費 F2 已存在的 class。

- 將 Hero Work 與 CabAI 入口升為父計畫指定的 bordered／contextual action，不碰頁尾 Primary。
- 驗證 href、target、rel、accessible name 與 48px 行動高度。

**Gate：** L1。**DoD：** 兩個行動可在五秒掃讀辨認，但不把 CabAI 變成商品 pitch。

### A3：Mobile timeline 與頁尾決策

**Exact files：** `src/pages/about.astro`。

- 只處理 320／360／390 heading、timeline rail、紙張安全內距與頁尾付費路徑分流。
- 頁尾以 `/services/` 作為唯一 filled Primary，`/courses/` 作為 bordered Secondary，`/work/` 降為 utility evidence link。
- 不新增未核准的「陪跑」服務承諾；不刪 timeline 或公開證據，不用 fixed height、overflow hidden、縮字解決長度。

**Gate：** L1。**DoD：** Mobile DOM／視覺順序一致，頁尾 Services 是唯一 Primary，Courses／Work 路徑可辨識且目的地正確。

### A3b-1：公開輸出與交付經驗資料責任

**Exact files：** `src/config/authority.ts`，以及本 execution plan、CTA contract 的 evidence／traceability 段落。

- 將 About 的信任證據拆成兩個明確資料群：`publicOutputs`（GitHub、公開文章／研究、Threads 等可外部查驗輸出）與 `deliveryProofs`（課程、教學、內訓、產品交付、CabAI 內容交付）。
- 每筆資料至少要有 `title`、`type`、`problem`、`insight`、`evidence`、`destination`；About 讀的是「問題／判斷／證據透露的能力」，Work 才保留完整案例、限制與外部檔案連結。
- stars／forks 保留於 canonical data 供其他頁面或日後查核，但不在 About 顯示；課程人數與日期只能作次要 evidence，不新增未由 canonical source 支持的成果、客戶或能力宣稱。
- `representativeWork` 保留為 Work 的完整案例來源；`openSourceProofs` 只有 About 使用，確認 migration 後才可移除，不能先刪資料再補文案。

**Gate：** L0。**DoD：** 建立 public output／delivery proof content matrix，所有 visible claim 都能回到 `authority.ts`、既有 Work story、公開文章或明確外部 URL；待使用者確認內容分組後才進版面施工。

### A3b-2：About 信任證據版面重組

**Exact files：** `src/pages/about.astro`，必要時只修改 About scoped CSS。

- `公開作品` 不再渲染成 repo name／stars／forks 清單；改成「公開輸出」敘事區，呈現 3–4 個可查驗輸出如何證明問題拆解、產品化、研究與持續交付能力。
- 每項 repo 名稱只顯示一次；描述與來源動作不再重複 repo 名稱。交付成果保留成果數字，但移除畫面上的「截至」日期。
- 在同一信任章節內建立獨立的「交付經驗」子區，明確標示課程、教學、內訓、產品交付與 CabAI 平台不是作品 repo，而是把方法交給別人使用的證據。
- 公開輸出區保留一個 contextual bordered CTA `看完整作品與關鍵判斷`，導向 `/work/#selected-work`；不在每個項目重複放相同 Work CTA。
- 同一 action area 增加 `GitHub 個人頁` 與 `Threads 帳號` profile links，分別使用 `siteConfig.githubUrl`、`siteConfig.threadsUrl`；兩者視覺層級低於 Work，不改變頁尾付費路徑分流。
- Services／Courses 不在中段搶主導；About 頁尾仍由 Services filled Primary、Courses bordered Secondary 完成最後分流，避免信任區塊變成商品牆。
- Desktop 採 editorial hierarchy（主敘事＋較短的 supporting entries），Mobile 依 DOM 順序單欄自然增高；禁止 fixed height、overflow hidden、縮字或把兩種證據重新混成一張等權重列表。

**Gate：** L1。**DoD：** 390／1280 關鍵畫面能一眼分辨 public output 與 delivery proof；Work、GitHub profile、Threads profile actions 可辨識且至少 48px；About 不顯示 stars／forks；無水平溢位；CabAI capability row、timeline、頁尾 Services／Courses 意圖不退步。

### A4：About page gate

**Depends on：** A3b-1、A3b-2。

**Exact files：** 新增／更新 `docs/design/audits/2026-07-14-about-implementation/`。

- 跑 L2；驗證 320、360、390、1280、1440，完整長頁、外連、Tab、Enter、focus、zero overflow。
- 人工開啟所有截圖；只記錄新 production evidence。

**DoD：** 父計畫 4.9 全通過，建立 `fix: route about trust into learning and services` checkpoint。

## 6. Work：四小步完成證據到合作路徑

### W1：案例語意與長卡拆分

**Exact files：** `src/pages/work.astro`。

- 將三張整卡 anchor 改為語意 article＋獨立 action row；內容與順序不變。
- 不先改 Hero、featured handbook 或頁尾 Services CTA 樣式。

**Gate：** L1。**DoD：** accessible name 簡短、Tab 範圍可理解、整張 417px 長卡不再是唯一 anchor。

### W2：Featured 與 Services CTA 層級

**Exact files：** `src/pages/work.astro`。

- 對齊 Desktop／Mobile handbook CTA，提升 Hero 高意圖捷徑與頁尾 Services Primary。
- 不新增案例、客戶名、成果數字或產品承諾。

**Gate：** L1。**DoD：** 同一行動跨 viewport 不降級；讀完證據可清楚前往 Services。

### W3：Mobile 密度與 heading phrases

**Exact files：** `src/pages/work.astro`。

- 只調案例內容分工、間距、標題句組與 `#selected-work` sticky offset。
- 不刪限制、日期或揭露範圍，不把案例壓成成果口號。

**Gate：** L1。**DoD：** 320–390px 可讀、零裁切，頁面縮短來自去重與結構而非縮字。

### W4：Work page gate

**Exact files：** 新增 `docs/design/audits/2026-07-14-work-implementation/`。

- 跑 L2；驗證 full page、featured CTA、case action、limited disclosure、Services CTA、anchor offset、focus name。

**DoD：** 父計畫 5.9 全通過，建立 `fix: turn work evidence into clear case routes` checkpoint。

## 7. Courses：四小步完成非必修選擇地圖

### C1：選擇語意與資料責任

**Exact files：** `src/config/authority.ts`、`src/pages/courses/index.astro`。

- 明寫四條路依投入與深度排列、可獨立進入；去除 Hero 與 map header 的重述。
- 保留四條 route、商品名、價格、免費試看、未開放狀態與 CabAI campaign。

**Gate：** L1。**DoD：** 只看標題與狀態不會誤解為 01→04 必修漏斗。

### C2：三個可走 route CTA

**Exact files：** `src/pages/courses/index.astro`。

- 將問題診斷、AgentSkill、工程手冊的 action 提升為 48px contextual／recovery actions。
- 尚未開放項目維持無 href、無假按鈕、無 pointer cursor。

**Gate：** L1。**DoD：** 三個可走入口可辨識；unavailable state 不被誤認為可點。

### C3：CabAI secondary 與 Mobile map

**Exact files：** `src/pages/courses/index.astro`。

- 降低抽象帳號 CTA 相對於具體路線的權重；調整 Mobile rail、句組與 `#learning-map` offset。
- 不改 CabAI URL 產生方式、價格、試看或交付承諾。

**Gate：** L1。**DoD：** 訪客先選具體路線，再看 CabAI 帳號說明；320–390px 順序成立。

### C4：Courses page gate

**Exact files：** 新增 `docs/design/audits/2026-07-14-courses-implementation/`。

- 跑 L2；驗證 map ordering、三個 CTA、未開放 state、CabAI secondary、anchor offset、external URL facts。

**DoD：** 父計畫 6.9 全通過，建立 `fix: make course choices explicit and non-sequential` checkpoint。

## 8. Services：六小步完成適配到聯絡路徑

### S0：Services 嚴格規劃審核（verified）

**Exact files：** 父計畫、本文件、新增 `docs/design/audits/2026-07-14-services-strict-plan-audit/`；零 production files。

- 以當次 1280 與 390 captures、320／360／390 runtime facts、heading outline、computed type、CTA rect、href／target／rel 回查舊規劃。
- 確認已成立的 baseline：三種服務與四步順序正確、Email `52.8px` 且 `mailto:` 正確、三個 Mobile width 無 overflow、`#service-options` 未被 Headbar 遮住。
- 鎖定待修 baseline：service list `13.12px`、process `13.44px`、raw English id、無 heading 的 proof、proof claim scope、Desktop boundary 斷句、Threads `22.84px` 且無 border。

**Gate：** L0。**DoD：** 父計畫 7.0–7.9 與 S1–S6 能從 fresh session 直接執行，不把 planning evidence 寫成 implementation complete。

### S1：文件大綱與流程用語

**Exact files：** `src/pages/services.astro`。

- 為合作經驗加入真實 heading element；將第三個流程節點由「推進」改為「執行」。
- 只重組 Hero、options、boundary、contact 的既有 heading phrases，修正實測的不自然斷句；不改原句文字、服務資料、CTA 或區塊順序。

**Gate：** L1。**DoD：** heading outline 完整，四個 major heading 在 1280／390 沒有斷成孤立詞，流程 DOM／視覺順序一致。

### S2：服務適配資訊去重

**Exact files：** `src/config/authority.ts`、`src/pages/services.astro`。

- 讓服務卡只回答「問題訊號／會留下什麼」；每項保留 2–3 個高訊號 fit 與 3 個 deliverables。
- 保留 `service.id` 作 anchor／data key，但移除由 raw slug 轉出的 visible English metadata；`01–03` 與中文 title 承擔辨識。
- 先全 repo 搜尋後才可移除未使用的 `notFit`；資料仍有消費者就保留。
- 不新增客戶、成果或服務承諾。

**Gate：** L1。**DoD：** 三種服務仍足以自我篩選，visible UI 無 raw slug；Desktop list `>=15px`，Mobile list `>=16px`，不以縮字抵銷去重效果。

### S3：合作經驗證據邊界與共通合作邊界

**Exact files：** `src/pages/services.astro`；只讀 `src/config/authority.ts` 與 `src/pages/work.astro` 核對已存在的證據範圍。

- 合作經驗 heading 與主張只涵蓋現有可支持的企業內訓、系列工作坊與線上實作課程交付；不把它延伸成三種服務都有相同成果。
- Boundary 固定由四類共通契約資訊構成：成效不保證、必要資料／內部 owner、驗收／修改、維護／後續支援。
- 移除重述 Hero 的「熱門名詞」原則句；不新增客戶、數字、成果或未核准案例。

**Gate：** L1。**DoD：** proof claim 與證據範圍一致；boundary 每條都能歸入四類契約資訊，且不重複任一 service fit。

### S4：Email Primary 與 Threads fallback

**Exact files：** `src/pages/services.astro`；只讀 `src/config/siteConfig.ts`。

- Email 維持唯一 Primary；Threads 成為清楚的 48px Secondary。
- `mailto:` 必須繼續由 `siteConfig.contactEmail` 產生，外站維持 `target`／`rel`。

**Gate：** L1。**DoD：** Email 仍為 filled Primary；Threads 有 border 且 Desktop／Mobile `>=48px`。Mobile 兩者 full width，不方便寄信者看得見替代路徑但不會誤認它是主要入口。

### S5：Mobile comparison、process 與 anchor

**Exact files：** `src/pages/services.astro`。

- 只處理 320–390px 服務比較、四步流程、安全內距與 `#service-options` offset；heading phrase 已由 S1 負責，不在此步重寫。
- 不用固定高度、裁切或縮字，不把合作經驗壓成一句。

**Gate：** L1。**DoD：** Mobile 閱讀長度由內容分工改善，service／process body `>=16px`、zero overflow、流程方向清楚，anchor top 高於 Headbar。

### S6：Services page gate

**Exact files：** 新增 `docs/design/audits/2026-07-14-services-implementation/`。

- 跑 L2；驗證 service comparison、heading outline、process、Email／Threads states、anchor、mailto facts。

**DoD：** 父計畫 7.9 全通過，建立 `fix: sharpen services fit and contact flow` checkpoint。

## 9. Cross-page gates：最後才處理整合

### G1：Automated 與資料來源 gate

**Exact files：** 原則上零 production files；失敗回原 owner slice。

- 跑 `git diff --check`、`npm run validate:content`、`npm run check`、`npm run build`。
- 回查 Email、CabAI attribution、價格、日期、產品狀態、external target／rel、unavailable href。
- 記錄已知 Astro hints 與 Vite asset warnings；不能用「build 成功」掩蓋新增警告。

**DoD：** commands 通過，資料來源與 intentional changes 可追溯。

### G2：Interaction 與 accessibility gate

**Exact files：** 新增 final audit runtime facts；必要修正回原頁。

- 六頁 Tab／Enter／anchor；重要 CTA 尺寸；focus-visible；reduced-motion；forced-colors；Mobile menu＋Headbar。
- 確認整列／長卡連結沒有不合理 accessible name，heading outline 沒有跳級或遺失。

**DoD：** 所有 acceptance examples 有 runtime evidence，沒有靜默失敗。

### G3：Visual production gate

**Exact files：** 新增 `docs/design/audits/2026-07-14-primary-pages-production-gate/`。

- 六頁 1440／390 full-page；About、Work、Courses、Services 另取 1280／360／320 關鍵區。
- 所有截圖 fresh build、逐張人工開圖；記錄 `scrollWidth === innerWidth` 與關鍵 CTA rect。

**DoD：** Home／Expertise 無回歸，四頁各自保留專屬語法，沒有錯頁、cache mismatch、裁切或 Dev Toolbar。

### G4：文件收斂與完成 checkpoint

**Exact files：** 父計畫、本文件、正式 behavior contract、final audit README。

- 只依現有證據更新 `status`、approval、completed slices、remaining risks 與已知警告。
- 不把 skipped、deferred 或只靠靜態推理的項目寫成完成。
- 最終 diff 對照父計畫 invariants、non-goals 與 goal traceability。

**DoD：** 所有文件、畫面、runtime facts、commit ledger 一致，建立 `chore: complete primary page production gate` checkpoint，不 push。

## 10. Slice ledger

狀態只使用 `pending`、`in_progress`、`verified`、`blocked-by-decision`、`failed-needs-rework`。

| Slice | 初始狀態 | Production files | Heavy gate | 可安全停在此處 |
| --- | --- | ---: | --- | --- |
| P0 | blocked-by-decision | 0 | 否 | 是 |
| P1 | verified | 0 | baseline | 是 |
| F1 | verified | 0 | 否 | 是 |
| F2 | verified | 1 | L1 | Foundation delivery continues through F3–F4 |
| F3 | verified | 0 | L1 | 是 |
| F4 | verified | 0 | L1 | 是 |
| A1 | verified | 1 | L1 | 是 |
| A2 | verified | 1 | L1 | 是 |
| A3 | verified | 1 | L1 | 是 |
| A3b-1 | pending | 1 | L0 | 是，限資料責任與內容矩陣 |
| A3b-2 | pending | 1 | L1 | 否，需瀏覽器證據 |
| A4 | pending | 0 | About L2 | 是 |
| W1–W3 | pending | 1／slice | 否 | 只限同頁施工中 |
| W4 | pending | 0 | Work L2 | 是 |
| C1–C3 | pending | 1–2／slice | 否 | 只限同頁施工中 |
| C4 | pending | 0 | Courses L2 | 是 |
| S0 | verified | 0 | L0 | 是，planning evidence only |
| S1–S5 | pending | 1–2／slice | 否 | 只限同頁施工中 |
| S6 | pending | 0 | Services L2 | 是 |
| G1–G4 | pending | 0，修正回 owner | Cross-page L3 | G4 後完成 |

## 11. 優先序、停損與可選項

### Core

P0–G4 全部是本輪 Core。頁面順序採 `Foundation → About → Work → Courses → Services → Cross-page`，因為前一頁會提供下一頁可重用的驗證方法，但不提供可複製的 layout。

### 可延後但必須明列

- 純裝飾 polish、額外動效、ImageGen、非必要 icon 變體可延後；跳過不影響頁面 gate。
- Vite public asset placeholder warning 若確認為既有且不影響 runtime，可建立獨立 technical-debt item；若是本輪新增或造成資產缺失，則阻塞 G1。
- 完整螢幕閱讀器矩陣若本輪工具不足，可以列 deferred verification，但 heading、native anchor、accessible name、Tab、Enter、focus 不可延後。

### 停損條件

- 同一 slice 連續兩輪修正仍沒有改善 targeted evidence：停止調 CSS，回查內容責任或 DOM 判斷。
- 共用 CSS 造成 Home／Expertise 任一 regression：立即回退 F2，必要狀態改留在頁面 scoped CSS。
- production 與 dev 不一致：作廢證據，fresh build＋cache-bust 後重驗。
- 文案會改變價格、服務範圍、公開事實或產品狀態：停止並要求決策，不自行合理化。
- 發現父計畫 repo facts 已漂移：更新計畫與 contract，再繼續施工。

## 12. 新 session 開工卡

每個新 session 只拿一個 slice，開工前需回報：

```text
Slice ID：
Goal contribution：
Exact production files：
Baseline facts：
Intentional change：
Protected invariants：
Out of scope：
Lightweight gate：
Targeted evidence path：
Previous gate／checkpoint：
```

若其中任一欄無法從 repo、父計畫或前一 gate 回答，該 session 只做 fact refresh，不進入 implementation。

## 13. Execution-readiness verdict

**Verdict：Ready after approval。**

- Repo reality：所有列出的 production files 與資料來源已存在。
- Phase sizing：每個 production slice 只動 1–2 個主要檔案與一種風險；browser evidence 與 heavy gate 分層執行。
- Contract：F1 指定正式 artifact，各 UI slice 有 narrow change record 與 acceptance evidence。
- Serial coordination：`global.css`、頁面 implementation、final gate 均明確序列化，不允許跨 slice 混改。
- Remaining blocker：P0 使用者核准。核准前只能補文件與 repo facts，不能宣稱四頁已完成。
