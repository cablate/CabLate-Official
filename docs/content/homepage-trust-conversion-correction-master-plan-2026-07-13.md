---
status: proposed
created: 2026-07-13
implementation_status: not_started
copy_status: awaiting_user_confirmation
verdict: needs_revision
scope:
  - remove the public search feature
  - correct homepage narrative, trust hierarchy and contextual CTA roles
canonical_parent: docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md
---

# 首頁信任與轉換修正 Master Plan

## 0. 文件定位

這份文件是 2026-07-13 上線前的首頁修正規格。它只處理使用者人工審查提出的六個問題，不取代全站長期總綱：

- 全站長期目標、頁面角色與 CTA 原則，仍以 `docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md` 為準。
- 本文件負責把該總綱落到首頁的區塊任務、CTA 層級、文案提案、視覺驗收與 Search 移除範圍。
- 本文件核准前，不改 `src/pages/index.astro`、導覽、CSS、Search 路由、建置腳本或套件。
- 本文件中的可見文案都是待確認提案，不是已核准定稿。

## 1. 先說結論：這輪真正要修的是什麼

目前首頁不是缺內容，也不是紙面視覺不成立。真正的問題是：幾個區塊已經成功讓訪客產生認同、好奇或信任，卻沒有把那股動機接到合理的下一步。

現在的閱讀感受大致是：

```text
看見問題
→ 覺得「這很像我」
→ 沒有可以立刻採取的行動
→ 看見一句核心主張
→ 不容易注意到 About
→ 被要求「選擇下一步」
→ 看見案例，但最強的經驗證據縮在角落
→ 突然被帶到 CabAI，感覺像硬接產品
```

修正後應該是：

```text
被問題說中
→ 立刻選擇「先自己診斷」或「判斷是否適合合作」
→ 認識 CabLate 與這套判斷怎麼形成
→ 從最接近現況的情境選路
→ 用半年以上的實作與排錯經驗建立信任
→ 理解 CabAI 是試看、學習、購買與內容存取的平台
→ 自己決定要不要前往
```

重點不是在每一區增加按鈕，而是讓每一區只提供一個符合當下心理狀態的行動。首頁的頁級 Primary CTA 仍是「選擇一條適合自己的路徑」，其他按鈕都只能是 Contextual CTA。

## 2. Design Read

Reading this as: 保留既有紫色紙面品牌的個人網站首頁，服務正在使用 AI 的個人工作者、學習者與團隊決策者；這輪是敘事與轉換層級修正，不是視覺系統重做。

- `DESIGN_VARIANCE: 6`
  - 保留首頁目前的敘事變化與不對稱版面，不把所有區塊改成同一種卡片。
- `MOTION_INTENSITY: 3`
  - 本輪不新增 GSAP、視差或自動動畫。互動只需清楚的 hover、focus、active 狀態。
- `VISUAL_DENSITY: 5`
  - 保留目前的資訊量，但用層級和留白讓主張、證據與行動不再互搶。

設計邊界：

- 沿用紫色識別、紙張材質、現有照片、字體與左側導覽。
- 不用 ImageGen 掩蓋內容問題。
- 不新增套件或設計系統。
- 不改首頁區塊順序，先把每一區的任務與權重修正到位。
- 不重新開放 Article 導流。

## 3. 現況事實基線

### 3.1 首頁目前的區塊順序

來源：`src/pages/index.astro`

1. Hero：說明 AI 工作為什麼仍會重做、卡住或不敢交付。
2. Diagnosis：三種失效現象，目前沒有任何連結。
3. Core proposition：主張「判斷力比執行力值錢」，只有一個低權重 About 文字連結。
4. Routes：三條路徑，分別前往 Expertise、Courses、Services。
5. Case：工程手冊案例與一個 CabAI 商品連結。
6. CabAI：介紹免費試看、課程、手冊與已購內容。
7. Newsletter：不定期的重要更新通知。

### 3.2 實際畫面核對

2026-07-13 以 `http://127.0.0.1:4321/` 核對目前渲染：

- Diagnosis 的辨識感很強，但整區沒有連結，讀者被說中後只能繼續往下滑。
- Core proposition 的 About 連結存在，但它和一般紫色文字連結同層，不像重要的信任入口。
- Routes 有三個目的明確的連結，但區塊標籤「選擇下一步」偏流程指令，沒有先建立「選了可能有幫助」的感覺。
- Case 的標題是明確痛點；「整理自半年以上的實作與排錯經驗」只有小型 muted 文字，證據權重低於敘事細節。
- CabAI 內容有交代平台裡有什麼，但標題用「接著自己動手做」與「把方法帶進工作」硬接前文，沒有先說 CabAI 的具體角色。
- 桌機側欄、手機選單與 Footer 目前都有「搜尋」。

