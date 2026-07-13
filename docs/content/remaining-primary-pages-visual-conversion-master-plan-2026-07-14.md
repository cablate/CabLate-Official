---
status: proposed
approval_status: pending_user_review
created: 2026-07-14
scope:
  - about
  - work
  - courses
  - services
canonical_parent: docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md
acceptance_standard: docs/design/page-reading-and-interaction-acceptance-standard.md
baseline_audit: docs/design/audits/2026-07-14-remaining-primary-pages-plan/README.md
---

# About、Work、Courses、Services 視覺與閱讀轉換 Master Plan

## 0. 決策狀態

這份文件是待使用者審閱的執行規格，不是已核准需求，也不是本輪已完成事項。使用者核准前，不修改 About、Work、Courses、Services 的程式或文案。

本計畫的目的，是把 Home 與 Expertise 兩輪實作真正學到的標準，逐項落到剩餘四個主要頁面。這次不能再以「有 class、有 href、有 44px hit area」代替完成；每一個重要行動、標題、流程與 Mobile 版面都要有可檢查的規格與 production 證據。

## 1. 產品意圖（GORE）

### 1.1 Product Intent

CabLate.com 是公開的信任與決策中樞。它要讓正在使用 AI、卻反覆重做或無法交付的人：

1. 認出自己遇到的問題；
2. 理解 CabLate 的判斷與交付方式；
3. 看到足以降低疑慮的真實證據；
4. 依當下成熟度，選擇作品、學習或合作。

四頁不是四份個人介紹，也不是四面產品牆：

- About 讓訪客判斷「這個人的經歷與做事方式是否值得信任」。
- Work 讓訪客判斷「這些方法是否真的被用來解決問題」。
- Courses 讓訪客判斷「我現在適合哪一種學習深度」。
- Services 讓訪客判斷「我的情境是否適合合作，以及如何提出」。

### 1.2 Actors 與 Jobs

| Actor | 進站時的 Job | 最怕發生的事 | 本輪應提供的結果 |
| --- | --- | --- | --- |
| 初次認識 CabLate 的個人使用者 | 快速判斷這個人是否真的懂 AI 實作與交付 | 讀到一堆自我形容、工具名與空泛主張 | 從 About 的歷程、原則與作品入口建立可信的第一印象 |
| 已嘗試 AI、成果仍反覆重做的人 | 找到與自己相似的問題與可行的下一步 | 被直接推商品，卻還不知道問題在哪 | 在 Work／Courses 看懂證據與選擇方式；不確定時回到 Expertise |
| 技術或產品決策者 | 驗證能力、限制與交付思路 | 只看到漂亮作品圖，沒有問題、判斷與揭露範圍 | 在 Work 快速掃讀公開案例，再決定是否前往 Services |
| 想學習的個人或團隊 | 選擇不過量、也不買錯的學習方案 | 把路線誤認為必修漏斗，或被註冊按鈕帶離判斷 | 在 Courses 依問題與投入深度選一條路；未開放狀態真實 |
| 有合作需求的企業／團隊 | 自行判斷適配程度，降低第一次聯絡成本 | 看不懂交付、流程與邊界，或不知道信中要提供什麼 | 在 Services 完成自我篩選，使用真實 Email 提交情境 |
| 高意圖回訪者 | 不重讀全頁，直接找到作品、商品或聯絡 | 關鍵入口藏在紫色小字 | 首屏或相關證據後都有清楚但不搶戲的捷徑 |

### 1.3 Goal hierarchy

#### Primary goals

- **G0：四頁各自完成一個清楚的訪客決策。** 五秒內能辨識頁面用途，讀完能找到符合意圖的下一步。
- **G1 About／信任：** 讓人物歷程、公開證據與工作原則共同支持信任，再把高意圖訪客送往 Work。
- **G2 Work／證據：** 讓案例的問題、限制、判斷、結果與揭露範圍可掃讀，再把有相似情境者送往 Services。
- **G3 Courses／選擇：** 讓訪客知道路線是依投入與深度排列、不是必修順序，並能清楚啟動目前可用的路線。
- **G4 Services／適配：** 讓訪客先判斷合作類型、理解交付與邊界，再用 `cablate@cablate.com` 提交情境。

#### Supporting goals

- **S1 CTA 可辨識：** 所有重要 CTA 都有明確邊界、箭頭或 action row，不再退回 21–23px 紫色小字。
- **S2 順序可信：** Timeline、case index、learning route、service process 的語意、DOM 與視覺順序一致。
- **S3 響應式可讀：** 320、360、390、1280、1440px 皆保有紙張安全內距、人工句組、零水平溢位與清楚 CTA。
- **S4 證據就位：** 證據放在疑慮發生的位置，不縮成角落註記，也不重複塞進每頁。
- **S5 真實與可維護：** 不新增無來源的成果；價格、商品名、URL、日期、合作限制與 Email 維持真實來源。
- **S6 可回復：** 不確定、走錯或不想照完整敘事閱讀的人，能回到診斷或直接前往合理目的地。

#### Soft goals

- 紙張、紫色識別、字體與留白維持 CabLate 的同一品牌感。
- 四頁以自己的資訊語法建立辨識，不靠隨機裝飾製造差異。
- Mobile 長度以內容分工與密度控制改善，不用縮字、固定高度或裁切。
- 文案自然、白話、可朗讀；專有名詞只在能支撐當下主張時出現。
- 動效若存在，只輔助狀態與閱讀方向，並尊重 reduced motion。

### 1.4 Domain invariants

1. Home 與 Expertise 是完成標準與回歸對象，不因抽共用 CSS 產生視覺退步。
2. About、Work、Courses、Services 必須保留各自的頁面任務與視覺語法，不能套成同一種紙卡列表。
3. Articles 可直接造訪，但此輪不恢復任何站內 Article CTA 或主導覽入口。
4. Article detail、Course detail、搜尋與 Starter Pack 不在範圍。
5. CabAI 在 About 是能力證據，在 Work 承接可公開檢查的商品／內容，在 Courses 承接試看、購買與帳號交付，在 Services 不干擾企業合作判斷。
6. 公開聯絡信箱以 `src/config/siteConfig.ts` 的 `cablate@cablate.com` 為唯一來源。
7. CabAI 外連沿用 `withCabAiAttribution()` 與既有 campaign，不硬編另一組 URL。
8. AgentSkill、Agent 深度工程手冊、價格、免費試看、GitHub 數字與日期不得自行改寫或推測。
9. 不新增客戶名稱、見證、成果數字、個人故事或尚未證實的能力。
10. `.paper-card` 負責紙張表面；內容安全區不能靠 `overflow: hidden`、固定高度或縮字掩蓋跑版。
11. Rail、Mobile Headbar 與 Footer 維持同一全站系統；頁內 anchor 必須考慮 sticky Headbar。
12. 每一頁完成後建立 checkpoint，不 push；下一頁只能從已驗證狀態開始。

