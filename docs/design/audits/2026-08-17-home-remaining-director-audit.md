# CabLate 首頁後半段 Design Director 夜間審核

> 先做決策：請讀[首頁後半段決策版](./2026-08-17-home-remaining-decision-brief.md)。本文件保留完整證據與逐 section 判斷。

日期：2026-08-17  
模式：Audit（唯讀；本次沒有修改 source）  
範圍：首頁「你是不是也遇過這幾種情況」之後的 route、identity、CabAI、newsletter 與 footer  
排除：hero 與 diagnostic trace 的設計審核；它們只在整頁截圖中作為上下文保留

## Outcome

目前後半段的資訊與連結都能使用，1440／760／390 三個寬度也沒有頁面級水平溢位；但 dark diagnostic 結束後，頁面重新變成連續的紙張卡片，敘事沒有繼續推進。Route 重複 diagnostic 的第一個行動，identity 只有抽象自我宣告而沒有產品證據，CabAI 變成內部功能清單，newsletter 與 footer 又把同一套紙面延長。

最值得先處理的不是再加動畫，而是：

1. 把 route 改成真正的「下一步選擇」而不是三列帶編號的 CTA。
2. 讓 identity 以一個真實公開產出建立信任，並重寫成自然的人話。
3. 把 CabAI 改成清楚的 hand-off：讀者為什麼要離開、到了能拿到什麼、第一步是什麼。
4. 收斂紙張的使用，避免首頁後半段成為 paper-card wall。
5. 修正 newsletter email 欄位的鍵盤 focus 可見性。

沒有 P0 阻斷問題；P1 主要是敘事、品牌辨識與一個可及性風險，P2 是語意、裝飾與效能整理。

## Evidence boundary

### Observed（直接看到或由目前 source 確認）

- 實際開啟 `http://127.0.0.1:4322/`，以 1440、760、390 viewport 截圖；截圖前以 `cablate_analytics_consent_v1=denied` 關閉分析同意浮層，並移除 Astro dev toolbar，避免把開發工具誤判成產品 UI。
- 1440、760、390 的 `document.documentElement.scrollWidth` 都等於 viewport width；未觀察到 page-level horizontal overflow。
- Route 是三個 `<article>` 選項、01／02／03 編號、三個 CTA；第一列使用紫色底色與深色主要按鈕。
- Identity、CabAI、newsletter 與 footer 都以同一份 paper surface 呈現。CabAI 另有紙夾 pseudo-element。
- Identity source 內明確留下 `proof-slot: intentionally not rendered until a Claim Registry row is approved`，目前畫面因此沒有 inline proof object。
- Newsletter 表單有可見 `<label>`、email type、`autocomplete="email"`、live error list；但其 input 的 `:focus` 規則把 outline 設成 none，box-shadow 只有 4% 黑色。
- 首頁初始載入會請求 `https://f.convertkit.com/ckjs/ck.5.js`；這是目前可觀察到的第三方表單 script，並非新增 dependency。
- CabAI CTA 使用 `withCabAiAttribution(..., 'home_cabai_delivery')`，source 會保留跨站 UTM hand-off。
- 目前 lower sections 沒有需要時間變化的主要動畫；這本身不是缺陷，靜態優先符合「只有時間變化能增加理解時才加動態」。

### Inferred（設計判斷或由多個跡象推論）

- 讀者在 diagnostic 後最需要的是「我接下來選哪條路」與「為什麼相信你」，不是再看一次相同問題的 CTA。
- 01／02／03 在目前內容中不是步驟，而是三個互斥入口；編號會暗示錯誤的先後順序，也讓小字承擔裝飾多於資訊。
- Identity 的核心 claim 目前靠語氣成立，沒有就地的案例、repo、產出或可驗收結果支撐，因此信任段落的證據密度不足。
- CabAI 的 `Library／Skill／課程／已購內容／學習狀態／Agent API` 是系統內部分類；若放在第一層，讀者會先讀產品名詞，而不是先理解能得到的結果。
- 紙張是 CabLate 的真實品牌資產，但在 route、identity、CabAI、newsletter、footer 連續使用同一種 surface，會把紙張從「資訊載體」降成全站預設容器。

