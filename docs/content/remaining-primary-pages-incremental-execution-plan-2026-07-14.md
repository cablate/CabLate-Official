---
status: proposed
approval_status: pending_user_review
created: 2026-07-14
parent_plan: docs/content/remaining-primary-pages-visual-conversion-master-plan-2026-07-14.md
acceptance_standard: docs/design/page-reading-and-interaction-acceptance-standard.md
baseline_audit: docs/design/audits/2026-07-14-remaining-primary-pages-plan/README.md
execution_mode: serial-small-slices
---

# About、Courses、Services 小步執行計畫（Work 暫時封存）

## 0. 文件定位與目前判定

這是 2026-07-14 四頁 Master Plan 的施工切片。2026-07-15 使用者決定 Work 暫時封存，因此 Work 既有規劃保留為歷史與恢復依據，但不再是目前 production execution path。

目前判定：**Incremental User Review**。About 與 Services 已有部分核准切片；Work archive 依 `docs/contracts/work-route-archive-2026-07-15.md` 執行，後續主線改為 Courses → Services → Cross-page。

深層目標不是更快累積改動，而是縮短「做出變更 → 看見真實結果 → 修正判斷」的距離。每一步只承擔一種主要風險，避免文案、DOM、共用 CSS、Responsive 與跨頁 QA 同時變動，導致失敗時無法定位。

## 1. Goal model 與切片原則

### 1.1 Goal model

- **Primary goal G0：** About、Courses、Services 各自完成一個清楚的訪客決策；Work 在沒有獨占任務時不出現在公開路徑，且不讓已驗證的 Home、Expertise 退步。
- **Supporting goals：** CTA 可辨識、順序與 DOM 一致、Mobile 可讀、證據靠近主張、真實資料不漂移、訪客有回復路徑。
- **Soft goals：** 每次變更容易理解、容易驗證、容易回退；新 session 不必依賴聊天記憶。
- **Domain invariants：** 沿用父計畫 1.4 全部規則；特別保護真實 Email、CabAI attribution、產品狀態、價格、日期、公開證據、Rail、Headbar、Footer、Home 與 Expertise。
- **Non-goals：** Articles detail、Course detail、Search、Starter Pack、品牌重做、大量生成圖片、未核准的新案例／數字／服務承諾。

### 1.2 Goal-to-slice traceability

| Goal | Slice owner | Observable outcome | Evidence |
| --- | --- | --- | --- |
| G0 | `G1–G4` | 六個主要頁面同時維持正確角色與下一步 | 六頁 production captures、runtime facts、final diff |
| G1 About 信任 | `A1–A4` | 首屏、公開輸出與頁尾能自然導向 Services、Courses、Expertise 或外部公開來源 | About targeted／full-page evidence |
| G2 Work 封存 | `WA0` | 公開入口撤除、舊 URL 安全轉向 About 公開輸出、原始碼可恢復 | archive contract、CTA inventory、redirect／sitemap evidence |
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

### A2：Hero 與 CabAI contextual actions（WA0 後由同頁公開輸出承接）

**Exact files：** `src/pages/about.astro`，必要時只消費 F2 已存在的 class。

- Hero evidence action 在 WA0 後改為同頁 `#public-output-title`；CabAI 維持既有 contextual action，不碰頁尾 Primary。
- 驗證 href、target、rel、accessible name 與 48px 行動高度。

**Gate：** L1。**DoD：** 兩個行動可在五秒掃讀辨認，但不把 CabAI 變成商品 pitch。

### A3：Mobile timeline 與頁尾決策

**Exact files：** `src/pages/about.astro`。

- 只處理 320／360／390 heading、timeline rail、紙張安全內距與頁尾付費路徑分流。
- 頁尾以 `/services/` 作為唯一 filled Primary，`/courses/` 作為 bordered Secondary；WA0 後移除 Work utility link。
- 不新增未核准的「陪跑」服務承諾；不刪 timeline 或公開證據，不用 fixed height、overflow hidden、縮字解決長度。

**Gate：** L1。**DoD：** Mobile DOM／視覺順序一致，頁尾 Services 是唯一 Primary，Courses、Expertise 與外部 profile 路徑可辨識且目的地正確。

### A3b-1：公開輸出與交付經驗資料責任