### 3.3 Search 的實際技術範圍

Search 不是單一連結，而是一組完整功能：

| Surface | 現況 |
| --- | --- |
| 桌機側欄 | `src/components/ArchiveNavigation.astro` 有 `/search/` 連結 |
| 手機選單 | `src/components/ArchiveNavigation.astro` 有 `/search/` 連結 |
| Footer | `src/layouts/BaseLayout.astro` 有 `/search/` 連結 |
| Search route | `src/pages/search.astro` 載入 Pagefind UI |
| Build | `scripts/build.js` 建立 Pagefind index |
| Dependency | `package.json` 與 lockfile 包含 `pagefind` |

「全面移除搜尋」代表以上六個面向都要一起移除。文章正文裡正常使用「搜尋」這個動詞，不屬於刪除範圍。

## 4. GORE / Product Intent

### 4.1 Product intent

首頁要讓第一次接觸 CabLate 的人，在不被急著推銷的情況下完成三件事：認出自己的問題、相信這些問題可以被拆開處理、選擇一個現在真的有用的入口。

### 4.2 Primary goal

`HG-0`：訪客能從一個被說中的 AI 工作問題出發，理解 CabLate 的判斷價值，並選擇符合自己現況的診斷、學習或合作路徑。

### 4.3 Actors and jobs

| Actor | 想完成的事 | 網站不該逼他做的事 |
| --- | --- | --- |
| 還不清楚原因的 AI 使用者 | 確認問題可能卡在哪裡 | 先懂 Agent、Skill、Context 等術語 |
| 已做過不少嘗試的進階使用者 | 找到比「再加規則」更深的解釋 | 先相信空泛口號或直接購買 |
| 想自己學的人 | 找到符合目前程度的內容 | 一次理解所有產品或先建立帳號 |
| 有具體工作或團隊問題的人 | 判斷是否值得合作 | 繞過多個內容頁才找到合作入口 |
| 想確認 CabLate 是否可信的人 | 了解經歷、原則與判斷怎麼形成 | 從小字連結猜 About 是否重要 |
| 尚未準備行動的人 | 保留一個低壓力的回訪方式 | 被承諾不存在的固定電子報頻率 |

### 4.4 Supporting goals

| Goal ID | Goal | Depends on | Observable outcome |
| --- | --- | --- | --- |
| `HG-1` | 移除 Search 這個非必要決策與維護面 | none | 全站沒有 Search 入口、路由與 Pagefind 建置 |
| `HG-2` | 讓 Diagnosis 把認同感接到合理行動 | `HG-0` | 區塊提供診斷與合作兩種不同意圖的入口 |
| `HG-3` | 讓 Core proposition 同時完成身份與信任建立 | `HG-0` | About 入口在掃讀時可辨識，不再只是角落小字 |
| `HG-4` | 讓 Routes 從流程指令改成問題解決選擇 | `HG-0` | 三條路仍清楚，但區塊先說明每條路能處理哪種現況 |
| `HG-5` | 讓 Case 的進階痛點與經驗證據成為信任高點 | `HG-0` | 半年以上經驗證據緊鄰標題且具有正常閱讀權重 |
| `HG-6` | 說清楚 CabAI 為什麼出現在首頁 | `HG-5` | 訪客知道它是試看、學習、購買與內容存取平台 |
| `HG-7` | 保持桌機、手機、鍵盤與螢幕閱讀器都能完成相同行動 | `HG-1` 至 `HG-6` | 所有 CTA 可辨識、可聚焦、可點擊且不溢位 |

### 4.5 Soft goals

- `SG-1 被理解`：問題描述像訪客的真實情況，不像方法論摘要。
- `SG-2 不被逼迫`：先解釋目的再出現產品，不用焦慮或誇大承諾。
- `SG-3 信任`：證據比 CabLate 自己的形容詞更顯眼。
- `SG-4 清楚`：每個區塊只承擔一個主要心理任務。
- `SG-5 自然`：繁體中文可朗讀，不用空泛抽象名詞、硬造金句或中國行銷用語。
- `SG-6 可維護`：沿用現有 HTML、CSS 與資料來源，不靠新圖片或套件才能成立。

### 4.6 Domain invariants