### 1.5 Non-goals

- 不重新設計品牌、色票、字體、Rail、Footer 或全站導覽資訊架構。
- 不為四頁生成大量裝飾圖，也不以 ImageGen 取代可維護的 HTML／CSS 資訊設計。
- 不把 About 變成履歷、Work 變成圖庫、Courses 變成商品牆、Services 變成超長銷售頁。
- 不為縮短頁面刪掉能改變決策的證據。
- 不在未核准前實作文案待確認項。
- 不以 build 通過、元素存在或截圖無溢位單獨宣告完成。

### 1.6 Goal conflicts 與處理原則

| 衝突 | 錯誤解法 | 本計畫的取捨 |
| --- | --- | --- |
| CTA 顯眼 vs. 頁面低壓力 | 所有連結都做深色大按鈕 | 依 Primary／Secondary／Contextual／Recovery／Navigation 分級；重要行動有邊界，只有頁級決策使用 filled |
| Mobile 簡潔 vs. 證據完整 | 刪掉時間軸、合作邊界或案例限制 | 先刪重述、壓縮低價值清單、拆解長卡；保留能支撐信任的證據 |
| 全站一致 vs. 頁面辨識 | 共用同一個卡片、網格和流程版型 | 只共用 CTA states、紙張 token、focus 與安全內距；資訊結構留在頁面 CSS |
| 路線清楚 vs. 不誤導必修 | 用強連續箭頭把四條路綁成漏斗 | 明寫排列原則、每條可獨立進入，提供「不確定先診斷」回復路徑 |
| 能力證據 vs. 產品硬推 | About 一看到 CabAI 就推商品 | About 只說交付能力，商品試看與購買留在 Courses／Work 的相關脈絡 |
| 真實簡潔 vs. 看起來有說服力 | 編造數字、客戶 Logo 或保證成果 | 只使用現有公開證據、日期、實際交付範圍與揭露限制 |

### 1.7 Goal-to-plan traceability

| Goal | 對應設計／實作 | 主要證據 |
| --- | --- | --- |
| G1 | About Hero CTA、時間軸、能力證據、頁尾 Work 決策 | About full-page、Hero、timeline、兩個 Work CTA screenshots |
| G2 | Work case file 結構、獨立 action row、頁尾 Services CTA | Work full-page、featured case、case focus、Services CTA screenshots |
| G3 | Courses 非必修排序說明、三個 48px route CTA、診斷 recovery | Courses full-page、map Desktop／Mobile、route CTA states screenshots |
| G4 | Services 精簡服務比較、合作經驗 heading、四步流程、Email／Threads 層級 | Services full-page、service options、process、contact screenshots |
| S1 | 共用 `.btn` 與 paper action states；逐頁 CTA inventory | 尺寸量測、hover／active／focus-visible、forced-colors evidence |
| S2 | 每個 sequence 的語意／DOM／Desktop／Mobile 契約 | DOM order dump、鍵盤順序與各 viewport screenshots |
| S3 | 人工 phrase grouping、五種 viewport、anchor offset | 320／360／390／1280／1440 captures、scrollWidth facts |
| S4 | 區塊閱讀任務與證據鄰接 | full-page narrative review |
| S5 | config 作為真實來源、內容保護清單 | diff review、link inspection、`validate:content` |
| S6 | About／Work 高意圖捷徑、Courses diagnosis、Services 明確聯絡 | CTA destination 與 Enter／anchor evidence |

## 2. 依據與現況事實

### 2.1 Canonical sources

- `docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md`
- `docs/design/page-reading-and-interaction-acceptance-standard.md`
- `docs/contracts/site-visual-language-rollout-2026-07-12.md`
- `docs/contracts/full-site-visual-system-2026-07-11.md`
- `docs/design/audits/2026-07-14-remaining-primary-pages-plan/README.md`
- `docs/design/audits/2026-07-14-remaining-primary-pages-plan/runtime-facts.json`

### 2.2 Home 與 Expertise 留下的完成標準

Home 與 Expertise 不是四頁的版型來源，而是驗收標準：

1. **先安排讀者感受，再安排素材。** 每區要有讀前想法、區塊任務、情緒變化與下一步。
2. **重要行動不能藏在小字。** 可點、可聚焦不代表掃讀時看得出來；關鍵 CTA 要有清楚邊界與至少 44–48px 高度。
3. **流程必須真的看得出順序。** 名詞放在 DOM 裡還不夠；需要編號、箭頭／導引線、中文說明與 Desktop／Mobile 轉譯。
4. **語意順序不能靠視覺猜。** Expertise 已確認方法順序是 `Context → Skill → Harness`；後續頁面同樣要先定義語意，再畫版面。
5. **Recovery 也是正式 CTA。** 「仍不確定」不能縮成角落小字；Courses 的診斷入口、Services 的次要聯絡都同理。
6. **標題要看真實渲染。** 使用人工 phrase grouping；320、360、390px 與 Desktop 分別確認，不相信瀏覽器任意換行。
7. **紙張先守安全內距。** 內容不能超出紙面，也不能靠內層不透明白卡遮住材質。
8. **Evidence 要在視覺上有份量。** 強證據不能藏成最小註記；也不能用無關數字製造權威感。
9. **Anchor 要避開 Headbar。** 每個頁內跳轉實測跳轉後位置，而不是只設定 `scroll-margin` 就算完成。
10. **說的、做的、文件記錄要同一套。** 每頁依 Master Plan 實作、重新截圖、人工開圖驗收，再建立 checkpoint。

## 3. 共用互動與響應式契約

### 3.1 CTA taxonomy

全站只抽共用互動底層，不抽四頁版型。`src/styles/global.css` 可整理 `.btn`、filled 與 bordered paper states；頁面位置、寬度、對齊與敘事節奏保留在各頁 scoped CSS。

| Role | 外觀 | Desktop | Mobile | 禁止退回形式 |
| --- | --- | --- | --- | --- |
| Primary | filled button | min 52px 高，文字與箭頭清楚，單一決策區只保留一個 | min 48px；頁尾決策通常 full width | 23px text link、只有紫色、無 hover／focus |
| Secondary | bordered paper button | min 48px，紙面背景＋1px 邊界，權重低於 filled | min 48px；必要時 full width | 與 Primary 同時做兩個深色按鈕，或縮成角落小字 |
| Contextual | compact bordered paper／action row | min 48px，緊鄰剛建立的動機或證據 | min 48px；不因 viewport 退回 21px | 僅在卡片內文末尾放紫色字＋箭頭 |
| Recovery | bordered paper button | min 48px，文字直接說明回到哪裡 | min 48px，通常 full width | 「仍不確定？」等低對比補充連結 |
| Navigation | text link／nav row | 可維持文字，但有非僅顏色的可點提示；獨立項 min 44px | min 44px | 冒充頁面 Primary，或和正文無法區分 |