**Exact files：** `src/config/authority.ts`，以及本 execution plan、CTA contract 的 evidence／traceability 段落。

- 將 About 的信任證據拆成兩個明確資料群：`publicOutputs`（GitHub、公開文章／研究、Threads 等可外部查驗輸出）與 `deliveryProofs`（課程、教學、內訓、產品交付、CabAI 內容交付）。
- 每筆資料至少要有 `title`、`type`、`problem`、`insight`、`evidence`、`destination`；About 讀的是「問題／判斷／證據透露的能力」。Work 已封存，未來恢復時才另建完整案例與限制資料。
- stars／forks 保留於 canonical data 供其他頁面或日後查核，但不在 About 顯示；課程人數與日期只能作次要 evidence，不新增未由 canonical source 支持的成果、客戶或能力宣稱。
- `representativeWork` 與 `openSourceProofs` 目前重複維護部分 repo facts；WA0 不順便清理資料。若 Work 未來恢復，再以新的 source matrix 收斂 canonical facts 與 page-specific narrative。

**Gate：** L0。**DoD：** 建立 public output／delivery proof content matrix，所有 visible claim 都能回到 `authority.ts`、既有 Work story、公開文章或明確外部 URL；待使用者確認內容分組後才進版面施工。

### A3b-2：About 信任證據版面重組

**Exact files：** `src/pages/about.astro`，必要時只修改 About scoped CSS。

- `公開作品` 不再渲染成 repo name／stars／forks 清單；改成「公開輸出」敘事區，呈現 3–4 個可查驗輸出如何證明問題拆解、產品化、研究與持續交付能力。
- 每項 repo 名稱只顯示一次；描述與來源動作不再重複 repo 名稱。交付成果保留成果數字，但移除畫面上的「截至」日期。
- 在同一信任章節內建立獨立的「交付經驗」子區，明確標示課程、教學、內訓、產品交付與 CabAI 平台不是作品 repo，而是把方法交給別人使用的證據。
- WA0 後移除 `看完整作品與關鍵判斷`；公開輸出直接由各項來源 action 與 action area 的 GitHub／Threads profile links 承接。
- `GitHub 個人頁` 與 `Threads 帳號` 分別使用 `siteConfig.githubUrl`、`siteConfig.threadsUrl`，兩者同層，不改變頁尾付費路徑分流。
- Services／Courses 不在中段搶主導；About 頁尾仍由 Services filled Primary、Courses bordered Secondary 完成最後分流，避免信任區塊變成商品牆。
- Desktop 採 editorial hierarchy（主敘事＋較短的 supporting entries），Mobile 依 DOM 順序單欄自然增高；禁止 fixed height、overflow hidden、縮字或把兩種證據重新混成一張等權重列表。

**Gate：** L1。**DoD：** 390／1280 關鍵畫面能一眼分辨 public output 與 delivery proof；GitHub／Threads profile actions 可辨識且至少 48px；About 不顯示 stars／forks；無水平溢位；CabAI capability row、timeline、頁尾 Services／Courses 意圖不退步。

### A4：About page gate

**Depends on：** A3b-1、A3b-2。

**Exact files：** 新增／更新 `docs/design/audits/2026-07-14-about-implementation/`。

- 跑 L2；驗證 320、360、390、1280、1440，完整長頁、外連、Tab、Enter、focus、zero overflow。
- 人工開啟所有截圖；只記錄新 production evidence。

**DoD：** 父計畫 4.9 全通過，建立 `fix: route about trust into learning and services` checkpoint。

## 6. Work：暫時封存，保留歷史規劃

### WA0：Work 公開路徑暫時下架（implemented／awaiting user review）

**Exact files：** `astro.config.mjs`、`src/config/authority.ts`、`src/layouts/BaseLayout.astro`、`src/pages/about.astro`、`src/pages/work.astro` → `src/archive/work.astro`、archive contract 與 audit evidence。

- Work 從桌機／手機主導覽、Footer 與 About 三個入口撤下。
- About Hero 改為同頁公開輸出入口；公開輸出保留 GitHub／Threads；頁尾保留 Services／Courses／Expertise 與聯絡方式。
- 舊 `/work/` 以 Astro static redirect 前往 `/about/#public-output-title`，並從 sitemap 排除。
- 原 W0a–W6 與 W0d 黃色服務橋接保留為歷史與日後恢復依據；WA0 生效期間不得繼續 W0c、W1–W6 production implementation。