### Not verified（本次沒有宣稱已通過）

- 真機 Safari／Android、橫向 mobile、Lighthouse／Core Web Vitals、實際媒體傳輸量與字型傳輸量。
- 完整 screen reader reading order、mobile menu 開啟／關閉後的讀屏行為、表單送出成功與錯誤狀態。
- Production `cablate.com` 與本地 4322 版本是否完全一致。
- CabAI 實際可公開的免費內容入口與最適合 hand-off 的第一個 landing state。
- 本次沒有重新開 Made By Pan 做 fresh visual comparison；anti-copy 判斷限於既有研究規則、CabLate 自身重複與通用 AI 模板風險。

## Surface inventory and visual evidence

所有 full-page screenshot 都是相同 source、相同 consent-denied 狀態；section crop 是直接對 DOM section 截圖。

### Full page

- [1440 full page](../../../artifacts/night-audit/home-remaining/home-clean-desktop.png)
- [760 full page](../../../artifacts/night-audit/home-remaining/home-clean-tablet.png)
- [390 full page](../../../artifacts/night-audit/home-remaining/home-clean-mobile.png)

### Section crops

| Section | 1440 | 760 | 390 |
|---|---|---|---|
| Route | [desktop](../../../artifacts/night-audit/home-remaining/desktop-route.png) | [tablet](../../../artifacts/night-audit/home-remaining/tablet-route.png) | [mobile](../../../artifacts/night-audit/home-remaining/mobile-route.png) |
| Identity | [desktop](../../../artifacts/night-audit/home-remaining/desktop-identity.png) | [tablet](../../../artifacts/night-audit/home-remaining/tablet-identity.png) | [mobile](../../../artifacts/night-audit/home-remaining/mobile-identity.png) |
| CabAI | [desktop](../../../artifacts/night-audit/home-remaining/desktop-cabai.png) | [tablet](../../../artifacts/night-audit/home-remaining/tablet-cabai.png) | [mobile](../../../artifacts/night-audit/home-remaining/mobile-cabai.png) |
| Newsletter | [desktop](../../../artifacts/night-audit/home-remaining/desktop-newsletter.png) | [tablet](../../../artifacts/night-audit/home-remaining/tablet-newsletter.png) | [mobile](../../../artifacts/night-audit/home-remaining/mobile-newsletter.png) |
| Footer | [desktop](../../../artifacts/night-audit/home-remaining/desktop-footer.png) | [tablet](../../../artifacts/night-audit/home-remaining/tablet-footer.png) | [mobile](../../../artifacts/night-audit/home-remaining/mobile-footer.png) |

## Current Design Read

這段首頁的受眾已經被 diagnostic 說中，接下來應該完成：

> 看見自己卡在哪裡 → 選一條適合的下一步 → 相信 Cab 有做過與查過 → 必要時交接到 CabAI → 留下低承諾的關係

目前實際呈現比較像：

> 三個入口卡片 → 一句 CabLate 立場 → CabAI 功能總表 → 電子報表單 → 同一張紙的 footer

所以問題不是內容完全缺失，而是每個 section 都有內容，卻沒有用不同的 layout family、proof object、density 或 material 推進新的心理 beat。

## Preserve

| 保留項 | 為什麼保留 | 證據 |
|---|---|---|
| Route 的三種路徑 | 它確實把「自己查／自己學／找人一起看」變成可選入口 | route source 117–130、三個可用 href |
| Identity 的 serif assertion + sans body | 符合 CabLate 既有 assertion／narrative type roles | screenshot 與 source 134–139 |
| CabAI 跨站 hand-off | 是 CabLate 的 routing role，不應被刪掉 | `withCabAiAttribution` 與 UTM campaign `home_cabai_delivery` |
| Newsletter 的真實承諾 | 新課程、手冊、公開活動、研究上線時通知，且說明確認信與退出方式 | `Newsletter.astro` 5–15 |
| Footer 的兩組 nav | 「內容與服務／外部連結」是讀者需要的定位資訊，不屬於裝飾小字 | `BaseLayout.astro` 148–158 |
| 紙張、Noto Sans／Serif／mono 分工 | 是 CabLate 的品牌資產；問題是使用密度，不是資產本身 | case-cablate 與現行 screenshots |