1. 首頁仍是公開的信任與決策中樞，不是產品總表。
2. 首頁頁級 Primary CTA 意圖仍是「選擇適合自己的路徑」。
3. Diagnosis 的 CTA 是情境延伸，不得變成兩個同權重的銷售按鈕。
4. About 是信任補強，不是所有訪客的必經漏斗。
5. CabAI 只在理解與信任之後出現，且首頁只保留一個低壓力外部入口。
6. 工程手冊 CTA 仍直達既有商品頁，不繞回 CabAI 首頁。
7. Article 頁面可以存在，但本輪不恢復站內 Article CTA。
8. 更新通知只承諾重要更新，不承諾固定寄送頻率。
9. 不新增未經證實的數字、成果、客戶名稱或見證。
10. 客戶匿名、無營收數字、公開安全證據等既有紅線維持不變。
11. 紫色紙面視覺、現有照片、字體與首頁主要區塊順序維持不變。

### 4.7 Non-goals

- 不重做 Hero。
- 不改 About、Expertise、Work、Courses、Services、Articles 的頁面內容。
- 不恢復 Article 導流。
- 不處理文章內頁、課程內容頁或其他搜尋替代方案。
- 不新增站內 AI 問答、篩選器或導覽精靈。
- 不加入 GSAP、ImageGen 素材或新依賴。
- 不改 CabAI 外站功能、商品內容、登入或 Discord 流程。
- 不趁機整理所有 CSS 或做全站 dead code 清除。

## 5. 六個問題的理解與解法

### 5.1 全面移除 Search

#### 理解

Search 現在提供了一個看似重要、實際上不符合本版網站策略的決策。Articles 不主動導流、內容索引也不是首頁主要任務，保留 Search 只會讓導覽多一個低價值入口，還增加 Pagefind 的建置與維護面。

#### 解法

- 移除桌機側欄、手機選單與 Footer 的 Search 連結。
- 刪除 `src/pages/search.astro`，讓 `/search/` 回到正常 404。
- 移除 `scripts/build.js` 的 Pagefind index 區塊。
- 以套件管理指令移除 `pagefind`，同步更新 `package.json` 與 `package-lock.json`。
- 不對文章正文進行「搜尋」字串的機械刪除。

### 5.2 Diagnosis：把「被說中」接到行動

#### 現況問題

`先看清楚問題` 是作者視角的步驟說明。真正有力量的是下面三個讀者可以立刻認出的情境。區塊成功讓人代入，卻沒有任何 CTA，情緒在最高點中斷。

#### 區塊任務

讓訪客完成一句內在判斷：「這些狀況我有，我想知道問題可能卡在哪裡。」

#### 解法

- 把 section label 改成讀者辨識語言，例如「你可能也遇過這些問題」。
- 保留現有 H2 與三個診斷情境，它們已經完成主要辨識工作。
- 在左側結論後新增一組 Contextual CTA：
  - Primary contextual：前往 `/expertise/` 看問題診斷。
  - Secondary contextual：前往 `/services/` 判斷是否適合合作。
- 兩個入口不可做成相同重量。診斷是主要延伸，合作是已經有明確需求者的替代路徑。
- 不在三個情境各放一顆按鈕，避免一區出現三到五個競爭入口。

#### 預期情緒

「原來不是只有我遇到」→「我可以先找原因」→「如果已經影響工作，也能直接確認是否適合合作」。

### 5.3 Core proposition：讓主張帶出人

#### 現況問題

「判斷力比執行力值錢」很醒目，但「我是 CabLate」與 About 入口被放在次要欄位。訪客容易記住一句主張，卻不容易知道是誰、為什麼值得相信。

#### 區塊任務

回答：「CabLate 是誰，這個判斷從哪裡來？」

#### 解法

- 把 section label 從抽象的「我的核心主張」改成身份訊號「我是 CabLate」。
- 保留核心主張與現有方法說明，不額外塞履歷或作品清單。
- About CTA 仍可使用紫色文字加箭頭，但升級為本區明確的行動列：
  - 字級不小於正文。
  - 使用較高字重與足夠上下間距。
  - 提供清楚 hover、focus 與 active 狀態。
  - 手機觸控高度至少 44px。
- 不把 About 變成全頁 Primary CTA，也不與 Routes 搶同等視覺重量。

#### 預期情緒

「這句主張有立場」→「我知道這個人做事的順序」→「我願意多了解他的經歷和判斷怎麼形成」。

### 5.4 Routes：從流程指令改成可處理的選擇