所有 CTA 必須：

- 使用原生 `<a>` 與真實 `href`；不以 `div` 模擬。
- `hover` 改變背景／邊界／文字之一，不能只做難察覺的顏色漂移。
- `active` 只允許 1px 位移，不改變布局。
- `focus-visible` 使用至少 2px 高對比 outline、約 3px offset，不被紙張或 overflow 裁掉。
- `prefers-reduced-motion: reduce` 時移除非必要 transition／transform。
- `forced-colors: active` 時保留實體 border 與可見 focus，不依賴背景圖或陰影。
- 外站沿用 `target="_blank" rel="noopener"`；站內路由不另開分頁。
- 箭頭是輔助線索，使用 Lucide icon 並 `aria-hidden="true"`，accessible name 由完整文字提供。

### 3.2 標題與正文

- H1／主要 H2 先拆成作者選定的 `.heading-phrase`；phrase 內不換行，phrase 之間才可 reflow。
- `text-wrap: balance`／`pretty` 只作輔助，不取代人工檢查。
- 不孤立 `AI`、`Agent`、`CabAI`、`AgentSkill`、`Claude Code`、`Google Maps`、產品名、數字與標點。
- 排版不成立時，優先調整句組、欄寬或文字，不先縮小大標到失去層級。
- Desktop 與 Mobile 可以使用不同 phrase grouping，但 DOM 文字與螢幕閱讀順序必須相同。

### 3.3 紙張與 layout safety

- `paper-card` 只負責表面；每個頁面 section 保留明確安全內距。
- 任何文案長度變動都不得露出父容器、超出紙張或被 fixed height 截斷。
- Mobile 不新增內層不透明白卡；背景圖、clip 與 pseudo-element 不可遮住文字或 focus ring。
- 迴紋針與標籤必須表示內容角色，例如時間軸、featured file 或流程備註；不隨機增加。

### 3.4 Production gate viewport

每頁至少驗證：

| Viewport | 必查項 |
| --- | --- |
| 1440 × 900 | 全頁節奏、Rail 後剩餘欄寬、CTA 層級、專屬視覺語法 |
| 1280 × 720 | 一般筆電壓縮、欄位安全內距、大標句組 |
| 390 × 844 | 主流 Mobile、Headbar、主要 CTA、完整長頁 |
| 360 × 800 | 窄 Mobile 標題、按鈕文字、紙張邊緣 |
| 320 × 568 | 最窄支援、零水平溢位、focus 不裁切 |

每次截圖後都要實際開圖，排除空白、載入中、錯頁、裁切錯誤與 Dev Toolbar。只保存本輪 production runtime 新證據。

## 4. About：人物故事與時間軸

### 4.1 唯一訪客任務

訪客進站時想：「這個人是誰？為什麼他的判斷值得我相信？」讀完後應能回答：「他的經歷、公開作品與工作原則彼此一致，我願意去看代表作品。」

頁級 Primary destination：`/work/`。

### 4.2 情緒與決策旅程

```text
陌生／觀望
→ 快速知道 CabLate 現在在做什麼
→ 理解為什麼他如此重視交付與可接手
→ 看到經歷如何形成方法
→ 用公開作品與 CabAI 交付系統驗證能力
→ 知道合作前他會守住哪些原則
→ 前往 Work 檢查實作證據
```

### 4.3 區塊目的

| 區塊 | 讀前想法 | 唯一任務 | 證據／內容 | 讀後感受 | 行動 |
| --- | --- | --- | --- | --- | --- |
| Hero | 我只知道名字，不知道他能處理什麼 | 建立身份、工作範圍與問題對象 | 全端／系統設計背景、AI 教學／產品／流程、交付觀點 | 「這和我遇到的重做／交接問題有關」 | 高意圖者用 bordered paper CTA 前往 Work |
| 專業歷程 | 這些主張是後來包裝的嗎 | 說明交付觀點如何從實務問題形成 | 資料、權限、驗收、復原的經驗 | 主張有原因，不是口號 | 無 CTA，保持閱讀推進 |
| 關鍵轉折 | 經歷跟現在的工作有什麼關係 | 以四個轉折呈現能力形成，不堆履歷 | 非本科轉職、工程實務、AI 應用、全職 CabLate | 看見累積與方向一致 | 可跳過歷程者沿用 Hero Work 捷徑 |
| 公開作品／CabAI | 有沒有可以查證的東西 | 用公開程式碼、數字與交付平台支撐能力 | 三個開源作品；CabAI 的試看、販售、交付能力 | 信任由主張提升為可查證 | GitHub rows；CabAI contextual action row |
| 工作原則 | 真正一起做事時會怎麼判斷 | 呈現四個穩定工作原則 | 經驗／研究區分、可用版本、問題先於工具、留下方法 | 知道 CabLate 如何做決定 | 無產品 CTA |
| 下一步 | 我相信這套方法，但想看實作 | 將信任轉成證據檢查 | 代表作品入口 | 不需先合作也能驗證 | filled Work Primary；其餘為 utility navigation |

### 4.4 Desktop／Mobile 規格

Desktop：

- Hero 保留 headline／aside 雙欄，Work CTA 位於 referral 之後，不能藏在段尾。
- 時間軸使用 `01–04` 節點、垂直導引線、時間與內容三欄；不新增裝飾卡片。
- 公開作品維持可掃讀 row；CabAI 是獨立 capability proof row，視覺低於開源證據主標、但高於普通補充連結。
- 頁尾左右欄維持，Work filled CTA 是唯一頁級 Primary。

Mobile：

- Hero 先身份、再問題、再 48px full-width Work CTA。
- 時間軸轉為單一垂直 rail；節點、時間、標題、正文依 DOM 順序排列。
- 公開作品每列可自然增高，不固定高度；數字與日期不擠在右側。
- CabAI action row 與頁尾 Work CTA 皆至少 48px；不退回 22px 小字。
- 以刪除重述降低 5501px 高度；不刪時間軸、公開證據或工作原則。

### 4.5 Major heading phrase grouping

| Heading | 建議句組 |
| --- | --- |
| H1 | `從工程實作`／`走到 AI 應用，`／`我一直在意成果`／`能不能被接手。` |
| 專業歷程 H2 | `我在意交付，`／`因為做出來`／`不等於能使用。` |
| 時間軸 H2 | `四個轉折，`／`慢慢形成`／`現在這套工作方式。` |
| 公開作品 H2 | `每件作品都附上`／`公開程式碼、使用方式`／`或可查證的數字。` |
| 原則 H2 | `遇到不同工具與問題，`／`我仍會守住四件事。` |
| 下一步 H2 | `想看這些原則`／`怎麼用在實作上，`／`先看代表作品。` |

句組是可換行邊界，不代表 Desktop 必須每個 phrase 各佔一行。320／360／390px 必須逐一人工確認。

### 4.6 CTA inventory

