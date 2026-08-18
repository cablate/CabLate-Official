# CabLate 內容／關於系統夜間設計審核

> 先做決策：請讀[內容與 About 決策版](./2026-08-17-content-about-decision-brief.md)。本文件保留完整證據與逐 route 判斷。

日期：2026-08-17  
審核者：CabLate Design Director（唯讀 audit）  
範圍：`/about/`、`/courses/`、`/articles/`、`/articles/tags/`、兩篇代表文章、`/work/`、`/privacy/`、`/confirm-subscription/`、404  
目的：在不修改 source、不安裝 dependency 的前提下，檢查這批頁面是否持續具備 CabLate 的個人品牌人格、內容證據與可讀的產品敘事。

## 先講結論

這批頁面已經有一個清楚的 CabLate 基礎：工程判斷、公開證據、紙張與檔案感、Noto Sans／Noto Serif／mono 的角色分工，以及把讀者帶往下一個具體行動的 CTA。`/about/`、`/courses/`、`/articles/` 的內容也不是空泛的品牌宣言，多數標題確實從「問題 → 判斷 → 結果」出發。

但目前仍是「一套紙張元件套在很多內容上」，還沒有完全成為各頁自己的內容世界。最需要先處理的是：

1. 長文章的閱讀證據在手機上被表格／程式碼的橫向溢出與缺少目錄入口打斷。
2. 文章訂閱 CTA 在截圖中露出空的紅色錯誤區，形成未完成的表單訊號。
3. `/work/` 不是目前可到達的獨立頁，而是導向 `/about/#public-output-title`；資訊架構與網址語意不一致。
4. 紙張卡、clip、section label、英文小標、邊框內卡片跨頁重複，紙張從「內容容器」變成了「所有區塊的預設皮膚」。
5. 內容已經有真實成果，但公開作品、課程、文章、標籤之間的發現路徑仍靠讀者自行拼接；尤其 tags 頁只有長列表，文章 detail 又是另一套卡片模板。

這不是「整站推翻重做」的結果。建議保留 CabLate 的紙張與工程檔案語彙，下一階段把紙張的使用改成有內容責任的容器，把每頁的敘事動作重新分開：About 是人物與證據、Courses 是選擇路徑、Articles 是問題索引、Article detail 是可驗證的實驗筆記、Privacy／Confirmation 是低裝飾的服務文件。

## 審核方法與證據

### 實際檢查

- local server：`http://127.0.0.1:4322`
- desktop：1440 × 1000，full-page screenshot
- mobile：390 × 1000，full-page screenshot
- clean capture：在 context 初始化時設定 `localStorage.cablate_analytics_consent_v1 = denied`，再等待頁面、字體與圖片載入
- raw capture：保留新訪客的分析同意狀態，確認同意面板對閱讀流程的影響
- source：逐頁閱讀 Astro markup／CSS、`ArticleLayout`、Newsletter／TOC／推薦元件與 `authority.ts`
- DOM sanity checks：確認路由 status、最終 URL、`h1` 數量、視窗寬度與 document scroll width、圖片自然尺寸；指定 desktop／mobile route 的 `scrollWidth` 均等於 client width，未觀察到水平 page-level overflow
- 本次沒有執行 Lighthouse、真實第三方表單送出、螢幕閱讀器、鍵盤完整巡覽或 production network waterfall；這些項目均明確標為未驗證，不把它們誤當成已通過

### 截圖索引

所有檔案位於：

`F:\_Program\OwnProject\CabLate\artifacts\night-audit\content-about\`

每個 route 有 `-1440-clean.png` 與 `-390-clean.png`。同名不含 `-clean` 的檔案是保留分析同意面板的 raw capture。

| route | desktop | mobile |
|---|---|---|
| `/about/` | `about-1440-clean.png` | `about-390-clean.png` |
| `/courses/` | `courses-1440-clean.png` | `courses-390-clean.png` |
| `/articles/` | `articles-1440-clean.png` | `articles-390-clean.png` |
| `/articles/tags/` | `articles-tags-1440-clean.png` | `articles-tags-390-clean.png` |
| `/articles/claude-code-workflow/` | `articles-claude-code-workflow-1440-clean.png` | `articles-claude-code-workflow-390-clean.png` |
| `/articles/agent-sdk-system-reminder-diff-fix/` | `articles-agent-sdk-system-reminder-diff-fix-1440-clean.png` | `articles-agent-sdk-system-reminder-diff-fix-390-clean.png` |
| `/work/` | `work-1440-clean.png`（最後到 `/about/#public-output-title`） | `work-390-clean.png`（最後到 `/about/#public-output-title`） |
| `/privacy/` | `privacy-1440-clean.png` | `privacy-390-clean.png` |
| `/confirm-subscription/` | `confirm-subscription-1440-clean.png` | `confirm-subscription-390-clean.png` |
| 404 `/does-not-exist/` | `not-found-1440-clean.png` | `not-found-390-clean.png` |

### 狀態與嚴重度

- **Observed**：在截圖、local route 或 source 中直接看得到／讀得到。
- **Inferred**：由結構、文案與視覺行為合理推得，但不是 runtime 事實。
- **Not verified**：本次沒有足夠證據，不作為通過或失敗結論。
- **P0**：阻斷主要任務或造成不可接受的錯誤。
- **P1**：明顯破壞閱讀、可信度、發現性或核心品牌敘事，應優先修正。
- **P2**：可用但降低品味、效率或一致性，排入下一輪。
- **P3**：細節 polish 或需產品決策後才處理。

## 跨頁設計判斷

### 1. 品牌連續性：人格已經成立，但頁面世界還沒有分化

**Observed**