## Section audit

### 1. Route：下一步選擇

**Status：Partial；優先 P1。**

#### Observed

- 桌機是清楚的四欄決策列：編號、標題、適合情境、按鈕；760 與 390 會重排成標題／描述／按鈕。
- 第一列有 `route-item--primary` 的紫色底與左側 accent，另外兩列是白紙上的分隔線。
- 標題「你可以自己查、自己學，也可以直接找我一起看」能讀懂，但很像導覽總結；第一列 CTA「先做工作流健檢」與上方 diagnostic 的工作重複。
- source 使用 `<div class="route-list">` 包三個 `<article>`，而非 repeated choices 的 list semantics。
- `01／02／03` 由 source 直接輸出，沒有 aria-hidden，也沒有對應的實際步驟責任。

#### User impact / principle

讀者已經在上方做過症狀辨識，這裡卻再次被送回相同「健檢」入口；三個數字又讓三個平行選項看起來像必須依序完成。這違反「每個 section 只推進一個 beat」與「不靠裝飾小字建立層次」，也讓這一段像 CTA card wall，而不是 decision table。

#### Proposed direction

- 保留三條路，但把 section 改成「你想從哪裡開始？」的 decision table；它的任務是分流，不是再次診斷。
- 候選文案（需在實作前依真實 route 核對）：

  - `我想先知道問題在哪裡` → `看完整判斷路徑`
  - `我想自己學會怎麼修` → `看學習內容`
  - `我已經卡住了，想一起判斷` → `看合作方式`

- 移除 01／02／03；若業務真的需要順序，才改成有語意的狀態或步驟，不保留無責任的數字。
- 移除或重寫「從你的問題開始」；如果 h2 已經完成定位，它就是多餘的 section label。
- 桌機可保留表格式基線與單一 selected row；手機保留同一閱讀順序，按鈕放在各選項後方，不做三張獨立卡片。
- 如果 diagnostic 已經是主要轉換，第一條 route 不應再叫「先做工作流健檢」；它應該帶讀者看方法或證據。

#### Acceptance

- 讀者在十秒內知道三條路的差別，不需要讀 01／02／03 才能理解。
- 三個 CTA 的結果不重複；第一條不再複製 diagnostic 的起點。
- 390、760、1440 都維持「選項 → 適合情境 → 行動」的順序，沒有任一列需要縮成難讀的小字。
- HTML 使用 list semantics 或等價的選項群組語意；編號若移除，不再被讀屏讀出。

### 2. Identity：為什麼相信這個人

**Status：Fail on proof / Partial on voice；優先 P1。**

#### Observed

- 桌機的左右欄與手機的單欄重構都穩定，主標「執行愈來愈便宜，判斷反而更重要」有辨識度。
- `我是 CabLate` 是紫色 section label；h2 已經說明這一段的核心，label 沒有增加新的導覽、狀態或來源資訊。
- 正文是「我原本做全端工程與系統設計，現在把大部分時間放在 AI 應用、Agent 與真實工作流程」及一段價值主張，旁邊只有「看作品與經歷」文字連結。
- source 明確註記 proof slot 尚未 render；畫面沒有案例文件、repo、產品截圖、公開產出或可驗收結果。
- 手機標題與 body 之間有一段明顯留白，視覺上像內容缺一塊，而不是刻意的 breath。

#### User impact / principle