| 可見文字 | Destination | Role／外觀 | Desktop | Mobile | 不可退回 |
| --- | --- | --- | --- | --- | --- |
| 先看代表作品 | `/work/` | Contextual／bordered paper | aside 內 inline，min 48px | full width，min 48px | 105 × 23px `text-link` |
| 三個公開作品 row | 現有 GitHub URL | Evidence navigation／row link | 整列可點、min 44px，hover＋focus 清楚 | 自然高度，名稱與證據同一 accessible name | 只在標題換色、focus 不明顯 |
| 查看 CabAI 學習平台 | `withCabAiAttribution(siteConfig.cabAi.homeUrl, 'about_platform')` | Contextual／bordered action row | min 48px，低於 Work Primary | full width，min 48px | 145 × 22px 小字；改推商品 |
| 查看代表作品 | `/work/` | Primary／filled | 右欄 min 52px | full width，min 48px | 降為普通文字列 |
| 專業方法／GitHub／Threads／Email | 現有 route／config | Navigation／utility rows | 每項 min 44px，不與 Primary 同權重 | 可換成兩欄或垂直，但不擠壓 | 做成第二組 Primary |

### 4.7 Timeline sequence contract

- **語意順序：** 非本科轉職 → 工程實務 → 2024 AI 應用 → 2025-06 至今全職 CabLate；是時間與能力形成順序。
- **DOM 順序：** `<ol>` 依上述順序，節點文字 `01–04` 不使用 CSS `order` 改寫。
- **Desktop：** 垂直 rail；節點、時間、內容三欄；最後一項可收尾但不斷線到紙外。
- **Mobile：** rail 位於左側；每項依節點 → time → title → body；不能把四項做橫向縮圖。
- **辨識元素：** `01–04`、time、連續導引線；不加沒有用途的箭頭。
- **Recovery／skip：** 不想讀完整歷程者可在 Hero 直接前往 Work；讀完則由頁尾 Primary 前往 Work。

### 4.8 文案待確認清單

- Hero 第二段、referral、專業歷程 opening 都在說「可使用／可檢查／可接手」；實作時要各留一個角色，刪除同義重述。
- 時間軸前言只說明「為什麼看這四段」，不再重講交付信念。
- CabAI 維持能力證據，禁止改成商品銷售段落。
- 所有日期、開源數字與作品描述維持現有事實來源。

### 4.9 About outcome-based DoD

- 初次訪客五秒內知道 CabLate 的背景、現在做什麼、在意何種問題。
- Hero Work CTA 與 CabAI action row 在 Desktop／Mobile 都一眼可辨識且至少 48px。
- 時間軸不讀內文也能看懂是四段時間順序。
- 320／360／390／1280／1440px 標題句組自然、零水平溢位。
- 鍵盤可依 DOM 順序操作所有 links；focus 不被紙張裁掉。
- 新 production 截圖與 runtime facts 人工驗收後建立 About checkpoint。

## 5. Work：案例檔案

### 5.1 唯一訪客任務

訪客進站時想：「你實際做過什麼？遇到限制時怎麼判斷？」讀完後應能回答：「這些案例有問題、判斷、證據與揭露邊界；若我的情境相似，可以去看合作方式。」

頁級 Primary destination：`/services/`；首屏同時保留 `#selected-work` 作為頁內導覽。

### 5.2 情緒與決策旅程

```text
懷疑／查證
→ 先知道案例要看結果也要看限制
→ 從 featured file 看完整問題與判斷
→ 快速掃過其他公開檔案
→ 理解有些合作只能有限揭露
→ 在誠信邊界下仍建立信任
→ 前往 Services 判斷相似情境
```

### 5.3 區塊目的

| 區塊 | 讀前想法 | 唯一任務 | 證據／內容 | 讀後感受 | 行動 |
| --- | --- | --- | --- | --- | --- |
| Hero | 我要先看作品，不想讀自介 | 建立案例閱讀規則與兩條捷徑 | 結果、限制、判斷、公開紀錄 | 知道這頁不是作品圖庫 | Primary anchor 到檔案；Secondary 到 Services |
| Featured file | 有沒有足夠完整的代表案例 | 用一件作品示範完整案例結構 | Agent 深度工程手冊的問題、判斷、公開試看 | 看見方法如何落地 | contextual CabAI handbook CTA |
| 公開案例索引 | 還有哪些不同型態證據 | 以穩定摘要快速比較三件案例 | 問題、關鍵判斷、公開證據 | 能選自己想查的檔案 | 每件獨立 48px action row |
| 有限揭露合作 | 企業合作是不是全都無法驗證 | 說明做過的範圍與不能公開的原因 | 企業 AI 導入／內訓、MCP 合作測試的揭露範圍 | 誠實邊界提高信任 | 區塊後明確 Services Primary |

### 5.4 Desktop／Mobile 規格

Desktop：

- Hero 保留 index／main／record note 三欄語法；兩個 CTA 都是可辨識控制，只有 `#selected-work` filled。
- Featured case 保留更完整的 file sheet；手冊 CTA 是 48px bordered paper action。
- 次要案例以 `<article>` 呈現，不再讓整張 1088px 長 row 成為唯一 anchor；內容與 action row 分開。
- 頁尾 Services CTA 位於有限揭露紀錄之後，形成頁級決策高點。

Mobile：

- Hero index 先說明檔案類型，主要標題與 CTA 後再顯示 record note；不將三欄硬縮。
- Featured handbook CTA 維持至少 48px，不得從 Desktop 53px 退回 21px。
- 每個次要案例只保留「問題、判斷、公開證據」三項，action row 獨立，整卡不再是 anchor。
- 三張次要案例自然堆疊但降低重複間距與文字量；禁止 fixed height。
- 頁尾 Services CTA full width、至少 48px。

### 5.5 Major heading phrase grouping

| Heading | 建議句組 |
| --- | --- |
| H1 | `作品先看結果，`／`也要看限制下`／`做了哪些選擇。` |
| 公開檔案 H2 | `每個檔案，`／`都從一個具體問題開始。` |
| 有限揭露 H2 | `把做過的範圍`／`與不能公開的部分`／`放在一起說清楚。` |

產品名與 repository 名稱視為不可拆詞；`Agent 深度工程手冊`、`mcp-google-map`、`banini-tracker` 不可被任意拆成孤立字串。

### 5.6 CTA inventory