- 正常內容頁共享 paper shell、nav／side rail、navy ink、purple accent、紙張雜訊與 clip edge。
- `about.astro`、`courses/index.astro`、`articles/index.astro` 都使用 `page-paper paper-card`，About 再使用 `paper-card--clip`／`paper-card--clip-left`。
- 文章 archive 使用紙張檔案索引；文章 detail 則使用暖白圓角卡、pastel tag pill、紫色 CTA／FAQ 卡、share／related／nav 卡。
- 這些共同元素讓訪客不容易迷路，也保留「一個人整理過的工作檔案」感。

**Inferred**

目前的連續性主要來自共用表面，而不是每頁都用產品／內容本身生成一個不同的視覺動作。結果是 About、Courses、Articles 的內容差異比表面差異大；detail 文章又像另一個舊模板。這不是要拿掉紙張，而是要讓「紙」從背景變成負責某件事情的媒介：About 可是公開檔案，Courses 可是學習路徑，Articles 可是索引與研究筆記，detail 可是可標註的實驗紀錄。

**Not verified**

- 尚未在 production build／正式網域確認字體、圖像、CSS asset 與第三方 script 的實際快取及失敗 fallback。
- 尚未與真正的新訪客做 5 秒理解測試，無法量化每頁是否能立即回答「這裡可以得到什麼」。

**Severity：P1（設計系統）**

**保留**：紙張、navy ink、紫色判斷標記、serif display／sans body／mono metadata，以及不同頁面共享的「證據先於宣稱」人格。

**改善方向**：每頁保留最多一個主紙張動作，其他 section 用無框留白、線性檔案、底色區或圖片／圖表承擔層次。移除只負責「看起來像設計」的第二層英文小標與重複 clip；不要以同一個 `paper-card + clip + section-label` 公式處理所有內容。

**驗收條件**：設計 review 能清楚回答每個頁面「紙張在這頁負責什麼」；同一頁的紙張、線、卡片、貼紙不超過 2–3 種表面語法；About／Courses／Articles／Article detail 在不看 URL 的情況下仍有共同人格，但能靠敘事動詞分辨。

### 2. 字體角色與文案：真人語氣大致存在，小標與模板句仍太多

**Observed**

- 主標多以完整句或語意換行呈現，例如 About「我從工程出發，所以不把『AI 成功一次』當成完成」、Courses「不用照順序學，先補你現在缺的那一塊」、Articles「先找到最接近你問題的那篇文章」。
- About 的「功能能跑只是開始」「沒有做過的，不假裝熟悉」「先讓東西被人用一次」有明確個人判斷，不像一般服務頁口號。
- Courses 的四種情況直接說出讀者會遇到的問題，文章標題也有具體技術對象（Astro、Agent SDK、JSONL、C26）。
- 同時跨頁反覆出現 `section-label`、`about-kicker`、`CHOOSE ONE`、`ALL TAGS / 29`、`EMAIL UPDATES`、`PUBLIC RECORD`、`FEATURED DOSSIER` 等英文／小型標記。
- 「先…再…」「從…一路…」「想繼續讀…」的句式在多頁反覆使用；有些是有效的路徑說明，有些已接近模板填空。

**Inferred**

真正有價值的是長標題和 evidence copy，最弱的是位於標題上方、沒有額外資訊責任的小字。小字太多會把讀者注意力切成「裝飾層／內容層」，讓本來自然的句子看起來像 UI copy。這正是 Design Director 所禁止的 default eyebrow／kicker／overline 慣性。

**Not verified**

- 尚未完成正式的繁體中文 copy edit／用詞一致性 review。
- 尚未依不同受眾（陌生訪客、已在用 Claude Code 的人、團隊主管、課程既有學員）做文案 comprehension test。

**Severity：P1（內容與層級），P2（小標清理）**

**保留**：以第一人稱講判斷、以真實問題開門、把結果與限制一起說、語意換行而非任意視覺斷句。

**改善方向**：每一個小字先問「它是否告訴讀者一件主標沒有告訴他的事？」若答案是否定，刪除。將英文小標限縮為功能性資訊（日期、分類、狀態、資料來源、數量），不要把 `PUBLIC RECORD`／`FEATURED DOSSIER` 當氣氛貼紙。對重複的「先…再…」做一次整站 copy pass，保留真正描述行動順序的句子，其餘改為更具體的結果或直接刪除。

**驗收條件**：任一 section 去掉 kicker 後，讀者仍能理解內容且視覺不塌；新增小標必須能被 accessibility／內容 review 指出功能；每頁首屏在 5 秒內可讀出「CabLate 是誰、我能得到什麼、下一步去哪裡」。

### 3. 紙張容器與裝飾：可保留，不能讓所有內容變成紙張牆

**Observed**

- About 幾乎每個主要段落都是紙張 card；Courses 的 hero、learning map、CabAI onboarding 也是多張紙；Articles index 與 tags 是大紙張 shell。
- Courses learning map 內又疊上 `paper-label`、狀態 pill、黃色 lined solution paper、route action 的白紙背景與 border／shadow。
- About 的 channel actions、CabAI platform proof、CTA 等內容再套一層 border／radius／淡底色。
- Articles detail 的暖白 rounded card、FAQ 紫卡、recommend beige card、related／nav 卡造成另一種「卡片堆疊」。

**Inferred**

紙張本身不是問題；問題是同一個語彙同時承擔背景、區隔、提示、證據、CTA、狀態與裝飾。當每一段都像一張紙，紙張就不再指向「工作中的文件」，而只是背景 skin。這也讓讀者難以判斷哪個區塊最重要。

**Not verified**

- 尚未在低階手機或 Windows 高縮放確認紙張圖片／陰影的繪製成本。
- 未跑 computed-style／asset budget 盤點，不能宣稱紙張 texture 的 bytes 或 paint cost 已達標。

**Severity：P1（跨頁 art direction），P2（特定內卡）**

**改善方向**：保留最外層紙張，但讓內層多使用留白與 hairline divider；黃色紙只保留給「學完能帶走的結果」；purple card 只保留給真正需要對比／行動的 CTA。移除 `border + radius + paper image + shadow` 的重複組合，避免白紙卡套在米白紙卡裡。