這是讀者最需要「相信你不是只會說」的位置，卻只有抽象 slogan 和背景介紹。它違反 CabLate 的 `追溯／完成／誠實邊界` 必須變成可見證據的規則，也沒有完成「assertion → proof → next action」的故事 beat。

#### Proposed direction

- 讓這一段只回答一件事：`你會怎麼把問題看清楚，最後交付什麼？`
- 先把人話放在技術名詞前面。候選方向：`我把做產品時的拆解，帶進 AI 工作裡`，再接一個真實公開 artifact 的一句說明；不是再列 Agent、workflow 等名詞。
- 至少選一份 approved public proof：真實案例、公開 repo、被註解的產出，或「問題／限制／關鍵判斷／結果」的短 artifact。不要補假數字或假 testimonial。
- 若 proof 尚未核准，寧可把 identity 縮成短的 human breath，將重點移到 `/about/#public-output-title`，也不要用空間假裝證據。
- 這一段可改成 warm-stage 的 editorial sequence 或 annotated artifact，不必再包一張完整 paper-card；保留 serif headline，撤掉裝飾 label，讓證據成為主角。

#### Acceptance

- 不看 section label 也知道這一段在說「Cab 怎麼工作、能交付什麼」。
- 畫面至少出現一個真實、可點擊或可核對的 proof object；若沒有就明確標示缺口，不發明 claim。
- 手機 heading 後的留白服務圖片／artifact／連結，不再只是空白高度。
- 讀者能用一句話重述：CabLate 不是只把 AI 做出來，而是把判斷與交付留下來。

### 3. CabAI：跨站 hand-off

**Status：Partial；優先 P1。**

#### Observed

- h2 是「課程、手冊、公開資源與免費試看，都放在同一個地方」，body 接著列出 `Library、Skill、課程、已購內容、學習狀態與 Agent API`。
- CTA 只有「前往 CabAI」，會開新分頁，並保留 `home_cabai_delivery` UTM。
- 桌機是左右兩欄，760／390 變成單欄；目前手機閱讀順序正確，CTA 不會被推到很遠。
- `paper-card--clip` 在右上角加上紙夾；它沒有對應 CabAI 的實際畫面或狀態。

#### User impact / principle

這一段真正要完成的是「把已經看懂問題的人交接到能取得內容的平台」，但讀者先看到的是 CabAI 內部資料結構，還不知道自己第一步會拿到什麼。`前往 CabAI` 也只描述目的地，不描述行動後的結果。

#### Proposed direction

- 保留 UTM、外部連結與 CabAI 品牌名稱；把主張改成讀者結果，例如「看懂問題之後，接著把做法留下來」。
- 把 body 從系統 inventory 改成一個真實使用情境：在 CabAI 先看哪種免費內容、如何取得 Library／Skill／課程、之後怎麼接續進度。免費入口與可用狀態須先向 CabAI source 核對。
- CTA 候選：`先看免費內容`、`查看 CabAI 裡的內容`；若免費入口未確認，使用後者，不先承諾購買流程。
- 若有 CabAI 真實畫面，優先使用一張能證明 hand-off 的 screenshot／artifact；若沒有，保持 typographic hand-off，撤掉只作裝飾的紙夾。
- 不為這一段硬加 carousel 或 scroll choreography；一次清楚的 `Hand off` 已足夠，reduced-motion 直接顯示完整 CTA。

#### Acceptance

- 讀者能回答：為什麼要離開 CabLate、到 CabAI 能先做什麼、下一步去哪裡。
- 第一層不需要先懂 Library／Skill／Agent API；技術名詞若保留，必須出現在 reader outcome 之後。
- 外部連結仍保留 UTM、`target="_blank"` 與 `rel="noopener"` 的既有責任。
- CabAI section 在手機上保持一個主角與一個 CTA，不因紙夾或裝飾爭奪注意力。

### 4. Newsletter：低承諾收尾

**Status：Partial；優先 P1（focus），P2（結構與效能）。**

#### Observed