| 可見文字 | Destination | Role／外觀 | Desktop | Mobile | 不可退回 |
| --- | --- | --- | --- | --- | --- |
| 先看公開檔案 | `#selected-work` | Primary navigation／filled | min 52px | min 48px，可 full width | 只保留文字或 anchor 被 Headbar 遮住 |
| 查看合作方式 | `/services/` | Secondary／bordered paper | min 48px | min 48px | 77 × 22px 小字 |
| 查看試看與完整章節 | `withCabAiAttribution(siteConfig.cabAi.handbookUrl, 'work_handbook')` | Contextual／bordered paper | min 48px | min 48px，不能縮小 | 134 × 21px Mobile text link |
| 查看檔案（mcp-google-map） | 現有 GitHub URL | Evidence navigation／action row | row 末端 min 48px | card 後 full-width／min 48px | 417px 整卡唯一 anchor |
| 查看檔案（金流教學） | `/courses/` | Evidence navigation／action row | row 末端 min 48px | card 後 full-width／min 48px | 417px 整卡唯一 anchor |
| 查看檔案（banini-tracker） | 現有 GitHub URL | Evidence navigation／action row | row 末端 min 48px | card 後 full-width／min 48px | 417px 整卡唯一 anchor |
| 查看合作方式 | `/services/` | Page Primary／filled | 區塊後 min 52px | full width，min 48px | 226 × 23px `text-link` |

### 5.7 Case order contract

- **語意順序：** `01` 是 featured reference；`02–04` 依可公開程度與證據類型編輯排序，不是時間軸或必做步驟。
- **DOM 順序：** Hero index 與正文案例順序一致；每件 `<article>` 內依 title → problem → decision → evidence → action。
- **Desktop：** featured file 有較高密度；其餘三件使用一致的 case row，action 位於末端。
- **Mobile：** 每件獨立堆疊；編號仍存在，但不以連續箭頭暗示流程。
- **辨識元素：** file number、type、`PUBLIC RECORD`、證據日期、明確 action row。
- **Recovery：** 不想逐案閱讀者可在 Hero 直接前往 Services；讀完有限揭露紀錄後由頁尾 Services Primary 收束。

### 5.8 文案待確認清單

- 次要案例將重複的敘事句壓縮為問題、判斷、證據三欄；不刪公開數字與日期。
- 不新增成果敘述，不把 GitHub stars／forks 寫成商業成效。
- 有限揭露合作只說可公開的角色、範圍與限制，不補客戶名或內部結果。
- 頁尾 CTA 要直接說「查看合作方式」，不使用繞口的條件句代替按鈕名稱。

### 5.9 Work outcome-based DoD

- 不看全部內文也能分辨 featured、public records 與 limited disclosure。
- Mobile handbook CTA 與每件 case action row 均至少 48px，整張長卡不再承擔唯一連結。
- `#selected-work` 跳轉後標題不被 Headbar 遮住。
- 頁尾 Services CTA 成為讀完證據後清楚的唯一 Primary。
- 案例順序不被誤解為步驟；鍵盤焦點名稱不再包含整張長卡全文。
- 五種 viewport 與新 production evidence 驗收後建立 Work checkpoint。

## 6. Courses：學習地圖

### 6.1 唯一訪客任務

訪客進站時想：「我該從哪裡學？需要免費診斷、短時間建立全貌、課程，還是深入手冊？」讀完後應能選一條符合當下問題與投入深度的路，不必照順序完成所有內容。

頁級 Primary decision surface：`#learning-map`。具體 destination 由訪客選中的 route 決定；不把 CabAI 帳號當成抽象的唯一 Primary。

### 6.2 情緒與決策旅程

```text
選擇焦慮／怕買錯
→ 知道不需要一次學完
→ 理解路線依投入與深度排列、不是必修
→ 對照自己的卡點與想帶走的結果
→ 選擇免費診斷、等待講座、AgentSkill 或工程手冊
→ 需要試看／購買／保留內容時再進入 CabAI
```

### 6.3 區塊目的

| 區塊 | 讀前想法 | 唯一任務 | 證據／內容 | 讀後感受 | 行動 |
| --- | --- | --- | --- | --- | --- |
| Hero | 選項很多，我怕一開始就選錯 | 降低一次學完的壓力，導向選擇面 | 「先跨過現在最卡的一步」 | 願意開始比較 | filled anchor 到 learning map |
| Map header | 這四個編號是不是必修順序 | 說明排序規則與 recovery | 依承諾／學習深度排列；不確定先診斷 | 知道可直接選其中一條 | 不另加重複 CTA |
| 01 免費診斷 | 我還不知道真正卡點 | 提供最低成本的重新判斷 | 問題診斷、免費 | 安心，不必先買 | Recovery／bordered paper CTA |
| 02 講座與工作坊 | 我想短時間建立共同語言 | 保留真實產品類型與目前狀態 | 主題、示範、小型練習；尚未開放 | 知道未來有這條路，但不被假連結欺騙 | status，不是按鈕 |
| 03 AgentSkill | AI 每次都要重新交代 | 呈現建立可重複協作能力的課程 | 現有 outcome、價格、免費試看 | 看懂課程解決哪個問題 | Contextual／bordered paper CTA |
| 04 工程手冊 | 已在用 Claude Code，流程仍不穩 | 呈現較深、可反覆查閱的內容 | 現有 outcome、價格、免費試看 | 知道手冊適合更深的診斷需求 | Contextual／bordered paper CTA |
| CabAI onboarding | 點進商品後內容會放哪裡 | 說明試看、購買與已購內容交付 | 同一 CabAI 帳號 | 對外站用途有預期 | Secondary account CTA，低於具體路線 |

### 6.4 Desktop／Mobile 規格

Desktop：

- Hero 保留單一 filled anchor；Map header 不重複 Hero 的「卡在哪」敘述，而是解釋選擇規則。
- 四條路線依投入／學習深度排列，可保留編號，但每張是獨立入口。
- 導引線若保留，使用低權重虛線／分段 rail，不用連續大箭頭暗示必修漏斗。
- 每條可用 route 的 CTA 都是 48px bordered paper；未開放 route 只顯示 status chip／文字。
- CabAI account CTA 改為 secondary paper，不壓過 AgentSkill／手冊的具體路線。

Mobile：

- 四條 route 垂直堆疊；先讀 situation，再讀 title／outcome／price／status／action。
- 每個可用 action full width、至少 48px；不因版面變窄退回 23px text link。
- 清楚顯示「不必照順序」與「不確定先診斷」，不讓編號單獨傳達錯誤關係。
- CabAI account CTA full width 48px，但使用 secondary bordered style。
- 商品名、價格與「免費試看」保持同一 route 內的視覺關聯。

### 6.5 Major heading phrase grouping

| Heading | 建議句組 |
| --- | --- |
| H1 | `不用一次學完全部，`／`先跨過你現在`／`最卡的那一步。` |
| Map H2 | `你現在卡在哪一層？`（單一完整問句，必要時只在語意邊界換行） |
| CabAI H2 | `試看與購買內容，`／`都留在 CabAI 帳號裡。` |

Route H3 要逐一檢查 320px；`AI`、`Claude Code`、`AgentSkill` 不孤立，不為避免換行而縮小字級。

### 6.6 CTA inventory