#### 現況問題

「選擇下一步」在命令訪客進入流程，但沒有先說明選擇的價值。三條路本身其實清楚，問題主要在區塊 framing，不需要整組推翻。

#### 區塊任務

讓訪客相信：「我不必先懂所有方法，只要從最接近現況的問題開始。」

#### 解法

- 保留 H2「你現在最想改善哪一件事？」與三條 route 的順序。
- 把 section label 改成「從最接近你的問題開始」。
- 補一個短說明，交代三種選擇分別是自己診斷、系統學習、直接討論合作。
- 保留三個紫色文字加箭頭的連結，不必全部改成大型按鈕。
- 提升連結的掃讀與點擊品質：固定箭頭位置、增加可點範圍、明確 focus 狀態，桌機不可斷成兩行。
- 不把整個 route row 變成隱性大連結，以免段落文字與真正動作邊界不清楚。

#### 預期情緒

「我的情況可以被分類」→「其中一條很像我」→「我知道點下去會看到什麼」。

### 5.5 Case：把進階痛點與經驗證據拉到前面

#### 現況問題

H2 已經是很好的進階使用者痛點。`一次真實的追查` 只是在描述內容形式，沒有說這一區和訪客的關係。`整理自半年以上的實作與排錯經驗。` 是強證據，卻以 `.78rem` muted 文字放在 CTA 後方，視覺上像附註。

#### 區塊任務

讓已經加過很多規則、做過很多嘗試的人意識到：問題可能不在規則數量，CabLate 也確實長期追查過這類失效。

#### 解法

- 把 section label 改成能辨識成熟度的語句，例如「已經做過不少嘗試」。
- 保留 H2 與問題、發現、處理三段結構。
- 保留「整理自半年以上的實作與排錯經驗。」這項事實，不改成更誇張的數字或成果。
- 把證據移到 H2 後、案例步驟前，或與 CTA 同一個清楚的 proof block：
  - 字級至少 `1rem`。
  - 使用正常 ink 或深紫色，不用低對比 muted 灰。
  - 可用左側紫色細線、紙標籤或較高字重建立證據層級。
- 手冊 CTA 保留一個，仍直達既有商品頁。

#### 預期情緒

「我真的試過很多方法」→「原來規則不是唯一問題」→「這個人追過，而且整理成我可以直接查的手冊」。

### 5.6 CabAI：先解釋平台角色，再邀請前往

#### 現況問題

「接著自己動手做」與「把這些方法真正帶進工作」暗示 CabAI 是實作工具，但現在的 CabAI 首頁角色其實是免費試看、課程、手冊、購買與已購內容存取。敘事承諾和實際目的不一致，所以像硬塞產品。

#### 區塊任務

在訪客已經理解問題、方法與證據後，清楚說明：「如果你想找免費試看、課程或手冊，CabAI 是集中查看與存取這些內容的地方。」

#### 解法

- 移除「接著自己動手做」這種假轉場。
- 直接把 section label 寫成「CabAI 學習平台」。
- H2 說明平台裡有什麼，不再用抽象的「帶進工作」。
- 內文交代可以先看目前開放內容，確定適合再決定是否付費。
- 全區只保留一個外部 CTA，前往既有 CabAI products URL。
- 不在首頁同時加入註冊、Discord、單一商品與全部商品四種入口。
- 視覺權重低於 Routes 與 Case，維持一個平靜、低壓力的平台說明區。

#### 預期情緒

「我知道 CabAI 是什麼」→「我知道點下去會看到試看、課程和手冊」→「我可以先看，再決定要不要付費」。

## 6. CTA 架構

| 區塊 | CTA role | Destination | 建議視覺權重 | 理由 |
| --- | --- | --- | --- | --- |
| Hero | Primary route starter | `#diagnosis` | Filled primary | 進入首頁主要敘事 |
| Diagnosis | Contextual primary | `/expertise/` | Filled or strong solid | 延續「我想找原因」 |
| Diagnosis | Contextual secondary | `/services/` | Outline or prominent text | 服務已有明確影響與合作意圖的人 |
| Core proposition | Trust CTA | `/about/` | Prominent purple text with arrow | 補強身份，不搶頁級主決策 |
| Routes | Page primary intent | `/expertise/`、`/courses/`、`/services/` | 三個同系 text links | 讓不同成熟度自己選路 |
| Case | Evidence CTA | CabAI handbook product URL | Prominent text or compact button | 延伸當下案例，不回平台首頁 |
| CabAI | Low-pressure platform CTA | CabAI products URL | One primary button | 說明後才離站看內容 |
| Newsletter | Optional return path | Existing form | Existing form CTA | 暫時不行動者的低壓力入口 |