- 1440 是左右欄；760／390 變成標題、說明、email、按鈕、隱私 note 的單欄，尺寸與行長大致可讀。
- `Newsletter.astro` 的說明具體交代新課程、手冊更新、公開活動、重要研究，以及沒有固定週期；這是後半段最接近真人承諾的一段 copy。
- `更新通知` 既是 outer wrapper 的 `aria-label`，也是 inner section 的可見 label；同一區形成兩層 named section。
- `KitForm.astro` 的 email input 有 label、required、email type、autocomplete；但 `.formkit-input:focus` 在 source 103–107 移除 outline，改成極低對比 box-shadow。
- 初始載入會請求第三方 `ck.5.js`，即使 newsletter 在頁面下方。

#### User impact / principle

copy 與 form 本身可信，但 redundant label 讓區塊像模板；focus 規則會讓鍵盤使用者在最重要的輸入欄位失去明確位置。這直接違反「focus clear」與「每個小字必須承擔資訊責任」。第三方 script 的真實效能成本目前沒有測量，不能先宣稱通過。

#### Proposed direction

- 把 newsletter 定成真正的 `Quiet close`，只保留一個結果：留下 email，收到值得看的更新。
- 移除 `更新通知` label，或改成表單真正需要的責任資訊；不要讓 outer `<section aria-label>` 和 inner `<section aria-labelledby>` 同時存在，改成單一 named section 或 outer `div`。
- 保留「沒有固定週期、不偷偷變成高頻行銷」這種誠實邊界；它比再加 feature copy 有價值。
- 用 `:focus-visible` 提供足夠對比的 accent outline，不能由 `:focus { outline: none !important; }` 抹掉全站 focus 規則。
- 先量測首屏與下方 form 的 script 成本，再決定是否可在 section 接近 viewport 時載入；若延後，必須保留 native form、錯誤與 success fallback。
- 若要保留紙張，newsletter 可以是唯一合理的「信件／紙面」收尾；其餘 lower sections 應退回 warm stage 或單一 evidence surface。

#### Acceptance

- 鍵盤 Tab 到 email input 時，390／760／1440 都有清楚、足夠對比的 focus ring；提交錯誤與成功訊息可被讀屏讀到。
- accessibility tree 只看到一個 newsletter region 和一個清楚標題。
- copy 能回答何時寄、寄什麼、如何停止，不需要再加 marketing claim。
- 以 Network／Lighthouse 或等價資料記錄 `ck.5.js` 的成本；沒有實測前標成 Not verified。

### 5. Footer：安靜完成，不再重講首頁

**Status：Partial；優先 P2。**

#### Observed

- Footer 仍是一張完整 paper surface；desktop 左側有 CabLate 及一段 positioning，右側兩個 nav，底部是年份、隱私權、分析設定。
- Mobile 的兩欄 nav 保持可讀，footer meta 也沒有溢位；鍵盤路徑可到達所有 footer links。
- Footer copy「我從 AI 應用與產品實作切入……一直重做或不知道怎麼繼續」與前方 identity／hero 的問題框架高度重複。
- `探索`、`連結`、`隱私權政策`、`分析設定` 是功能性資訊，應保留；它們不是本次要刪除的裝飾小字。

#### User impact / principle

footer 的任務應是 quiet close 與導航，不應再成為第五張 paper-card hero。當它重複 identity，又重複紙張，頁尾沒有收束感而像內容還沒結束。

#### Proposed direction

- 將 footer 退回 warm stage 或簡單的低噪音 surface；若 newsletter 保留紙面，footer 不再使用相同 paper image。
- 把 positioning 收成一個不重複的句子，例如「先把卡點看清楚，再決定 AI 該不該進來」；正式文案仍需與首頁核准版本一致。
- 保留兩組 nav 與分析設定；mobile 兩欄不必改成一長串，因為目前可掃讀且不溢位。

#### Acceptance