| 可見文字 | Destination | Role／外觀 | Desktop | Mobile | 不可退回 |
| --- | --- | --- | --- | --- | --- |
| 看看我該從哪裡開始 | `#learning-map` | Primary navigation／filled | min 52px | min 48px，可 full width | anchor 被 Headbar 遮住 |
| 先做問題診斷 | `/expertise/` | Recovery／bordered paper | min 48px | full width，min 48px | 104 × 23px text link |
| 尚未開放 | 無 href | Status／非互動 | 明確 disabled-like status，但不使用 `<button>` | 同 Desktop | 製造假連結或可點游標 |
| 查看課程與免費試看 | `withCabAiAttribution(siteConfig.cabAi.agentSkillUrl, 'courses_agentskill')` | Contextual／bordered paper | min 48px | full width，min 48px | 144 × 23px text link |
| 查看手冊與免費試看 | `withCabAiAttribution(siteConfig.cabAi.handbookUrl, 'courses_handbook')` | Contextual／bordered paper | min 48px | full width，min 48px | 144 × 23px text link |
| 建立 CabAI 免費帳號 | `withCabAiAttribution(siteConfig.cabAi.accountUrl, 'courses_account')` | Secondary／bordered paper | min 48px，視覺低於 route CTA | full width，min 48px | 比商品路線更搶眼的唯一深色按鈕 |

### 6.7 Learning route contract

- **語意順序：** 依所需承諾與學習深度排列：免費判斷方向 → 短時間建立共同語言 → 建立可操作能力 → 深入查閱與診斷。不是必修順序。
- **DOM 順序：** 與上述一致；不得用 CSS `order` 在 Mobile 改變。
- **Desktop：** 四條獨立 route；編號、stage、situation、title、outcome、price／status、action 層級固定。
- **Mobile：** 單欄；每條 route 自成一個可掃讀單位，不使用橫向 carousel。
- **辨識元素：** `01–04`、stage label、可用／尚未開放狀態、明確 action；導引線不能暗示強制流向。
- **Recovery：** 「還不確定問題在哪」固定回 `/expertise/`；不能把 CabAI 註冊當 recovery。

### 6.8 文案待確認清單

- Map header 補上等價於「依投入與深度排列，不必照順序；不確定先診斷」的白話說明。
- Hero 負責降低壓力，Map header 負責解釋選擇規則；兩者不再重講「卡在哪」。
- 所有 route 的 title、outcome、price、CTA、URL 與免費試看承諾受保護。
- 「講座與工作坊」完整保留；沒有開放時只更新狀態，未來可直接補真實活動入口。

### 6.9 Courses outcome-based DoD

- 訪客不讀細節也知道四條路不是必修順序。
- 三個可用 route CTA 在 Desktop／Mobile 均至少 48px 且一眼可辨識。
- 未開放講座沒有 href、按鈕語意或假 hover。
- CabAI 帳號用途清楚，但不壓過具體 route。
- `#learning-map` 在三種 Mobile 寬度都不被 Headbar 遮住。
- 產品名、價格、免費試看與 URL 未被誤改；完成五 viewport 與新證據後建立 Courses checkpoint。

## 7. Services：合作簡報

### 7.1 唯一訪客任務

訪客進站時想：「我的情況適合合作嗎？會留下什麼？要怎麼開始？」讀完後應能自行排除不適合情境，選出最接近的合作類型，並用真實 Email 提交足以判斷的工作情境。

頁級 Primary destination：`mailto:cablate@cablate.com?subject=合作情境：`。

### 7.2 情緒與決策旅程

```text
有需求但不確定怎麼說
→ 先辨識三種合作情境
→ 知道各自會留下哪些成果
→ 用實際交付經驗降低風險
→ 理解合作如何從診斷走到驗收
→ 接受責任與限制
→ 用 Email 提交現況；不方便寄信時改用 Threads
```

### 7.3 區塊目的

| 區塊 | 讀前想法 | 唯一任務 | 證據／內容 | 讀後感受 | 行動 |
| --- | --- | --- | --- | --- | --- |
| Hero | 我知道有問題，但不知道算哪種合作 | 對應反覆重做情境並導向自我篩選 | 流程、訓練、系統三種可能方向 | 不用先寫需求書也能開始 | filled anchor 到 service options |
| Service options | 哪個最像我的情況 | 比較適合情境與交付，不堆所有欄位 | 三種 serviceTracks，各 2–3 個 fit、3 個 deliverables | 能選最接近的一種 | 不在每卡放競爭 CTA；最後統一聯絡 |
| 合作經驗 | 你真的交付過嗎 | 用一段有語意 heading 的 trust strip 支撐能力 | 企業內訓、系列工作坊、線上實作課；揭露限制 | 對交付經驗更安心 | 無 CTA，不硬塞作品方法 |
| 合作流程 | 合作之後會怎麼進行 | 說清楚四個可驗收階段 | 診斷 → 設計 → 執行 → 驗收 | 不再覺得合作是黑箱 | 無中途 CTA |
| 合作邊界 | 有哪些不能假設或保證 | 定義責任、資料、驗收與維護邊界 | 現有四條邊界，移除與 service fit 重複文字 | 信任來自範圍清楚 | 無 CTA |
| 提交情境 | 我應該提供什麼 | 降低第一次聯絡成本 | 目標、使用者、現況、卡點、成功條件 | 準備好聯絡 | Email filled Primary；Threads bordered Secondary |

### 7.4 Desktop／Mobile 規格

Desktop：

- Hero 保留清楚的服務 brief 與單一 filled anchor。
- 三種服務維持同頁比較，但每項只保留最能判斷的 2–3 個 fit 與 3 個 deliverables；標題、outcome 與清單分欄。
- 合作經驗使用真正 H2／H3，形成 trust strip，不再只有 `aria-label`。
- 四步流程維持 `01–04`、水平導引線與可見方向；第三步名稱改為自然的「執行」。
- 頁尾 Email 是 filled Primary；Threads 是 bordered paper Secondary。

Mobile：

- 三種服務單欄閱讀，順序為 title／outcome → fit → deliverables；縮短重複清單但保留判斷所需內容。
- 流程由水平四欄轉成垂直 rail；不能縮成四個小格。
- 合作經驗有 heading、主張與揭露說明，保留清楚層級。
- Email 與 Threads 皆 full width、至少 48px；只有 Email filled。
- 目標是明顯低於目前 5713px 的重複負擔，但不以任意高度 KPI 取代內容完整。

### 7.5 Major heading phrase grouping

| Heading | 建議句組 |
| --- | --- |
| H1 | `把反覆重做的工作，`／`整理成能檢查、`／`也能交接的流程。` |
| Service options H2 | `先找出最接近的狀況，`／`再看適合哪種合作。` |
| Process H2 | `先把問題釐清，`／`再決定怎麼做。` |
| Boundaries H2 | `合作前，`／`先把責任與限制說清楚。` |
| Contact H2 | `不用先寫需求書，`／`把目前怎麼做、卡在哪裡`／`告訴我就好。` |