**Gate：** L2＋user review。**DoD：** production source 無 `/work/` 可見入口、redirect 與 sitemap 成立、Desktop／Mobile 導覽及 About 畫面通過、封存檔不生成正式內容頁。

**Current evidence：** automated gate、Desktop in-app browser 與 mobile navigation DOM 均已通過；只剩使用者畫面確認、390px final page gate 與 checkpoint。詳見 `docs/design/audits/2026-07-15-work-archive-yellow-paper-audit/README.md`。

### W0a：Work 視覺與互動規劃審核（verified）

**Exact files：** 父計畫、本文件、`docs/design/audits/2026-07-14-work-strict-plan-audit/`；零 production files。

- 以 1280／390 captures、320／360／390 runtime facts、heading outline、computed type、CTA rect、whole-card accessible name 與 href／target／rel 回查原規劃。
- 已成立的 baseline：閱讀順序、Hero H1、原 limited-disclosure 誠信邊界、三種 Mobile width zero overflow、`#selected-work` offset 與 external link safety；原頁尾內容後續由 W0d 的使用者決策取代。
- 待修 baseline：whole-card anchors、`166–192` 字 link names、`11.2–13.44px` case text、Mobile proof 重複、低辨識 actions 與不可執行的長 H2 句組。

**Gate：** L0。**DoD：** planning evidence 與 production status 分離；不得把既有四件案例名單視為已核准 invariant。

### W0b：跨頁重疊與既有經驗 owner audit（verified）

**Exact files：** 父計畫、本文件、`docs/design/audits/2026-07-14-work-public-records-overlap-audit/`；零 production files。

- Fresh 比對 Home handbook、About public output／delivery、Work records、Courses learning map、Services delivery proof 與 Expertise diagnosis。
- 確認 `mcp-google-map`／`banini-tracker` 在 About 與 Work 語意近似；手冊橫跨 Home／About／Work／Courses；金流教學對應 course entry 是 draft，公開 route 404，`/courses/` 未列該項目。
- 建立跨頁 owner contract：共享 artifact facts，不共享頁面 narrative；About 擁有 author signal、Work 擁有 decision record、Courses 擁有 product state、Services 擁有服務詳情與合作條件。非公開經驗不再於 Work 逐筆呈現。
- 建議 public decision roster：`mcp-google-map` featured、`banini-tracker`、`claude-code-research`；手冊與金流教學退出 Work Public Records。

**Gate：** L0。**DoD：** 原 W1 execution-ready 判定撤回；重疊與早期專業經驗都有明確 owner，不以 UI 修補取代內容決策。

### W0c：案例 source matrix 與名單核准（archived／deferred）

**Exact files：** 更新 overlap audit README、父計畫與本文件；只讀 `src/config/authority.ts`、Home／About／Work／Courses／Services sources 與核准的第一方公開來源；零 production files。

- 對 `mcp-google-map`、`banini-tracker`、`claude-code-research` 逐項填 context、real constraint、alternatives／trade-off、decision、artifact、verification source；缺少來源的欄位明確留白，不用推測補齊。
- 不再為 Work 建立 limited-disclosure candidate roster；使用者已核准 W0d，以不含客戶、公司或合作方線索的服務橋接卡取代該區塊。
- 驗證每個 `PUBLIC DECISION RECORD` destination 可公開開啟；draft、404、泛用索引頁或只有個人主張的項目不通過。
- 使用者核准三件 public decision roster 與 source-backed decision depth 後才解除 W1 blocker。

**Gate：** L0＋user review。**DoD：** 每個 Work record 都比 About 多一層 source-backed decision depth；名單、順序、資料來源與排除項明確核准。

### W0d：作品證據後的黃色服務橋接（verified）

**Exact files：** `src/pages/work.astro`、`docs/contracts/work-service-bridge-2026-07-14.md`、父計畫、本文件、`docs/design/audits/2026-07-14-work-service-bridge/`。