規則：

- 同一區最多一個 filled button。
- 相同 href 的連結使用一致名稱；不同 href 不得使用相同可及名稱。
- 按鈕名稱要說明目的，不寫「了解更多」。
- 外部連結繼續使用 `target="_blank"` 與 `rel="noopener"`。
- Arrow icon 維持裝飾用途，`aria-hidden="true"`。

## 7. 待確認文案清單

以下只列這輪需要改動的可見文字。使用者確認前不得套用到頁面。

### 1. Diagnosis section label

- **觸發位置**：`src/pages/index.astro` Diagnosis，現行「先看清楚問題」
- **原句**：`先看清楚問題`
- **為什麼要改**：它是作者視角的流程指令，沒有把三個強烈情境帶回讀者自己。
- **建議怎麼改**：`你可能也遇過這些問題`

### 2. Diagnosis contextual CTA

- **觸發位置**：Diagnosis 結論後，目前沒有 CTA
- **原句**：無
- **為什麼要改**：訪客剛完成問題辨識，動機最強，卻沒有合理的診斷或合作入口。
- **建議怎麼改**：Primary `看問題可能卡在哪一層`；Secondary `看看是否適合合作`

### 3. Core proposition section label

- **觸發位置**：Core proposition，現行「我的核心主張」
- **原句**：`我的核心主張`
- **為什麼要改**：這一區同時負責介紹 CabLate；現行標籤只指出一句主張，弱化了人物與信任任務。
- **建議怎麼改**：`我是 CabLate`

### 4. About CTA

- **觸發位置**：Core proposition 尾端
- **原句**：`看這套方法怎麼形成`
- **為什麼要改**：原句只指向抽象方法，沒有明說訪客將看到 CabLate 的經歷與判斷來源。
- **建議怎麼改**：`認識我的經歷與判斷方式`

### 5. Routes section label

- **觸發位置**：Routes，現行「選擇下一步」
- **原句**：`選擇下一步`
- **為什麼要改**：它像網站流程提示，沒有先說選一條路可能如何幫助訪客處理問題。
- **建議怎麼改**：`從最接近你的問題開始`

### 6. Routes supporting copy

- **觸發位置**：Routes H2 後，目前沒有說明句
- **原句**：無
- **為什麼要改**：三條路的差異存在於卡片內容，掃讀區塊標題時還不知道這裡提供診斷、學習與合作三種處理方式。
- **建議怎麼改**：`你可以先自己診斷、系統學習，或直接討論合作。選最符合現況的一種就好。`

### 7. Case section label

- **觸發位置**：Case，現行「一次真實的追查」
- **原句**：`一次真實的追查`
- **為什麼要改**：它描述文章形式，沒有讓做過很多嘗試的訪客認出這一區是寫給自己。
- **建議怎麼改**：`已經做過不少嘗試`

### 8. Case proof

- **觸發位置**：Case CTA 後方的小字
- **原句**：`整理自半年以上的實作與排錯經驗。`
- **為什麼要改**：文字本身不需改；問題是位置、字級與顏色讓強證據看起來像附註。
- **建議怎麼改**：保留原句，移到標題附近並提升為正常正文或 proof callout。

### 9. CabAI section label

- **觸發位置**：CabAI，現行「接著自己動手做」
- **原句**：`接著自己動手做`
- **為什麼要改**：CabAI 在此不是實作工具，而是試看、課程、手冊、購買與內容存取平台，現行轉場造成錯誤期待。
- **建議怎麼改**：`CabAI 學習平台`

### 10. CabAI heading

- **觸發位置**：CabAI H2
- **原句**：`想把這些方法真正帶進工作？`
- **為什麼要改**：這句沒有說明 CabAI 和「帶進工作」的具體關係，讀起來像為了推平台硬接前文。
- **建議怎麼改**：`課程、手冊與免費試看，都整理在這裡。`

### 11. CabAI body copy

- **觸發位置**：CabAI 內文
- **原句**：`CabAI 裡有免費試看、系統課程、工程手冊和已購內容。先看目前開放的內容，需要更完整的資料時再付費。`
- **為什麼要改**：資訊大致正確，但「需要更完整的資料」太模糊，也沒有直接說明訪客可以先判斷適不適合。
- **建議怎麼改**：`CabAI 收錄免費試看、系統課程、工程手冊和已購內容。你可以先看目前開放的內容，確定適合，再決定要不要付費。`