**驗收條件**：每頁能畫出一個清楚的表面層級圖；最重要的內容只由一種強調方式突出；相鄰 section 不同時使用 clip、貼紙、粗框、圓角卡、底色卡五種語法。

### 4. 內容發現與 IA：入口有方向，跨頁回路仍不夠短

**Observed**

- Articles index 先提供四條「依問題開始」路徑，再提供 topic index 與其他 articles；這是目前最好的內容 discovery 結構。
- Tags index 列出 29 個標籤，desktop 兩欄、mobile 單欄；每列可進 tag route，但沒有搜尋、分組或依問題／工具／階段的二次導覽。
- Courses map 依「目前狀況」列出四條學習路徑；每條有具體 CTA 與 outcome，`authority.ts` 中四個 `href` 都有值，因此畫面上的「目前可開始」狀態實際上全部相同。
- About 的公開作品、課程與內容有證據，但從文章或課程回到相鄰證據的連結不總是就近出現。
- nav 的「作品與經歷」指向 `/about/#public-output-title`，而不是獨立 `/work/`。

**Inferred**

內容不是缺少，而是讀者要在 About／Courses／Articles／Tags 之間自己組合「我現在應該先看什麼」。Articles index 已有問題導向的雛形；應把這個 decision frame 延伸到 tags、article detail 與 About 的 evidence，而不是增加更多標籤。

**Not verified**

- 尚未用 analytics 或真實 click test 驗證最常用入口與 drop-off。
- 尚未確認正式部署是否提供 `/work/` 的 redirect status、canonical、sitemap 與外部書籤相容策略。

**Severity：P1（`/work/` route），P2（tags／跨頁 discovery）**

**改善方向**：先決定 `/work/` 是正式 canonical page、保留 redirect，還是移除入口；不要讓 route 名稱與內容 ownership 不一致。Tags 頁可增加少量功能分組（問題／工具／方法／結果）或從文章入口直接帶入 context，不要只是把 29 個名稱再排一次。Article detail 的 related links 應依「讀完這篇下一個合理問題」排序，不要只依模板插入。

**驗收條件**：任一入口最多兩次點擊可到「與目前問題相關的證據」；`/work/` 有一個可被搜尋／分享／canonicalize 的明確決策；tags 讀者能說出自己為什麼要點某個 tag，而不是只看到數字。

### 5. 動態、效能、無障礙：未見必然 page overflow，但長內容仍需實測

**Observed**

- 1440／390 的指定 route DOM checks 中，`document.documentElement.scrollWidth === clientWidth`，未見整頁水平溢出。
- 長文章 source 明確對 `pre` 與 table 使用 overflow／nowrap；這能避免 page-level overflow，但在 mobile screenshot 中表格內容被截於可視區，需要讀者橫向操作。
- `TableOfContents` 為 desktop sticky sidebar，在 `<=1024px` 隱藏；文章手機版沒有同等的可見目錄入口。
- 圖片 naturalWidth 在指定 routes 可載入；文章 banner 有 1200px source，mobile rendered 約 316×167。一般頁面主要圖片並非內容照片，只有 avatar／logo 等小圖。
- `NewsletterCTA` 載入外部 ConvertKit script；`formkit-alert-error` 的紅色區域在截圖中可見但內容是空的。
- native buttons／links 有可讀文字；清單中的每個 route 都只有一個 visible `h1`。本次沒有發現 unnamed visible links。

**Inferred**

目前沒有「整頁跑版」不代表長文章已經適合手機閱讀。對工程文章來說，證據本身就是 code/table；沒有顯示可橫滑的提示、替代摘要或可折疊閱讀方式，等於把重要 evidence 藏在不明顯的互動裡。TOC 直接消失也會令長篇定位成本變高。

**Not verified**

- 沒有跑 Lighthouse／WebPageTest／production waterfall，故不能宣稱 LCP、INP、CLS、third-party cost 或 texture bytes 通過。
- 沒有 keyboard-only、VoiceOver／NVDA、reduced-motion、focus-visible、colour contrast 完整測試。
- 沒有實際送出 ConvertKit 表單確認成功／錯誤／網路失敗／重複訂閱狀態。

**Severity：P1（文章 evidence／newsletter visual bug），P2（mobile TOC／code table affordance），P3（效能基線）**

**改善方向**：在 mobile 保留一個輕量「文章章節」入口（details／anchor drawer／可滑動章節列），在 code/table 上方明示「可左右滑動」或提供適合手機的 stack／摘要。修正 newsletter empty error state，使錯誤區未觸發時不佔位、不露紅框；送出失敗時才提供實際可讀訊息。最後以 production build 做 perf／a11y gate。

**驗收條件**：手機讀者不用猜就知道 code/table 可橫滑；長文可以在兩次互動內跳到任一 H2；表單初始狀態沒有空紅框，錯誤／成功訊息可被螢幕閱讀器讀到；prefers-reduced-motion 下沒有必要內容被隱藏。

## 逐頁／逐 section 審核

## `/about/`

### A. Hero：人物判斷與公開作品入口

**Observed**

- H1 是清楚的個人判斷：「我從工程出發，所以不把『AI 成功一次』當成完成。」
- 右側 lead、facts、referral、`先看公開作品` CTA 給出人物定位與下一步。
- `about-kicker`「關於 CabLate」功能較弱，主要是 page label。
- desktop 的左右分欄在 1440 清楚；390 會正常堆疊，語意換行仍可讀。

**Inferred**

Hero 已能把「我不是只會示範 AI，而是處理工程落地」說出來，是 About 最成熟的 section。若再增加更多標記或圖片，會稀釋標題與 CTA。

**Not verified**

- 未做首屏 5 秒理解測試與真正 CTA click path test。

**Severity：P2（小標），其餘通過方向**