- 使用者核准 ideation option 2：左側說明「從做過的判斷，走到可以合作的方式」，右側用三張既有黃色紙張素材呈現 `serviceTracks`。
- 完整移除企業／客戶／合作方與揭露限制敘述；Work 只寫三種服務情境，完整 fit、deliverables、流程與邊界仍由 Services 擁有。
- 三張卡是非互動 `<article>`；區塊只有一個「查看完整服務與合作方式」CTA，destination `/services/`。
- Desktop 保留微幅錯落紙卡；320–390px 依 DOM 順序單欄，取消位移與旋轉，不使用 fixed height 或縮字掩蓋內容。

**Gate：** L1＋user-selected visual。**DoD：** 1280／390 畫面與 option 2 的構圖、黃色紙卡、標題與單一 CTA 對齊；320／360／390 zero overflow、CTA `>=48px`、無客戶或保密字樣。此切片不解除 W0c 的 public record roster blocker。

### W1：Canonical facts 與 page-specific projections

**Exact files：** `src/config/authority.ts`、`src/pages/work.astro`，新增／更新 `docs/design/audits/2026-07-14-work-implementation/README.md` 的 narrow change contract。

- 建立可由 About／Work 共用的 public artifact identity／href／proof facts；至少有兩個 consumer，避免 `representativeWork` 與 `openSourceProofs` 各自維護相同 repo 事實。
- About 保留 author-signal narrative；Work 另有 W0c 核准的 context／constraint／trade-off／decision／verification projection。禁止建立一段兩頁共用的 generic summary。
- Work roster 切為 `mcp-google-map` featured、`banini-tracker`、`claude-code-research`；只從 Work 移除手冊與金流教學，不改 Home／About／Courses 的既有可見內容與產品狀態。
- 保留 W0d 已核准的服務橋接，不在 W1 重新加入 limited-disclosure roster 或客戶線索。
- 不先處理 whole-card anchor、字級、CTA 或 heading。

**Gate：** L1。**DoD：** canonical facts 只有一個 owner，About 可見內容零回歸；Work 三件公開紀錄符合核准矩陣，無 draft／404 destination；W0d 服務橋接零回歸。

### W2：Decision-record 語意與獨立目的地

**Exact files：** `src/pages/work.astro`，更新 W1 evidence README。

- Featured DOM 依 context → constraint → alternatives／trade-off → decision → artifact → verification → action；次要 records 依 title → new decision insight → evidence → action。
- 將 whole-card anchors 改為語意 `<article>`；只有末端 action 是 anchor。
- Actions 顯示「查看公開程式碼與使用文件」「查看公開程式碼」「查看公開研究」；accessible name 包含 case title，但排除整張 article 內文。
- 不先改字級、heading 或 CTA 視覺層級。

**Gate：** L1。**DoD：** 每件 record 都有 About 未提供的新 decision layer；Tab 只停在明確 action，整張長卡不再是唯一 anchor，external target／rel 正確。

### W3：證據 owner 與可讀字級

**Exact files：** `src/pages/work.astro`，更新 W1 evidence README；只讀 canonical facts 核對 proof。

- 每個 viewport 的同一 proof 只由一個 evidence owner 顯示。
- Decision-record body 設為 Desktop `>=15px`、Mobile `>=16px`；proof metadata 設為 Desktop `>=14px`、Mobile `>=15px`。
- Stars／forks／日期只作 corroborating metadata，不取代 constraint、decision 或 verification；不以縮字、fixed height、overflow hidden 或刪除推理追求短頁。
- 不改 CTA 外觀、destination 或 W0d 服務橋接文案。

**Gate：** L1。**DoD：** 1280／390 能完整閱讀三件公開紀錄；同一 proof 不重複；320–390 zero overflow。

### W4：證據後的 action hierarchy

**Exact files：** `src/pages/work.astro`，更新 W1 evidence README；不修改 `src/styles/global.css`。

- Hero `#selected-work` 維持唯一 filled Primary；Hero Services shortcut 成為 `>=48px` bordered Secondary。
- Featured public-source action 成為有可見 boundary 的 contextual action，Desktop／Mobile `>=48px`，Mobile full width。
- W2 的 record actions 具清楚 action row，Mobile full width／`>=48px`。
- 頁尾 W0d 只顯示「查看完整服務與合作方式」，成為唯一 filled Services Primary；Desktop `>=52px`、Mobile full width／`>=48px`。

**Gate：** L1。**DoD：** 越接近證據高點，行動辨識不下降；同一區只有一個 filled Primary，href／target／rel 全部正確。