### 12. CabAI CTA

- **觸發位置**：CabAI button
- **原句**：`看目前可以開始的內容`
- **為什麼要改**：「可以開始的內容」仍需要讀者自己猜目的，沒有延續新標題裡的試看與學習資訊。
- **建議怎麼改**：`查看免費試看與學習內容`

## 8. 桌機與手機的版面規格

### 8.1 共用規則

- 每個 CTA 必須落在 `.paper-card__inner` 的安全內距內，不得貼到紙張邊緣或溢出。
- 標題先以人工斷句為主，`text-wrap: balance` 只作輔助。
- 文字連結要有可辨識的 hover、focus-visible、active 狀態，不能只靠紫色表示可點。
- 正文行長控制在約 60 至 70 個英文字元的視覺寬度內。
- Normal text contrast 至少 4.5:1，互動邊界與 focus indicator 至少 3:1。
- 不用純裝飾動畫補層級；本輪只允許 transform 或 opacity 的短互動回饋。

### 8.2 Desktop

- Diagnosis CTA 放在左側 intro 欄位，與 conclusion 保持清楚間距；不可跨入右側三列情境。
- Diagnosis 的 secondary CTA 不與 primary 做成兩個相同深色按鈕。
- About CTA 要和身份段落形成一個完整 action row，不縮成段落尾巴。
- Routes 三個 action 的文字基線與箭頭位置一致，連結不可因欄寬窄而斷行。
- Case proof 必須在第一次看到標題與案例步驟時同時可見，不放回 CTA 之後的角落。
- CabAI 卡的視覺重量低於 Case，不新增大型圖片或第二個 CTA。

### 8.3 Mobile

- Diagnosis 的 primary 與 secondary action 垂直排列；每個可點高度至少 44px。
- About CTA 可占滿可用寬度，但外觀仍可維持文字加箭頭，不必變成第二顆深色按鈕。
- Routes 連結與前方敘述間距至少 `.5rem`，箭頭不可掉到下一行。
- Case proof 移到標題後，在手機上不可縮回 caption 字級。
- CabAI CTA 在 320px 寬度下不可超出紙張安全內距，文字最多一行；若無法一行，先縮短文案，不壓縮字級。
- `#diagnosis` anchor 到達後，標題不得被手機 headbar 遮住。
- 全頁在 320px、360px、390px 寬度不得產生水平捲動。

## 9. Implementation plan

### Phase 0：建立可驗證的 change contract

#### Goal contribution

- Goal IDs：`HG-1` 至 `HG-7`
- 目的：先把 Search 移除與首頁 CTA 的前後行為寫成可驗證契約，避免再次出現「說的和做的不同」。

#### Files

- 新增 `docs/contracts/homepage-trust-conversion-correction-2026-07-13.md`

#### Contract minimum

- `/` 與 `/search/` 的 before/after 行為。
- 桌機側欄、手機選單、Footer 的消費者與入口。
- 每個首頁區塊的 CTA destination、accessible name 與視覺角色。
- First paint、ready、focus、mobile wrap、404 等 UI states。
- Intentional changes 與 regression boundaries。
- Before/after screenshot 與 build evidence mapping。

#### Outcome evidence

- Contract status 由 `draft` 升為 `active` 前，所有文案已獲使用者確認。

### Phase 1：移除 Search 功能

#### Goal contribution

- Goal ID：`HG-1`

#### Files

- `src/components/ArchiveNavigation.astro`
- `src/layouts/BaseLayout.astro`
- `src/pages/search.astro`，刪除
- `scripts/build.js`
- `package.json`
- `package-lock.json`

#### Implementation constraints

- 用套件管理指令移除 `pagefind`，不可手改 lockfile 片段。
- 只刪 Search 專屬程式，不刪 IndexNow、sitemap ping 或 Article 正文中的一般「搜尋」用語。
- 不建立 redirect，不用另一個功能取代 `/search/`。

#### Outcome evidence

- 三個導覽 surface 都沒有 Search。
- `rg` 找不到 `/search/` 導覽連結與 Pagefind runtime/build references。
- Preview 中 `/search/` 顯示正常 404。
- Build 成功且不再輸出 Pagefind skip/failure 訊息。

### Phase 2：修正文案與 CTA 結構

#### Goal contribution

- Goal IDs：`HG-2`、`HG-3`、`HG-4`、`HG-5`、`HG-6`