目前 H1 使用六個過短 phrase，會造成碎裂節奏；實作時改為三個完整語意句組，但不改變原句文字。

### 7.6 CTA inventory

| 可見文字 | Destination | Role／外觀 | Desktop | Mobile | 不可退回 |
| --- | --- | --- | --- | --- | --- |
| 先判斷是否適合 | `#service-options` | Primary navigation／filled | min 52px | min 48px，可 full width | anchor 被 Headbar 遮住 |
| 寄信提交工作情境 | `mailto:${siteConfig.contactEmail}?subject=合作情境：` | Page Primary／filled | min 52px | full width，min 48px | 顯示 Email 但不是可用 `mailto:` |
| 也可以透過 Threads 聯絡 | `siteConfig.threadsUrl` | Secondary／bordered paper | min 48px | full width，min 48px | 177 × 23px text link |

### 7.7 Service options 與 process contract

#### Service options

- **語意順序：** AI 工作流診斷 → 企業內訓與工作坊 → AI 產品與 Agent 導入；由範圍較小、最適合先判斷的合作走向較高承諾的導入。
- **DOM 順序：** 與 config 一致；每項依 title → outcome → fit → deliverables。
- **Desktop：** 三項垂直比較、每項內左右欄；不改成三張同質商品卡。
- **Mobile：** 單欄；每項縮短為 2–3 個高訊號 fit 與 3 個 deliverables。
- **辨識元素：** `01–03`、service type、自然中文 outcome；英文 id 只作低權重 metadata。
- **Recovery：** 不確定時，options intro 明示通常從工作流診斷開始；仍無法判斷者可在頁尾 Email 描述現況。

#### 合作流程

- **語意順序：** 診斷 → 設計 → 執行 → 驗收；前一步的輸出是後一步的輸入。
- **DOM 順序：** `<ol>` 依上述順序；第三步從「推進」改為「執行」。
- **Desktop：** 四欄、`01–04` 節點與水平導引線；內容不被線段遮住。
- **Mobile：** 垂直 rail；節點 → title → body，導引線不穿過正文。
- **辨識元素：** 編號、連續 rail、短標題；`FROM BRIEF TO HANDOFF` 只作輔助標籤。
- **Recovery：** 流程不是表單；訪客若尚未能定義需求，由頁尾說明「不用先寫需求書」並提供 Email。

### 7.8 文案待確認清單

- `serviceTracks.fit` 每項保留現有 3 個高訊號情境即可；deliverables 由 4 個收斂為 3 個，必要時合併現有項目，不新增承諾。
- 工作流診斷可保留「現況與問題地圖」「AI 可介入點與風險」「第一版工作流與驗收方式」；「後續建議」若無獨立決策價值則不再另列。
- 企業內訓保留需求盤點、客製課綱／示範、工作坊／實作；課後建議可併入交付說明。
- Agent 導入保留需求／風險、工作環境設計、原型／路線圖與驗收交接；只合併現有內容，不擴張服務範圍。
- 合作經驗新增語意 heading，但保留現有實際交付範圍與不公開客戶資訊的說明。
- 邊界只保留責任、資料、驗收、承諾與維護，不再重講三種服務的 fit。
- `serviceTracks.notFit` 目前未渲染；確認全 repo 無引用後可移除，不能只因「看起來沒用」直接刪。

### 7.9 Services outcome-based DoD

- 訪客能在一個 options section 內分辨三種合作，不需讀完所有重複清單。
- 「合作經驗」存在於 heading outline，視覺與語意都成立。
- 不看流程正文也能理解 `診斷 → 設計 → 執行 → 驗收`。
- Email `mailto:` 真實使用 `siteConfig.contactEmail`；Threads 是清楚的 secondary paper button。
- `#service-options` 在三種 Mobile 寬度跳轉後不被 Headbar 遮住。
- Service data 精簡不新增承諾；五 viewport 與新證據驗收後建立 Services checkpoint。

## 8. 執行 Phase

### Phase 0：Behavior contract 與共用 CTA pattern

**Goal contribution：** S1、S2、S3、S5；先把「有連結但看不出來」轉成可驗收契約。

**Exact files：**

- 新增 `docs/contracts/remaining-primary-pages-cta-and-sequence-contract-2026-07-14.md`
- 修改 `src/styles/global.css`
- 回歸檢查 `src/pages/index.astro`
- 回歸檢查 `src/pages/expertise.astro`

**工作：**

- 建立 before／after 行為契約，列出 CTA role、sequence、anchor、forced-colors 與 viewport examples。
- 沿用現有 `.btn`，補齊或整理 filled、bordered paper、focus、active、reduced-motion、forced-colors states。
- 不建立 About／Work／Courses／Services 共用 layout component。

**Invariants：** Home、Expertise 的 accepted CTA、paper、route 與 heading 不變；全站導航不變。

**Forbidden shortcuts：** 不用 `!important` 大範圍覆蓋四頁；不把所有 `.text-link` 全站改成按鈕；不以背景圖單獨表示邊界。

**Evidence：** Home／Expertise 1440、390 regression；CTA default／hover／focus／forced-colors；`git diff --check`、check、build。

**Outcome DoD：** 共用 CTA states 能被四頁使用，Home／Expertise 無視覺或互動退步。完成後建立 `chore: establish shared paper action contract` checkpoint，不 push。

### Phase 1：About

**Goal contribution：** G1、S1、S3、S4、S6。

**Exact files：**

- 修改 `src/pages/about.astro`
- 只在共用 state 確實缺漏時修改 `src/styles/global.css`
- 新增 evidence folder：`docs/design/audits/2026-07-14-about-implementation/`

**Invariants：** timeline 四項與順序、公開作品數字／日期、CabAI capability role、Work 作為 Primary destination 不變。

**Forbidden shortcuts：** 不刪時間軸換短卡；不把 CabAI 改成商品 pitch；不把 Hero、CabAI 或頁尾 Work CTA 留成 22–23px 小字；不固定 section 高度。

**Evidence：** full Desktop／Mobile、Hero、timeline、CabAI row、頁尾 CTA；五 viewport；鍵盤、focus、外連、zero overflow。

**Outcome DoD：** 4.9 全部通過，人工開圖確認後建立 `fix: clarify about trust and work routes` checkpoint，不 push。

### Phase 2：Work

**Goal contribution：** G2、S1、S2、S3、S4、S6。

**Exact files：**

- 修改 `src/pages/work.astro`
- 只在共用 state 確實缺漏時修改 `src/styles/global.css`
- 新增 evidence folder：`docs/design/audits/2026-07-14-work-implementation/`

**Invariants：** featured handbook、三個公開檔案、公開證據與日期、有限揭露範圍、Services destination 不變。

**Forbidden shortcuts：** 不讓整張長卡維持唯一 anchor；不刪案例限制換成成果口號；不讓 Mobile handbook CTA 退回 text link；不添加客戶名或未公開成果。