### W5：公開作品 Heading 與 Mobile reflow

**Exact files：** `src/pages/work.astro`，更新 W1 evidence README。

- H1 原文與三個既有 phrase 不變。
- Selected H2 使用核准短句「每件作品，都從問題開始。」並建立 phrase spans。
- W0d service bridge heading 與 grid 已完成，不在本 slice 改寫；只驗證公開作品調整沒有推擠或覆蓋頁尾服務卡。
- Mobile 處理 320–390px heading、紙張安全內距與自然 section spacing；保護已通過的 `#selected-work` 約 `83px` offset。
- W0c 核准的 public record body、W0d service bridge 與所有 actions 不在本 slice 改寫。

**Gate：** L1。**DoD：** 320／360／390／1280／1440 的公開作品與 service bridge H2 不拆壞中文詞組、zero overflow；anchor 不退步。

### W6：Work page gate

**Exact files：** 更新 `docs/design/audits/2026-07-14-work-implementation/`。

- 跑 L2；驗證 About → Work 不重複閱讀測試、full page、heading outline、case source mapping、featured proof owner、computed type、article／action、W0d service bridge、Services hierarchy、anchor offset、focus name、Tab／Enter 與 external links。
- 捕捉 320／360／390／1280／1440，逐張重開；錯頁、paint artifact、裁切或 stale scroll capture 一律作廢。

**DoD：** 父計畫 5.9 全通過，建立 `fix: turn work evidence into clear decision records` checkpoint。

## 7. Courses：四小步完成非必修選擇地圖

### C0：Courses 嚴格內容重審（verified）

**Exact files：** 父計畫、本文件、新增 `docs/design/audits/2026-07-15-courses-strict-content-reaudit/`；零 production files。

- 以 fresh 1280px captures、runtime DOM／CTA rect 與兩個第一方 CabAI 商品頁回查 Hero、四 route、商品 fit／名稱／價格／試看與 CabAI onboarding。
- 確認已成立的 baseline：Hero 主張、四 route 骨架、免費診斷 destination、未開放狀態、兩個價格、external URL／campaign 與免登入免費試看承諾。
- 鎖定待修 baseline：必修流程暗示、三個約 `23px` 的 route action、AgentSkill prerequisite 缺漏、手冊正式名稱不一致、免登入試看與 account CTA 的內容／視覺衝突。
- Fresh Mobile capture 因 viewport override 無效與 screenshot timeout 未取得；不得把舊 Mobile 圖寫成本輪證據，留給 C3／C4 驗收。

**Gate：** L0。**DoD：** 父計畫 6.0–6.9 與 C1–C4 能從 fresh session 直接執行，不把 planning evidence 寫成 implementation complete。

### C1：選擇語意與資料責任（verified, awaiting user review）

**Exact files：** `src/config/authority.ts`、`src/pages/courses/index.astro`、`docs/contracts/courses-choice-semantics-c1-2026-07-15.md`、`docs/design/audits/2026-07-15-courses-c1/`。

- 明寫四條路依投入與深度排列、可獨立進入；Map H2 去除「層」的必修暗示，並切開 Hero 與 map header 的內容責任。
- AgentSkill situation 補上「已開始使用 Skill」的前提，outcome 改成可帶走的能力；手冊 route 對齊第一方商品名「Claude Code 深度工程手冊」與具體排錯範圍。
- 保留四條 route、價格、destination、免登入免費試看、未開放狀態與 CabAI campaign；其他公開頁舊商品名只登記到 cross-page fact gate，不在本切片擴張修改。

**Gate：** L1。**DoD：** 只看標題與狀態不會誤解為 01→04 必修漏斗；AgentSkill 不會被誤認為純新手課，手冊名稱與商品頁 H1 一致。

**Evidence：** Hero／Map 責任已切開，Map 明寫「不用照編號走」，`START HERE` 改為 `CHOOSE ONE`，route container 為 `UL[role="list"]` 且仍有四項；AgentSkill prerequisite 與手冊正式名稱已對齊第一方商品頁。1280px fresh runtime `scrollWidth === clientWidth === 1265`；三個 href、兩個價格、兩個 CabAI campaign 與 unavailable state 未變。`check`、`validate:content`、`build`、`diff --check` 全通過，畫面見 `docs/design/audits/2026-07-15-courses-c1/`。