**保留**：主標語意換行、facts、直接去 evidence 的 CTA。

**改善方向**：考慮刪除或弱化「關於 CabLate」小標，讓 H1 直接成為第一個讀取點；facts 只留讀者做判斷所需的 2–3 件事。

**驗收條件**：陌生訪客讀完 H1＋lead 能說出 CabLate 的工作方式，並知道可點「公開作品」驗證。

### B. Story：工程經驗如何變成方法

**Observed**

- H2「工程經驗讓我學會，功能能跑只是開始」明確建立判斷。
- 內文以第一人稱敘述，沒有過度銷售語氣。
- paper section 與 hero 表面連續，mobile 文字節奏可讀。

**Inferred**

內容方向正確，但 section 與後續 timeline 的紙張表面相同，讀者未必立即知道這裡是故事、下一段是證據時間線。

**Not verified**

- 未確認長文在 200% zoom 的行長與段落間距。

**Severity：P2**

**保留**：個人經驗→方法的因果敘事。

**改善方向**：用排版節奏（更寬的 opening、較細的 timeline divider）區分 story 與 timeline，避免再加 label。

**驗收條件**：不看小標也能從段落形狀與內容判斷「這是背景故事，不是產品卡片」。

### C. Turning points：時間線

**Observed**

- 4 個節點有具體轉折，h3 分別說明前端→全端→AI 應用→CabLate。
- mobile 可堆疊，節點／線仍可跟讀。

**Inferred**

時間線是人物可信度的重要證據，但每個節點的視覺重量相近；沒有明確指出哪個轉折最影響現在的工作方式。

**Not verified**

- 未確認 timeline 在 reduced-motion、focus navigation 或窄於 320px 的情況。

**Severity：P2**

**保留**：以經歷而非頭銜建立可信度。

**改善方向**：選一個「現在仍在使用的判斷」作為 timeline 終點／總結，減少四節點都像同等履歷 bullet 的感覺。

**驗收條件**：讀者看完能說出「這段經歷如何影響你今天處理 AI 工作」，不只記住年份／標籤。

### D. Public output：公開作品與證據

**Observed**

- H2「作品與經歷，都放在可以自己查的地方。」很符合 Director 的 evidence-first 原則。
- featured MCP work、supporting proofs、GitHub／Threads actions 具體而可查；source 中的代表作品與數字來自 `authority.ts` 靜態資料。
- 後段再接「課程與內容」與 CabAI platform proof，讓「做工具」與「整理成可學內容」相連。
- section 內有 channel actions、platform proof 等 border／rounded inner cards；mobile 變成長串 rows，資訊正確但密度高。

**Inferred**

這是 About 的核心成果區，卻被兩種問題拉低：證據類型太多（作品、社群、課程、平台）放在同一個大紙張裡；每一個 item 都有 metadata／label，使真正的結果沒有足夠留白。數字若沒有 fresh verification date，容易看起來像永遠有效的 badge。

**Not verified**

- 代表作品的 star／fork／日期未在本次 audit 對外部 GitHub 即時核對，只確認 source 中有 static copy。
- GitHub／Threads 的外部連結、UTM、開新視窗與返回流程未逐一測試。

**Severity：P1（核心 evidence 層級），P2（內卡裝飾）**

**保留**：可查連結、實作結果、限制／選擇的語氣。

**改善方向**：將「公開作品」與「課程／內容」拆成兩種證據節奏，給每類一個主結果句；把 channel actions 改成無框文字導覽或單一 action rail。所有會變動的數字加上「截至」日期或改成不需要假裝即時的描述。

**驗收條件**：桌面與手機都能在 10 秒內找到一個具體成果、證據連結與結果語句；讀者不必穿過四層 inner card 才能點到；靜態數字有來源／日期。

### E. Delivery：課程與內容

**Observed**

- H2 說明「把方法整理成別人可以學會的內容」，兩個 proof rows 有講座／手冊結果。
- CabAI platform proof 把試看、購買與更新說成同一個帳號承接，對產品交接有幫助。

**Inferred**

這段是從個人網站通往產品／課程的關鍵橋，但 visual weight 接近 Public output，導致讀者不易判斷要看作品、學方法還是註冊 CabAI。這裡需要清楚的「你可以帶走什麼」而不只是 delivery inventory。

**Not verified**

- 未測試未登入、已登入、已購課程三種 CabAI handoff 的實際內容與回返。

**Severity：P2**

**保留**：真實課程／講座結果與帳號承接資訊。

**改善方向**：將 proof row 句子改成結果導向（完成什麼、適合誰），CabAI 只做一個清楚的下一步，避免兩個同等 CTA。

**驗收條件**：讀者看完能分辨「公開成果」和「付費／帳號內容」，並知道要點哪個 action。

### F. Principles：工作原則

**Observed**

- 4 個原則以 2×2 grid 呈現，文案短而有個人判斷。
- mobile 單欄後仍可讀，無 page-level overflow。

**Inferred**

原則本身很好，是 About 最適合不用紙卡的 section；目前仍被 paper section＋kicker 包住，與其他資料區的表面相同。

**Not verified**

- 未做原則是否能被首頁／服務／文章引用的 cross-link review。

**Severity：P2**

**保留**：短句、可被其他頁引用的判斷。

**改善方向**：讓原則成為一個無框「判斷索引」或邊欄，並從每則原則連至一個真實 evidence，而不是只停留在宣言。

**驗收條件**：每個原則至少對應一個公開作品／文章／課程證據；視覺上與 evidence list 有明確層級差。

### G. Next：下一步

**Observed**

- H2 同時涵蓋課程、手冊、公開內容與一起看問題；兩個 CTA 提供探索／合作方向。
- mobile stack 清楚，沒有多餘互動。

**Inferred**

語意完整但句子偏長，且「課程、手冊、公開內容、一起看問題」四個入口在一句內競爭。它適合當 summary，但需要一個主動作。