- Footer 只做導覽、法律與低噪音收尾，不再複製 identity paragraph。
- 所有 links 在 footer 前的 Tab 路徑可達，focus 清楚；mobile 兩欄保持可辨識。
- 讀者滑到最後一屏時感覺「可以繼續或離開」，不是又出現一個新的主張卡片。

## Cross-section findings

### P1 — Paper-card wall

**Evidence：** route、identity、CabAI、newsletter 都在 `index.astro` 使用 `.paper-card`（source 117、134、141、148）；footer 在 `BaseLayout.astro` 也使用同一套 paper image／filter。1440 與 390 截圖可見 dark diagnostic 之後連續四張相同白紙。

**Impact：** 紙張不再是「文件／證據的資訊載體」，而變成所有內容的預設容器。identity、handoff、newsletter、footer 沒有不同 stage、density 或 layout family，頁面像 stacking cards，而非一段被導演過的敘事。

**Design principle：** CabLate case 規定每頁最多一個主要紙面隱喻；不使用整頁 paper-card wall；每個 section 先選 dominant object／action／material。

**Recommendation：** 先決定哪一段是真正的 paper protagonist（建議 hero 的人／文件或 newsletter 的 letter 二選一），其他段落回到 warm stage、dark diagnostic 或單一 evidence surface。不要用顏色變體把每一張卡重新命名成不同 section。

### P1 — Lower-half narrative loses proof ownership

**Evidence：** route 只有路徑；identity proof slot 明確未 render；CabAI 是功能 inventory；newsletter 是訂閱行動。後半段沒有一個新的 real artifact 在 identity／handoff 位置承接「我做過、我能查、我能交付」。

**Impact：** 讀者從「你說中了我的問題」走不到「我相信你能處理」，只能靠 slogan 與紙張質感補信任。

**Recommendation：** 以一個 approved public output 或 annotated artifact 作 proof constellation 的中心；如果目前沒有可公開證據，就縮短 claim，不用假 dashboard、假數字或裝飾性文件填空。

### P1 — Newsletter keyboard focus

**Evidence：** `KitForm.astro:103–107` 的 `:focus` 規則移除 outline；實測 keyboard focus 時 `outline-style=none`，只有 `rgba(0,0,0,.04)` box-shadow。

**Impact：** 鍵盤使用者進入 email 欄位後，難以知道目前位置；這是實際可及性缺陷，不是視覺偏好。

**Recommendation：** 以 `:focus-visible` 恢復高對比 outline／offset，讓 hover、pointer focus 與 keyboard focus 分工；不要用全域 `!important` 抹掉 focus ring。

### P2 — Decorative metadata and repeated labels

**Evidence：** route 的 01／02／03、route／identity／CabAI／newsletter 的 `section-label` 或 `newsletter-label` 都是第一層小字；大多沒有標題沒有的新狀態、來源或操作責任。

**Impact：** 這些字在桌機看似增加編輯感，在手機只增加掃讀負擔；它們也讓每張 paper card 共享同一套 template。

**Recommendation：** 只保留真正的導覽、狀態、來源或操作說明；其餘由標題、留白、對齊、證據和互動建立層次。

### P2 — Nested newsletter landmark

**Evidence：** outer `section.newsletter-card` 有 `aria-label="更新通知"`，inner `Newsletter.astro` 又是 `section#newsletter[aria-labelledby="newsletter-title"]`。

**Impact：** accessibility tree 會出現兩個相鄰／巢狀的 newsletter region，讀者可能先聽到同一個區塊名稱兩次。

**Recommendation：** 只留下 inner named section，或讓外層變成無 landmark 的 wrapper。

### P2 — Third-party form script cost

**Evidence：** `KitForm.astro:23–24` 初始輸出 remote `ck.5.js`；Network 實測確實請求該 script。

**Impact：** 它在頁面下方仍參與初始下載／執行；沒有資料前不能判斷是否已傷害 LCP／INP，但它是目前最明確的可檢查成本。

**Recommendation：** 量測後再決定是否 viewport-near lazy load，並保留 HTML form、loading、error、success 與 no-JS fallback；不要只為了「Made By Pan 有 library」新增 GSAP 或其他 runtime。