### C2：黃色建議紙與三個可走 route CTA（verified, awaiting user review）

**Exact files：** `src/pages/courses/index.astro`、`docs/contracts/courses-yellow-route-actions-c2-2026-07-15.md`、`docs/design/audits/2026-07-15-courses-c2/`。

- 四條 route 都用既有黃色閱讀紙承接「建議從這裡開始」、名稱、結果、價格／狀態與 action；外層白紙繼續負責描述訪客狀況。
- 將問題診斷、AgentSkill、工程手冊的 action 提升為 48px contextual／recovery actions。
- 尚未開放項目維持無 href、無假按鈕、無 pointer cursor。

**Gate：** L1。**DoD：** 三個可走入口可辨識；unavailable state 不被誤認為可點。

**Evidence：** 1280px 三個 actions 均為 `48px` 高；390px action 留在黃色紙張安全區內；320px 長 action 只在 `max-width: 340px` 自然換行。1280px／390px 全頁與 320px learning map 均為 zero overflow。四個 solution computed background 均解析為 `paper-reading-card` image-set；pending route 為 `a === 0`、`button === 0`、cursor `auto`。320px 全頁仍有既有 Hero H1 phrase 造成的 `5px` document overflow，交由 C3 Mobile 句組處理。fresh browser 畫面、stale CSS 排除紀錄與 automated gate 見 `docs/design/audits/2026-07-15-courses-c2/`。

### C3：CabAI secondary 與 Mobile map

**Exact files：** `src/pages/courses/index.astro`。

- CabAI onboarding 先說兩項內容皆可免登入免費試看，再說帳號負責已購內容與社群權限；降低抽象帳號 CTA 相對於具體路線的權重。
- 調整 Mobile rail、句組與 `#learning-map` offset；不改 CabAI URL 產生方式、價格、destination 或試看承諾。

**Gate：** L1。**DoD：** 訪客先選具體路線，再看 CabAI 帳號說明，且不會誤以為試看前必須註冊；320–390px 順序成立。

### C4：Courses page gate

**Exact files：** 新增 `docs/design/audits/2026-07-14-courses-implementation/`。

- 跑 L2；驗證 map ordering、三個 CTA、未開放 state、CabAI secondary、anchor offset、external URL facts、商品正式名稱、fit 與免登入試看事實。

**DoD：** 父計畫 6.9 全通過，建立 `fix: make course choices explicit and non-sequential` checkpoint。

## 8. Services：六小步完成適配到聯絡路徑

### S0：Services 嚴格規劃審核（verified）

**Exact files：** 父計畫、本文件、新增 `docs/design/audits/2026-07-14-services-strict-plan-audit/`；零 production files。

- 以當次 1280 與 390 captures、320／360／390 runtime facts、heading outline、computed type、CTA rect、href／target／rel 回查舊規劃。
- 確認已成立的 baseline：三種服務與四步順序正確、Email `52.8px` 且 `mailto:` 正確、三個 Mobile width 無 overflow、`#service-options` 未被 Headbar 遮住。
- 鎖定待修 baseline：service list `13.12px`、process `13.44px`、raw English id、無 heading 的 proof、proof claim scope、Desktop boundary 斷句、Threads `22.84px` 且無 border。

**Gate：** L0。**DoD：** 父計畫 7.0–7.9 與 S1–S6 能從 fresh session 直接執行，不把 planning evidence 寫成 implementation complete。

### S1：文件大綱與流程用語（verified）

**Exact files：** `src/pages/services.astro`。

- 為合作經驗加入真實 heading element；將第三個流程節點由「推進」改為「執行」。
- 只重組 Hero、options、boundary、contact 的既有 heading phrases，修正實測的不自然斷句；不改原句文字、服務資料、CTA 或區塊順序。

**Gate：** L1。**DoD：** heading outline 完整，四個 major heading 在 1280／390 沒有斷成孤立詞，流程 DOM／視覺順序一致。

**Evidence：** `docs/design/audits/2026-07-14-services-implementation/`。1280／390 均無水平溢位；合作經驗以可見 H2 命名 aside；流程為 `診斷 → 設計 → 執行 → 驗收`；四個 major heading 完整文字未改，只調整 phrase 邊界。