**Not verified**

- 未以陌生訪客確認兩個 CTA 的優先順序。

**Severity：P2**

**改善方向**：只選一個主要 next action，另一個降為文字連結；H2 保留結果導向，細節放在 action label，不在標題塞完整 IA。

**驗收條件**：使用者能快速回答「我現在該點哪一個」，且不用讀完整段落才知道差別。

## `/courses/`

### A. Hero：先補缺口

**Observed**

- H1「不用照順序學，先補你現在缺的那一塊」清楚反轉傳統課程目錄，CTA 有方向。
- mobile hero 可讀，語意換行自然。

**Inferred**

這是一個好的 learning product proposition；後續 learning map 應該延續「先判斷缺口」而不是變成完整課程 catalogue。

**Not verified**

- 未測試 CTA 是否會把讀者帶到最符合問題的 route。

**Severity：P2（小標）**

**保留**：problem-first headline、直接進入 map 的入口。

**改善方向**：弱化「學習內容」英文／kicker 層，讓問題導向標題成為唯一第一層。

**驗收條件**：訪客能理解這不是課程列表，而是依目前問題選起點。

### B. Learning map：四條路徑

**Observed**

- H2「先看你現在是哪一種狀況」與四個具體 situation title 形成合理 decision frame。
- 每條 route 有狀態 `目前可開始`、solution card（`開始後先做到什麼`）、outcome 與 CTA；source 中四條 `href` 都有值。
- desktop 的 rail／number／body／solution card 關係清楚；mobile 變成長串垂直 checklist。
- mobile 同時出現 outer paper、vertical numbered rail、status pill、yellow solution paper、white route button，表面語法偏多。

**Inferred**

內容判斷已經比一般「課程卡片」強，但「目前可開始」在四條都成立時不是決策資訊；它會搶走更有價值的狀況描述。`CHOOSE ONE` 只是裝飾性微文案。四條等權呈現也沒有告訴讀者如果仍不確定要先走哪條。

**Not verified**

- 未做不同 route 的 conversion／選擇錯誤率測試。
- 未確認「尚未開放」狀態日後是否會與已開放狀態並存。

**Severity：P1（核心選擇層級），P2（surface／microcopy）**

**保留**：以讀者症狀命名 route、每條給 first outcome、可直接開始。

**改善方向**：若目前全部開放，移除重複的 `目前可開始`，把可用性放到 CTA；把 yellow card 限定為每條真正的 first outcome，其他 metadata 改成小型但有功能的內容。增加一個「不確定時先做問題診斷」的 single fallback，避免四個等權入口讓人停住。手機優先採單一 rail＋分隔線，不要每條再疊紙張。

**驗收條件**：讀者能在 5–10 秒內選一條；每條 route 有獨立「遇到什麼→先帶走什麼→下一步」；非必要小標移除後內容仍完整；mobile 一屏內至少可看懂一條 route 的完整關係。

### C. CabAI onboarding：帳號承接

**Observed**

- H2 說明免費試看、已購課程、後續更新都在 CabAI 帳號；CTA 是建立免費帳號。
- mobile 清楚但 section 仍是內嵌紙卡＋border 的產品 proof。

**Inferred**

這段提供很必要的 delivery context，但目前比較像補充說明，不像一個被設計過的 handoff。訪客還不知道建立帳號後第一個可完成的動作。

**Not verified**

- 未登入／已登入／已購狀態 handoff 未實測。

**Severity：P2**

**改善方向**：在不增加長文的情況下，加入一個具體 first result（例如「建立帳號後先看哪一課／哪一份試看」），並把 CabAI 外部連結／歸屬明示。

**驗收條件**：使用者知道註冊不是終點，且能預期註冊後的第一個畫面／結果。

## `/articles/`

### A. Hero：文章索引的入口

**Observed**

- H1「先找到最接近你問題的那篇文章」直接處理 discovery 任務。
- 四條「依問題開始」route 是有上下文的入口，而不是按日期倒排。
- desktop／mobile 皆可讀，page-level width 正常。

**Inferred**

這是目前最接近 Director 要求的「先設計讀者心理路徑，再決定 section」頁面：問題→文章→主題→其他實作。它可作為其他內容入口的參考。

**Not verified**

- 未驗證每條 route 實際導向的文章是否足夠代表該問題。

**Severity：P2（可再深化）**

**保留**：問題導向、四條路徑、自然標題。

**改善方向**：將每條 route 的 outcome 再說具體一點（讀者看完能完成什麼），並在 route／topic 之間建立不重複的優先順序。

**驗收條件**：首次訪客不看 tag 也能找到一篇可讀文章；每個問題入口能解釋為何從這篇開始。

### B. Topic index

**Observed**

- 有「想繼續讀同一個主題」的二次入口與 tags link。
- desktop 空間較充足，mobile 變成較短的 section，和前後內容以相同紙張表面區隔。

**Inferred**

Topic index 的目的正確，但與 `/articles/tags/` 的關係較像兩個入口重複提供索引，尚未明確說明「主題」與「標籤」的差異。

**Not verified**

- 未追蹤 topic → tag → article 的實際 click path。

**Severity：P2**

**改善方向**：選一個作主導覽；另一個應負責不同任務，例如 topic = 問題／方法群組，tag = 精確技術詞。不要只換標題再列同一批資訊。

**驗收條件**：讀者能用一句話說出 topic 與 tag 的差別；兩者點進去後有不同的 content discovery value。

### C. Other articles

**Observed**

- 其他實作筆記以列表呈現，三篇標題具體，包含 OpenClaw、Agent SDK、Anthropic radar。

**Inferred**

這是有效的 long-tail evidence，但與四條問題入口沒有「為什麼現在推薦這幾篇」的關係。

**Severity：P3**

**改善方向**：改成「最近新增」或「同樣會遇到的下一個問題」，擇一說清楚排序邏輯。