## Motion, responsive, performance and accessibility gate

| Criterion | Evidence | Status | Audit decision |
|---|---|---|---|
| Desktop／tablet／mobile recomposition | 1440／760／390 section screenshots；route、identity、CabAI、newsletter 均 stack／rescale | Partial | 沒有縮爆，但要重新分配 paper、留白與 proof 主角；不是再加 breakpoint |
| Page-level horizontal overflow | Playwright `scrollWidth === innerWidth` at 1440／760／390 | Pass | 保留現有容器責任，不用 `overflow-x:hidden` 掩蓋問題 |
| Type roles | Serif headings、sans body、mono route numbers／states | Partial | 角色清楚，但 section 全部同一紙面＋serif 模板，需靠 beat／evidence 分化 |
| Product-native objects | 真實照片在 hero（本次排除）；後半段主要是 paper、paperclip、buttons | Fail on lower proof | route／identity／CabAI 至少一段要出現真實 artifact；紙張本身不能當 proof |
| Motion grammar | Lower sections essentially static；無新增 runtime | Pass for current content | 不為裝飾加 motion；CabAI 若要動，只使用一次 `Hand off` 並提供 static reduced-motion state |
| Reduced motion | 尚未在 OS reduced-motion 實測 lower sections | Not verified | 實作任何新動態前逐項測試，不以 CSS media query 存在代替驗收 |
| Image priority | hero primary `fetchpriority=high`、secondary `low`；後半段沒有 content image | Partial / Not verified | 目前方向合理；若新增 proof image，首屏只保留 1–2 張 priority，其他 lazy 並保留尺寸 |
| Form label and error region | label、email type、autocomplete、`aria-live` error list 已存在 | Partial | input focus ring 目前 fail；success／error 實際第三方狀態未驗證 |
| Focus order | Keyboard path 實測可由 route → identity → CabAI → newsletter → footer | Partial | 順序可走；newsletter input 需要高對比 focus，mobile menu open／close 尚未完整測試 |
| Landmark structure | Footer nav labels 清楚；newsletter outer／inner section 重複命名 | Partial | 修成單一 newsletter landmark，repeated routes 可改 list semantics |
| Dependency discipline | package 無 GSAP／Framer Motion；首頁載入 ConvertKit remote script | Pass with follow-up | 不新增 library；只對真實 hand-off／表單需求評估載入策略 |

## Keep / strengthen / retire map

### Keep

- Noto Sans／Serif／mono 的既有角色分工。
- CabLate 的暖紙、墨色、紫色註記，但保留給有資訊責任的地方。
- Route 的三種真實入口、CabAI UTM hand-off、newsletter 的誠實邊界、footer 的功能性 nav。
- 目前 1440／760／390 的容器與 mobile stack 基礎；它們沒有 page-level overflow。

### Strengthen

- Route 的選擇結果與彼此差異。
- Identity 的真實 proof object、人的聲音與 mobile density。
- CabAI hand-off 的「離開後能得到什麼」與第一步。
- Newsletter 的 keyboard focus、single landmark、表單狀態等價內容。

### Retire or limit

- 後半段連續使用同一個 `.paper-card` 的容器牆。
- 沒有順序責任的 01／02／03。
- 重述標題的 `從你的問題開始`、`我是 CabLate`、`更新通知` 等裝飾 label。
- CabAI 的 paperclip（若不能指向真實 hand-off object）。
- Footer 重複 identity 的長段 positioning。
- 為了讓這些靜態段落「更像參考站」而加入 GSAP、scroll hijack 或永久漂浮。

## Anti-copy / originality ledger

本次沒有重新研究外部頁面；以下是 no-reference mode 的內部相似度檢查，避免把已學到的能力變成模板。