### S2：服務適配資訊去重

**Exact files：** `src/config/authority.ts`、`src/pages/services.astro`。

- 讓服務卡只回答「問題訊號／會留下什麼」；每項保留 2–3 個高訊號 fit 與 3 個 deliverables。
- 保留 `service.id` 作 anchor／data key，但移除由 raw slug 轉出的 visible English metadata；`01–03` 與中文 title 承擔辨識。
- 先全 repo 搜尋後才可移除未使用的 `notFit`；資料仍有消費者就保留。
- 不新增客戶、成果或服務承諾。

**Gate：** L1。**DoD：** 三種服務仍足以自我篩選，visible UI 無 raw slug；Desktop list `>=15px`，Mobile list `>=16px`，不以縮字抵銷去重效果。

### S2a：黃色紙張只用於既有服務摘要（pending user confirmation）

**Exact files：** `src/pages/services.astro`；只讀 `src/archive/work.astro` 回查已核准素材語法。

- 不新增第二排服務卡；只把三個既有 service option 的編號、中文標題與一句 outcome 做成黃色摘要面。
- fit／deliverables 維持白底詳細內容；不新增客戶、公司、成效、服務承諾或每卡 CTA。
- Desktop 維持三項垂直比較；Mobile 依 summary → fit → deliverables 單欄自然增高，不旋轉到造成裁切。
- 頁級 CTA、合作流程、合作邊界與聯絡區不在此切片調整。

**Gate：** L1＋user review。**DoD：** 黃色只代表「可採取的合作方向」，不被誤認為案例或商品牆；Desktop／390px 無 overflow，與 Services 既有資訊不重複。

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
| W0a | verified | 0 | L0 | 是，visual planning evidence only |
| W0b | verified | 0 | L0 | 是，cross-page owner evidence only |
| WA0 | awaiting_user_review | 5＋route archive | user review＋390px final gate | 是，技術、Desktop 與 mobile DOM 已完成；確認後補 final gate 並 checkpoint |
| W0c | archived | 0 | 不執行 | 是，Work 恢復前維持 deferred |
| W0d | verified | 1 | L1＋user-selected visual | 是，使用者已確認 production 畫面；此切片不解除 W0c |
| W1–W5 | archived | 1–2／slice | 不執行 | 是，僅保留歷史恢復規劃 |
| W6 | archived | 0 | 不執行 | 是 |
| C1 | verified | 2 production＋contract／evidence | L1＋user review | 是，技術與 1280px visual 已完成；等待本段畫面回饋 |
| C2 | verified | 1 production＋contract／evidence | L1＋user review | 是，黃色 recommendation surface 與三個 48px actions 已完成；等待本段畫面回饋 |
| C3 | pending | 1／slice | 否 | 只限同頁施工中 |
| C4 | pending | 0 | Courses L2 | 是 |
| S0 | verified | 0 | L0 | 是，planning evidence only |
| S1 | verified | 1 | L1 | 是，待使用者回饋後再進 S2 |
| S2／S2a／S3–S5 | pending | 1–2／slice | 否 | S2a 需先取得黃色摘要面方向確認；其餘只限同頁施工中 |
| S6 | pending | 0 | Services L2 | 是 |
| G1–G4 | pending | 0，修正回 owner | Cross-page L3 | G4 後完成 |

## 11. 優先序、停損與可選項

### Core

目前 Core 順序採 `Foundation → About → WA0 → Courses → Services → Cross-page`。Work 恢復需先有新的 page-role 決策，不得直接從 W0c 接續施工。

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

**Verdict：Needs Revision。**

- Repo reality：所有列出的 production files 與資料來源已存在。
- Phase sizing：每個 production slice 只動 1–2 個主要檔案與一種風險；browser evidence 與 heavy gate 分層執行。
- Contract：F1 指定正式 artifact，各 UI slice 有 narrow change record 與 acceptance evidence。
- Serial coordination：`global.css`、頁面 implementation、final gate 均明確序列化，不允許跨 slice 混改。
- Remaining blockers：P0 其餘整體規劃的逐段核准。Work W0c 與 W1–W6 已由 WA0 封存決策取代；未來若恢復 Work，必須先重新確認獨占任務、source-backed records 與跨頁 owner，再建立新的 execution slice。