#### Files

- `src/pages/index.astro`

#### Implementation constraints

- 只套用使用者核准的待確認文案。
- Diagnosis 只增加一組 CTA，不在每列增加連結。
- Routes 的三個 destination 與順序不變。
- Case 的半年以上經驗聲稱不改強、不改數字。
- CabAI 只保留 products URL 一個外部 CTA。
- 不新增 Article link、註冊 CTA、Discord CTA 或第二個 CabAI 商品 CTA。

#### Outcome evidence

- DOM snapshot 中每個 section 的 heading、label、CTA 名稱與 href 符合 contract。
- 文案通過 speak-human-tw 七問句、自讀與保真回讀。

### Phase 3：修正視覺權重與 responsive 行為

#### Goal contribution

- Goal IDs：`HG-2`、`HG-3`、`HG-4`、`HG-5`、`HG-7`

#### Files

- 優先只改 `src/pages/index.astro` 的 scoped styles。
- 只有兩個以上頁面確實需要同一模式時，才考慮抽到共用 CSS；本輪預設不動全站樣式。

#### Implementation constraints

- 沿用現有 `.btn`、`.text-link`、`.paper-card` 與 `.paper-card__inner`。
- 新增 modifier class 時只描述角色，例如 `home-context-actions`、`text-link--prominent`、`case-proof--featured`。
- 不用 `!important` 解決新的層級問題。
- 不新增 absolute decoration、外光暈、漸層 CTA 或第二套 radius 規則。
- 不改 Hero、照片輪播、側欄寬度或紙張材質。

#### Outcome evidence

- 桌機與手機截圖中，Diagnosis CTA、About CTA、Case proof 都能在對應區塊第一眼被辨識。
- 320px 至 1440px 無文字或按鈕溢出。
- Keyboard focus 順序符合視覺閱讀順序。

### Phase 4：Production verification

#### Goal contribution

- Goal IDs：`HG-0` 至 `HG-7`

#### Required checks

1. `npm run check`
2. `npm run build`
3. `git diff --check`
4. 精準 `rg` 檢查 Search 與 Pagefind 殘留
5. Browser DOM snapshot 核對 heading、link name、href
6. Keyboard Tab、Shift+Tab、Enter 測試
7. 桌機與手機截圖人工檢查
8. `/search/` 404 與首頁 `#diagnosis` anchor 測試

#### Browser QA viewports

| Viewport | 核對重點 |
| --- | --- |
| 1440 × 1000 | 桌機敘事、側欄、兩欄 section 與 CTA 權重 |
| 1280 × 800 | 一般筆電高度下的標題與 action wrap |
| 390 × 844 | 主流手機的 section 間距、按鈕與 headbar offset |
| 360 × 800 | 窄手機標題斷句與 route action |
| 320 × 568 | 最小寬度安全內距、零水平溢位、CTA 單行 |

#### Evidence location

- `docs/design/audits/2026-07-13-homepage-trust-conversion/`
- 至少保存 desktop top、desktop diagnosis-to-routes、desktop case-to-CabAI、mobile top、mobile diagnosis、mobile case-to-CabAI。

## 10. Goal-to-plan traceability

| Goal ID | Requirement | Owner / phase | Evidence |
| --- | --- | --- | --- |
| `HG-0` | 保持首頁為問題辨識、信任與分流頁 | Phase 2 至 4 | 全頁 DOM、desktop/mobile screenshots、人工五秒測試 |
| `HG-1` | 移除三處入口、route、build step、dependency | Phase 1 | `rg`、404、build output、package diff |
| `HG-2` | Diagnosis label 與兩層 contextual CTA | Phase 2 至 3 | DOM href/name、visual screenshot、keyboard test |
| `HG-3` | 身份 label 與 prominent About CTA | Phase 2 至 3 | DOM、About link visibility、focus test |
| `HG-4` | Route framing 修正，三條路維持 | Phase 2 至 3 | Three destination assertions、desktop/mobile screenshot |
| `HG-5` | Case label 對準進階訪客，proof 升級 | Phase 2 至 3 | Proof computed style、heading viewport screenshot |
| `HG-6` | CabAI role 與單一外部 CTA 說清楚 | Phase 2 | Copy review、external href assertion |
| `HG-7` | Responsive、contrast、focus、no overflow | Phase 3 至 4 | Five viewport QA、keyboard test、Lighthouse/axe spot check |

## 11. Acceptance criteria

### 11.1 Product outcome