| Risk signal | Capability to preserve | Product-native translation | Residue to reject |
|---|---|---|---|
| Made By Pan 的能力：每屏有自己的產品世界 | 不同 beat 用不同主角與密度 | route 用 decision table、identity 用真實 artifact、CabAI 用 hand-off、newsletter 用 quiet close | 不做「每段都一張編輯紙卡」的統一皮 |
| Made By Pan 的能力：先排讀者心理再排 section | 每段回答一個讀者問題 | diagnostic 後先選路，再建立信任，再交接到 CabAI，最後訂閱 | 不沿用固定 Hero → 三卡 → 平台清單 → 表單的模板節拍 |
| 通用 AI 網站風險：三張等寬 feature cards／小字標籤 | 群組要有清楚層級 | 用留白、基線、唯一 selected row 和真實 CTA 分群 | 不用 01／02／03、每段 eyebrow、三張同樣 button card 假裝有層次 |
| CabLate 自身 paper grammar | 紙張可以承擔文件／證據感 | 只選一個 primary paper protagonist，其餘回 warm stage 或 dark diagnostic | 不因品牌資產存在就把 footer、identity、CabAI 全部包紙 |

## Final acceptance checklist for the next pass

- [ ] Route 變成真正的 decision table；三條 CTA 結果互不重複，移除無責任的 01／02／03。
- [ ] Identity 有一份 approved public proof；沒有 proof 時縮短 claim，不用裝飾補空缺。
- [ ] CabAI copy 先說讀者得到什麼，再說 Library／Skill 等系統名詞；CTA 描述結果，UTM 不變。
- [ ] 全頁只保留一個主要 paper surface／paper protagonist；footer 不再是另一張相同紙卡。
- [ ] 所有 section label 通過「標題沒有的新資訊／讀者需要的位置／手機可讀」三問；否則移除。
- [ ] 390／760／1440 截圖重新確認主角、留白、裁切與 CTA 位置，不只確認沒有 overflow。
- [ ] Newsletter email input 的 keyboard focus ring 清楚；error／success 狀態可讀。
- [ ] Newsletter 只保留一個 named landmark；route repeated choices 使用 list 或等價語意。
- [ ] 對 ConvertKit script、字型與新 proof media 做實測預算；沒有數據前標記 Not verified。
- [ ] 若新增動態，只能以 `Hand off`／`Reveal` 等產品動詞說明 target、meaning、trigger、end state 與 reduced-motion fallback。
- [ ] 不加入 Made By Pan signature combination、假數據、假 dashboard、假 testimonial 或只為氛圍的 library。

## Files and rules read

### CabLate Design Director

- `C:\Users\user\.codex\skills\cablate-design-director\SKILL.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\design-language.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\case-cablate.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\output-contracts.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\implementation-guardrails.md`
- `C:\Users\user\.codex\skills\cablate-design-director\references\anti-copy.md`

### Modern web guidance

- `D:\_CabLate_Agents\coder\.agents\skills\modern-web-guidance\SKILL.md`
- Retrieved guides: `defer-rendering-heavy-content`, `optimize-image-priority`, `accessibility`, `css-layout`, `improve-text-layout-and-legibility`, `scroll-entry-exit-effects`。
- 應用結果：只把 content-visibility 建議保留給真正重且在 fold 外的區塊；不要為了本頁小型文字 section 盲目加。圖片 priority 只給真正 LCP／critical media；所有新 motion 必須 feature-detect、尊重 reduced motion、只動 transform／opacity 並保留靜態 fallback。短標題可局部使用 `text-wrap: balance`，不全域套用。

## Audited source

- `F:\_Program\OwnProject\CabLate\src\pages\index.astro`
- `F:\_Program\OwnProject\CabLate\src\components\sections\Newsletter.astro`
- `F:\_Program\OwnProject\CabLate\src\components\common\KitForm.astro`
- `F:\_Program\OwnProject\CabLate\src\layouts\BaseLayout.astro`
- `F:\_Program\OwnProject\CabLate\src\styles\global.css`
- `F:\_Program\OwnProject\CabLate\package.json`