**驗收條件**：列表 heading 能解釋選文原則，不靠「其他」當收納桶。

## `/articles/tags/`

### Tag archive

**Observed**

- H1「沿著標籤繼續讀」，29 tags；desktop 兩欄、mobile 單欄。
- each row 有 tag name、文章數與可點擊 arrow；可通往 `/articles/tag/...`。
- `ALL TAGS / 29` 與 `{tags.length} 個標籤・{published.length} 篇文章` 是真實 count，具備資訊責任，不完全是裝飾。
- mobile 長列表可讀但很長，視覺節奏幾乎相同。

**Inferred**

這頁完成了「所有 tags 可查」的技術任務，未完成「我應該從哪個主題開始」的編輯任務。數字目前像排序 index／badge，若是文章數應直接寫「2 篇」而不是讓讀者猜。

**Not verified**

- 未測試 29 tags 的排序是否按文章量、字母、更新時間或人工順序。
- 未測試空 tag、0 篇 tag、非常長中文 tag 的 fallback。

**Severity：P2（discovery），P3（count copy）**

**保留**：完整可查的 tag archive、每列直接進入內容。

**改善方向**：加入 3–5 個內容群組或一個簡單 filter／search；把 count 改為讀者語言（`2 篇文章`）；提供「如果你是因為 X 來的，先從 Y 開始」的少量編輯入口，避免全靠列表。

**驗收條件**：mobile 在 10 秒內能找到與目前問題相關的一群 tags；每個數字不會被誤解為序號；0／1／多篇狀態文案一致。

## 代表文章 detail 1：`/articles/claude-code-workflow/`

### Header／banner／body

**Observed**

- 標題、category、date、update、reading time、tags、banner 形成完整文章 header；serif title 在 desktop／mobile 可讀。
- 內容有 Astro 選型、實際工作流、SEO、設計改版、AI 做得好／不好、結論；段落、清單、table、code block 具體。
- desktop 有 sticky TOC；mobile TOC 隱藏。
- banner 1200px 圖片有 alt，但視覺較像 generic AI/code illustration，不是實際 source／網站證據。

**Inferred**

文章的內容證據比 visual 顯示更成熟。banner 若只是氣氛圖，會削弱「我真的做過這個網站」的可信度；可改為實際頁面局部、commit／檔案流程圖，或明確 caption 為示意。

**Not verified**

- 未核對 banner 的授權／生成來源與 production CDN。
- 未在 320px、200% zoom、reduced-motion、鍵盤下測試。

**Severity：P1（mobile navigation／evidence affordance），P2（hero image）**

**保留**：具體工作流、限制段落、實作 code／table。

**改善方向**：mobile 提供可展開的「文章章節」；在 table／pre 前提供明示操作提示與可讀摘要；banner 改為 content-native evidence 或加 caption。

**驗收條件**：手機讀者可在不回頂的情況下找到章節；關鍵比較不需猜可橫滑；圖片能回答「這張圖證明什麼」。

### Newsletter CTA

**Observed**

- 文案「有重要更新時，再寄信告訴你」自然、低壓；input 有 label／aria-label，placeholder 為 `name@example.com`。
- clean screenshot 中 form 下方仍看到空的紅色 `formkit-alert-error` 區域；source `NewsletterCTA.astro` 對該 selector 直接設紅色 border／background。

**Inferred**

無內容的紅色錯誤區會讓訪客以為表單已失敗或頁面尚未完成，尤其在一篇談工程品質的文章底部更傷可信度。

**Not verified**

- 未送出空 email、格式錯誤、成功、重複 email 與第三方 script timeout。

**Severity：P1**

**改善方向**：初始狀態 `display:none`／不保留 layout space；只有有錯誤文字時顯示，並在 label／`aria-live` 中讀出實際訊息。

**驗收條件**：初始截圖無空紅框；錯誤狀態有可理解的繁中原因與修正方式；成功狀態不與錯誤色混淆。

### Related／recommend／FAQ／article nav／comments

**Observed**

- detail 末尾依序堆疊 product recommend、FAQ、share、related、previous／next、comments、back。
- 內容都能用，但 visual system 多為 rounded pastel／purple cards，長文之後形成長串同質卡片。

**Inferred**

這些元件像全域模板附加物，不像根據「讀者讀完這篇要做什麼」重新排序。文章的最後一個記憶點可能從結論轉成很多卡片。

**Severity：P2**

**改善方向**：最多保留一個主要 next action、一個相關閱讀路徑；FAQ 只在文章本身有未解決的高頻問題時顯示。Share／comments 降到次要層。

**驗收條件**：文章結尾有單一主動作，其他模組不競爭；在 mobile 不需滑過一大段模板卡才離開。

## 代表文章 detail 2：`/articles/agent-sdk-system-reminder-diff-fix/`

### Header／technical evidence

**Observed**

- 標題直接指向 Agent SDK、C26、JSONL；正文有 readFileState、收集條件、sanitizeJsonl、整合與代價。
- source path／function name／條件描述讓文章具備可核查的工程證據；不是泛泛談 AI。
- mobile 長 code／table 同樣需要橫向操作；TOC 同樣被隱藏。
- banner 是 code／security symbolic illustration，和 C26 機制沒有直接畫面證據關係。

**Inferred**

這篇最應該呈現「我如何從症狀追到機制、如何驗證 workaround、代價是什麼」。目前資料有做到，視覺仍使用與上一文相同的 banner／detail template，沒有把 diff／JSONL 的特徵變成專屬 visual prop。

**Not verified**

- 未依外部 upstream version 重現 C26 行為，本文技術正確性不在本次 design audit 範圍。
- 未測試 code copy／download／syntax highlight 在各瀏覽器的可用性。

**Severity：P1（mobile evidence navigation），P2（page-specific art direction）**