- 第一次訪客在五秒內知道首頁在處理 AI 工作不穩與交付問題。
- Diagnosis 讀完後不再是死路，能前往問題診斷或合作判斷。
- Core proposition 讀完後能明確找到 About，不必在段落尾端找小字。
- Routes 不再只說「下一步」，而是讓訪客從最接近的問題選擇處理方式。
- Case 的「半年以上實作與排錯經驗」和痛點標題位於同一信任視野。
- CabAI 區塊在 CTA 出現前，已說清楚平台裡有什麼、訪客為什麼要去。

### 11.2 Search removal

- 桌機側欄、手機選單、Footer 沒有 Search。
- `/search/` 不再是有效內容頁。
- `pagefind` 不在 direct dependency 或 devDependency。
- Production build 不執行 Pagefind。
- 一般文章內的「搜尋」用語未被誤刪。

### 11.3 Copy

- 所有核准文案使用繁體中文與全形標點。
- 沒有「賦能、閉環、承接、轉化、落地」等不必要黑話。
- 沒有為了工整硬湊的三段排比、假坦白開場或罐頭結尾。
- 不新增未提供的個人故事、數字、結果或見證。
- CTA 文字能在離開上下文時仍大致說明目的。

### 11.4 UI and accessibility

- H1/H2/H3 階層不因視覺調整而改壞。
- 不用 `div` 模擬 link 或 button。
- 每個互動元素有可見 focus-visible。
- 手機觸控目標至少 44px 高。
- CTA label 在桌機與 320px 手機都不溢出紙張範圍。
- 色彩不是唯一的可點提示。
- `prefers-reduced-motion` 下不新增任何自動動態。

## 12. Goal conflicts and decisions

### 12.1 Diagnosis 放兩個 CTA，會不會破壞一頁一個 Primary CTA

不會。頁級主要決策仍由 Routes 完成；Diagnosis 的兩個入口是依當下辨識結果提供的 contextual choices。視覺上必須一主一次，不能做成兩個同權重 filled buttons。

### 12.2 About CTA 變顯眼，會不會搶走 Routes

About 只補信任，不承擔最終轉換。用 prominent text link，而不是大型 primary button，可以提高可見性又維持層級。

### 12.3 CabAI 還要不要留在首頁

保留，但角色必須縮回「內容與學習平台的低壓力入口」。如果文案無法在兩句內說清楚為什麼要去，寧可縮成較小的 platform strip，也不要用抽象敘事硬接。

### 12.4 Search 移除後是否需要替代功能

不需要。這一版的主要任務是診斷、學習、案例與合作分流。建立替代搜尋、AI 問答或大型索引都會擴大上線風險，也不由本輪 goal 推導。

## 13. Rollback and worktree boundaries

- 目前 worktree 已有大量既存修改與未追蹤稽核素材。實作時禁止 `git reset --hard`、廣泛 `git restore`、`git add -A` 或清除未追蹤檔案。
- 每個 phase 只檢查並 stage 明確列出的檔案。
- Search 移除與首頁敘事修正分開 commit，讓任何一部分出現問題時可以獨立回退。
- 如果 copy review 未通過，只能修改本文件的待確認文案，不得先套進頁面試感覺。
- 如果視覺調整破壞紙張安全內距、Hero、輪播或側欄，回退 Phase 3 的 scoped CSS，不回退已核准文案與 Search 移除。

## 14. Outcome-based Definition of Done

這輪不是在 build 通過時完成，而是在以下結果同時成立時完成：

1. Search 從 UI、route、build 與 dependency 完整消失。
2. Diagnosis 能把認同感轉成診斷或合作行動。
3. Core proposition 能清楚介紹 CabLate 並提供可辨識的 About 入口。
4. Routes 讓人覺得是在選處理方式，不是在服從網站流程。
5. Case 的進階痛點與半年以上經驗證據共同形成首頁信任高點。
6. CabAI 不再像硬塞產品，而是一個目的清楚、低壓力的外部內容入口。
7. 桌機、手機、鍵盤與螢幕閱讀器都能完成同一條決策旅程。
8. 所有核准文字、連結與公開事實都通過人工回讀。

## 15. Execution readiness verdict

**Verdict: Needs Revision**

Repo reality、技術範圍、phase、驗證與回退邊界已具備執行條件。唯一 blocker 是第 7 節的 12 項可見文案尚未獲使用者確認。文案確認後，本計畫可升為 `Ready`，再開始建立 change contract 與修改實作。