**Evidence：** full Desktop／Mobile、featured CTA、case article/action、limited disclosure、final Services CTA、`#selected-work` offset、focus name。

**Outcome DoD：** 5.9 全部通過後建立 `fix: turn work evidence into clear case routes` checkpoint，不 push。

### Phase 3：Courses

**Goal contribution：** G3、S1、S2、S3、S5、S6。

**Exact files：**

- 修改 `src/pages/courses/index.astro`
- 修改 `src/config/authority.ts`（只做核准的 route 文案／資料整理）
- 讀取但不應改動 `src/config/siteConfig.ts`
- 只在共用 state 確實缺漏時修改 `src/styles/global.css`
- 新增 evidence folder：`docs/design/audits/2026-07-14-courses-implementation/`

**Invariants：** 四種 route、講座與工作坊、商品名、價格、免費試看、CabAI URL／campaign、未開放狀態不變。

**Forbidden shortcuts：** 不把四條路畫成必修漏斗；不為未開放講座加假 href；不以 CabAI 註冊壓過具體商品；不把 route CTA 留成 23px 小字。

**Evidence：** full Desktop／Mobile、map ordering、三個 route CTA、尚未開放 state、CabAI secondary、`#learning-map` offset、external URL inspection。

**Outcome DoD：** 6.9 全部通過後建立 `fix: make course choices explicit and non-sequential` checkpoint，不 push。

### Phase 4：Services

**Goal contribution：** G4、S1、S2、S3、S4、S5、S6。

**Exact files：**

- 修改 `src/pages/services.astro`
- 修改 `src/config/authority.ts`（核准後精簡 service data，並在全 repo 無引用時移除 `notFit`）
- 讀取但不應改動 `src/config/siteConfig.ts`
- 只在共用 state 確實缺漏時修改 `src/styles/global.css`
- 新增 evidence folder：`docs/design/audits/2026-07-14-services-implementation/`

**Invariants：** 三種服務、真實交付經驗、四步流程、合作邊界、Email 唯一 Primary、Threads fallback 不變。

**Forbidden shortcuts：** 不將合作經驗壓成一句；不新增客戶或成果；不把三種服務縮成無資訊的標題卡；不以 Threads 取代 Email；不讓 `service-proof` 無 heading。

**Evidence：** full Desktop／Mobile、service comparison、heading outline、process Desktop／Mobile、Email／Threads states、`#service-options` offset、mailto inspection。

**Outcome DoD：** 7.9 全部通過後建立 `fix: sharpen services fit and contact flow` checkpoint，不 push。

### Phase 5：Cross-page production gate

**Goal contribution：** G0 與所有 Supporting goals；證明四頁和既有 Home／Expertise 同時成立。

**Exact files：**

- 回歸 `src/pages/index.astro`
- 回歸 `src/pages/expertise.astro`
- 回歸 `src/pages/about.astro`
- 回歸 `src/pages/work.astro`
- 回歸 `src/pages/courses/index.astro`
- 回歸 `src/pages/services.astro`
- 回歸 `src/styles/global.css`
- 新增 `docs/design/audits/2026-07-14-primary-pages-production-gate/`
- 更新本文件 approval／completion 狀態時，只記錄可驗證結果

**Invariants：** Articles CTA 仍暫停；搜尋與 Starter Pack 不回來；Rail／Footer／Mobile Headbar 沒有跨頁漂移；Email 與 CabAI destinations 真實。

**Forbidden shortcuts：** 不沿用舊截圖；不只驗 Desktop；不以一次 build 取代互動與閱讀驗收；不把尚未驗證的頁面標成 Ready。

**Evidence：** 六頁 1440／390 full-page，四頁 1280／360／320 關鍵區；CTA inventory runtime facts；anchor、Enter、focus、forced-colors；check、validate、build、diff check。

**Outcome DoD：** 所有頁面契約、畫面、runtime facts 與文件一致，才建立 `chore: complete primary page production gate` checkpoint，不 push。

## 9. Verification matrix

### 9.1 Automated／structural

每一 Phase 至少執行：

```text
npm run check
npm run validate:content
npm run build
git diff --check
```

並確認：

- `scrollWidth === innerWidth`；
- 重要 CTA `getBoundingClientRect().height >= 44`，本計畫指定者應達 48／52px；
- href、target、rel、accessible name 與 DOM 順序；
- `mailto:` 使用 `siteConfig.contactEmail`；
- CabAI URL 仍由 `withCabAiAttribution()` 產生；
- 未開放項目沒有 href 或假互動語意；
- 全 repo 搜尋確認 dead data 才能移除。

### 9.2 Interaction

- Tab 順序符合閱讀順序。
- Enter 能啟動每個 anchor；內頁 anchor 到達後目標標題可見。
- hover、active、focus-visible 皆有可見狀態，且不引發布局位移。
- Mobile menu、Headbar 與頁內 anchor 同時存在時不遮擋。
- 外站另開分頁；站內 route 與 page anchor 不另開。
- reduced motion 與 forced-colors 不失去狀態辨識。

### 9.3 Experience review

逐頁用三次掃讀驗證：

1. **五秒掃讀：** 能否說出這頁與自己有何關係？
2. **只看標題與 CTA：** 能否還原閱讀順序與下一步？
3. **完整閱讀：** 是否有同義重述、硬塞產品、證據遠離主張或情緒一路平直？

每張截圖須人工開啟；若發現錯頁、空白、載入中、Dev Toolbar、裁切或 cache mismatch，立即作廢重拍。

## 10. Checkpoint、rollback 與停損

- Phase 0、About、Work、Courses、Services、Production gate 各一個 commit；全部禁止 push。
- 每次 commit 前先列 `git status --short` 與 staged files，避免把使用者其他變更混入。
- 若共用 CSS 造成 Home／Expertise regression，先回退該共用變更，再把必要 layout 留在頁面 scoped CSS；不得帶著回歸進下一頁。
- 若文案精簡會改變價格、商品承諾、合作範圍或公開事實，立即停下來回報，不自行合理化。
- 若 production 畫面與 dev／cache 顯示不一致，以新 production build、cache-bust 與實際 screenshot 重新確認，不靠口頭推測。
- 若單頁未達 DoD，不建立「完成」checkpoint，也不開始下一頁。

## 11. 最終執行就緒判定

目前判定：**Pending User Review**。

計畫已具備：

- 明確產品意圖、Actors、goal hierarchy、invariants 與 non-goals；
- production baseline 與已人工驗收的八張長頁截圖；
- 四頁的閱讀旅程、專屬視覺語法、區塊目的、CTA inventory、sequence contract、heading grouping 與文案待確認清單；
- Phase、exact files、禁止捷徑、驗證證據、checkpoint 與 outcome-based DoD。

只有在使用者核准此計畫、repo facts 沒有改變，且每個 Phase 都產生新的 production 證據後，對應頁面才可個別標示為 Ready。此刻不應實作或宣稱四頁已完成。