**改善方向**：使用小型 JSONL／diff visual、實際 sanitized before／after 摘要或可折疊 evidence block，取代 generic banner；文章最後把「這個 workaround 的代價」提升為主要判斷，而不是藏在普通 heading。

**驗收條件**：不看 generic illustration，讀者仍能由 visual hierarchy 快速理解「注入在哪裡、如何繞過、代價是什麼」；mobile code/table 有清楚操作 affordance。

## `/work/`

### Route ownership／redirect

**Observed**

- request `http://127.0.0.1:4322/work/` 回應 200，但 browser 最終 URL 是 `http://127.0.0.1:4322/about/#public-output-title`。
- `src/config/authority.ts` 的 nav「作品與經歷」同樣指向 `/about/#public-output-title`。
- `src/archive/work.astro` 存在一套完整的 work page source（含 hero、selected work、proof、service bridge），但它不在目前 `src/pages` 可發布 route 之下。
- 因此 `work-1440-clean.png`／`work-390-clean.png` 實際是 About 對應 anchor 的 capture；390 capture 在 full-page／redirect anchor 狀態下可能出現重複 shell／中段跳位，不能當作獨立 work page 的 visual review。

**Inferred**

這是 route／IA 決策未收斂，不是單純 CSS 問題。若 About 是公開作品的 canonical container，應讓 `/work/` 明確 redirect 並在 metadata／sitemap／外部分享上保持一致；若產品仍需要「作品與經歷」作為獨立任務，就應正式發布 archive source，而不是讓訪客進入不存在的 route 再跳頁。

**Not verified**

- 未確認 server 端實際是 301／302／Astro client redirect、是否有 canonical、是否處理 trailing slash／old bookmarks。
- 未核對 search engine index 與 external inbound links。

**Severity：P1（資訊架構／SEO／外部分享）**

**保留**：About 的公開 evidence anchor；`src/archive/work.astro` 中「結果／問題／關鍵判斷」的內容模型值得保留。

**改善方向**：由產品 owner 做一次 route decision：A. `/about/` 是唯一 canonical，正式設定 redirect／canonical／nav label；或 B. 發布 `/work/`，讓它成為 case-file page，再把 About 改為摘要入口。不要同時保留兩個 ownership。

**驗收條件**：`/work/` 的 status、最終 URL、canonical、nav、sitemap、screenshot 一致；分享 URL 能直接回答「這是作品列表還是 About」。

## `/privacy/`

### Policy document

**Observed**

- H1「隱私權政策」與 6 個 H2（資料收集、服務申請與 Email、Cookie、第三方、更新、聯絡）形成清楚文件結構。
- desktop／mobile 皆可讀，正文 plain-language 程度比法律模板好；email／Threads contact 可操作。
- 主文是白色 rounded card＋border，不使用其他內容頁的紙張 clip／texture；footer 仍回到 site shell。

**Inferred**

低裝飾的白色文件 surface 對法律／信任內容是合理的，甚至避免把政策做成裝飾物。但目前和其他頁的 paper identity 有表面落差；可保留「法律文件 mode」，只需讓 header／spacing／ink 更明確連回 CabLate，而不是加紙張貼紙。

**Not verified**

- 未核對政策文字是否涵蓋目前所有 analytics、ConvertKit、Giscus／第三方服務實際資料流。
- `最後更新：2026 年 8 月` 的日期與 deployment version 未外部驗證。

**Severity：P2（brand surface），P1 取決於 legal completeness（本次不判定）**

**保留**：清楚章節、聯絡方式、低裝飾文件感。

**改善方向**：不增加裝飾；補足或核對第三方服務資料責任，並提供目錄／回到頂部 only if document length grows。

**驗收條件**：政策列出的資料服務與 runtime 一一對應；使用者能找到更新日期與聯絡方式；200% zoom／手機閱讀不需要橫滑。

## `/confirm-subscription/`

### Confirmation result

**Observed**

- H1「訂閱確認完成」直接說明結果，正文與兩個 CTA（回文章／回首頁）簡潔。
- desktop／mobile paper card 清楚；CTA 在 mobile 會堆疊，page-level width 正常。
- `EMAIL UPDATES` 是英文小標，主要作用是裝飾／分類，主結果本身已足夠。

**Inferred**

這頁是 transaction result，不需要像 About 一樣講品牌故事；現在的簡潔是優點。唯一缺的是「接下來會收到什麼、何時收到」的預期若產品流程需要。

**Not verified**

- 未從真實 email confirm link 走完整流程。
- 未測試失效 token、重複確認、未訂閱狀態。

**Severity：P2（kicker），P3（流程狀態）**

**保留**：結果先講、兩個清楚返航 action、低內容量。

**改善方向**：刪除 `EMAIL UPDATES` 或改成真正有功能的狀態資訊；若實際會寄出 welcome／下一封信，補一句可預期內容，不要加裝飾段落。

**驗收條件**：使用者只看 H1＋一段 copy 就知道完成了什麼、下一封信預期為何、可以去哪裡繼續。

## 404：`/does-not-exist/`

### Recovery page

**Observed**

- arbitrary unknown route status 404；H1「這個頁面目前不存在」清楚。
- `先做工作流健檢` 是 product-native primary recovery，另有學習內容／回報失效連結；mobile 可讀。
- paper card、clip、vertical 404 讓錯誤頁仍有 CabLate identity。
- `PAGE NOT FOUND` 是功能性狀態 label，比一般裝飾小字更合理，但不應取代中文 H1。

**Inferred**

這是目前最好的一個「保留表面、減少內容」頁面。它沒有塞熱門文章或所有 nav， recovery path 很明確。

**Not verified**

- 未測試回報失效連結的實際表單／mailto／issue flow。
- 未測試 referrer、query string 或 server-rendered 404 metadata。

**Severity：P2（小 polish）**

**保留**：清楚錯誤、單一主要 recovery、紙張 identity。

**改善方向**：確認 `回報失效連結` 不會導到空動作；若無法接收回報，改成明確 email／Threads link。保留 `PAGE NOT FOUND` 只作狀態，不再加其他英文貼紙。

**驗收條件**：任一失效 URL 都回 404 且保留原始 request context；主要 CTA 可完成下一步；回報 action 可真的送出或清楚說明替代方式。

## Anti-copy／風格風險檢查

本次不是以「像不像 Made By Pan」判斷，而是檢查是否把參考能力誤變成表面模板。

### 已成功抽象的能力

- **心理路徑先於 section**：Articles 的「依問題開始」與 Courses 的 situation map 先回答讀者狀態，再推薦內容。
- **結果先於自我介紹**：About public output 不只列身份，而是放可查作品、課程結果與公開記錄。
- **字體角色而非固定字體**：serif 做判斷／標題，sans 做敘述／body，mono 做 metadata／技術資訊。
- **語意換行與文字構圖**：H1 phrase spans 有意義地控制節奏，而不是在逗號後任意斷行。
- **產品物件成為視覺道具**：文章的 code、table、diff、route、evidence row 已有可發展的產品語彙。
- **手機重新排版**：大多數 page-level container 沒有被縮放到 overflow，主要 layout 能 stack。

### 目前仍有表面模仿／模板殘留風險

- **紙張＋clip 全站同構**：若每頁都使用相同 paper card／貼紙／英文 label，設計能力會被讀成一個可複製 skin。
- **泛用 editorial microcopy**：`CHOOSE ONE`、`PUBLIC RECORD`、`FEATURED DOSSIER`、`EMAIL UPDATES` 若沒有內容責任，會落入「看起來像有品味」的小字模板。
- **固定 pastel／purple card stack**：文章 detail 的 newsletter／recommend／FAQ／related／nav 如果全部用相同圓角卡，會像通用 SaaS article template。
- **generic hero image**：用 AI／code stock illustration 取代實際 evidence，會削弱「從產品本身生成視覺世界」的要求。

### 下一輪每個視覺決策都要留下的轉換記錄

| 參考到的能力 | CabLate 的抽象轉換 | 明確排除 |
|---|---|---|
| 用一個大標題建立讀者心理入口 | 從具體症狀／成果寫 H1，再用 evidence 支撐 | 直接複製黑白大字、固定句型 |
| 用編排與留白製造張力 | 讓紙張承擔「公開紀錄／結果」責任，其他 section 用留白／線 | 每段都加紙張、clip、角落貼紙 |
| 產品物件成為視覺道具 | 用 diff、JSONL、課程路徑、公開數字做圖像／結構 | 泛用 AI 大腦、程式碼 stock 圖 |
| 動態揭露／推進 | 只在有順序或驗證意義的 route／evidence 使用 reveal | 為了像參考網站而全站加 scroll animation |
| 自然文案 | 用第一人稱判斷＋具體結果＋限制 | `最好的解決方案`、`開始你的旅程` 等模板口號 |

## 優先工作清單

### P1：先修

1. 修正 `NewsletterCTA` 空紅色 error slot；確認初始／錯誤／成功／第三方失敗四種狀態。
2. 為長文章 mobile 加章節入口與 code/table affordance；不能只靠 desktop TOC 和隱性 horizontal overflow。
3. 決定 `/work/` canonical ownership，清理 redirect／nav／sitemap／metadata 的不一致。
4. 以 section responsibility 重畫 paper surface：保留外層紙張，但刪除無責任的小標、重複 clip、內層白紙卡與模板 pastel stack。
5. 讓 About public output 的成果、來源、日期、CTA 成為一條可掃讀的 evidence line，不要讓課程／平台／社群資訊互相稀釋。

### P2：第二輪

1. Courses map 移除四個重複 `目前可開始`（若目前全開放），改成一個不確定時的 fallback。
2. Tags 加少量問題／工具／方法群組或 context filter，將文章數直接寫成讀者語言。
3. Article detail 依文章內容生成 visual prop：workflow article 用實際建站證據，Agent SDK article 用 diff／JSONL before-after；generic banner 降級為 captioned illustration 或移除。
4. About timeline／principles／next 以版型與 evidence link 分化，不再只靠同一種紙張卡做區隔。
5. Privacy／Confirmation 保留低裝飾 mode，補足與 runtime data flow／email flow 相符的內容狀態。

### P3：驗收基線

1. production build 跑 Lighthouse／WebPageTest，記錄 LCP、INP、CLS、JS／image／font bytes、third-party cost。
2. keyboard-only、focus-visible、200% zoom、screen reader、reduced-motion 逐 route QA。
3. 真實新訪客 5 秒理解與「我現在應該點哪裡」測試。
4. 追蹤 Articles route、Tags、Courses route、About evidence CTA 的 click path，依結果調整 IA，不用直覺堆更多導覽。

## 實際讀過的 skill／reference

本次實際完整讀取：

- `C:\Users\user\.codex\skills\cablate-design-director\SKILL.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\design-language.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\case-cablate.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\output-contracts.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\implementation-guardrails.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\anti-copy.md`
- `D:\_CabLate_Agents\coder\.agents\skills\modern-web-guidance\SKILL.md`

`modern-web-guidance` 的本次查詢主題為「responsive editorial copy with author-controlled semantic line breaks and unboxed paper texture layout」。結果建議短標題才使用 targeted `text-wrap: balance`，不要全域套用；作者控制的語意換行在短標題可成立。本 audit 將其作為換行／文字排版觀察的技術基線，不把它當成視覺風格模板。

## Audit boundary

本文件是設計／內容／IA 的唯讀審核，不是 source fix plan。它沒有修改任何 `src`、沒有安裝 dependency，也沒有把未做的 performance／a11y／external integration 測試寫成已通過。下一步若要實作，應依 P1 順序把每個改動拆成可驗收的 change contract，再逐 section 重新截圖驗證。
