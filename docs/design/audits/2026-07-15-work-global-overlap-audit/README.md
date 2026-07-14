# Work global overlap audit — 2026-07-15

## Audit scope

- Surface：`/work/` 的 Hero、featured dossier、public records、service bridge，以及它們和 Home、About、Courses、Services 的內容分工。
- User goal：訪客在 Work 看到的是「限制下怎麼做判斷，以及哪裡能公開檢查」，不是再次讀作者介紹、商品介紹或服務詳情。
- Accessibility target：內容能在 Desktop／Mobile 依正常閱讀順序理解；連結名稱、字級、action boundary 與外站行為清楚。
- Capture tool：Codex in-app browser，Desktop 1280 × 900、Mobile 390 × 845。

## Overall verdict

**Needs Revision。** 新 service bridge 的角色已經清楚，應完整保留；真正的全局問題在它之前：Work 同時重複 Home 的手冊案例、About 的公開輸出摘要，又把尚未公開的課程當成 `PUBLIC RECORD`。目前 Work 尚未形成比 About 更深的 decision-record layer。

## Captured steps

| Step | Evidence | General health | What it proves |
| --- | --- | --- | --- |
| 1 | `01-work-hero.jpg` | Good foundation | Hero 能說明「結果、限制、選擇」的閱讀規則，但 `CASE FILES / 03` 與實際 01–04 不一致。 |
| 2 | `02-work-featured.jpg` | Needs revision | Featured handbook有清楚結構，但與 Home 手冊案例高度重疊，且 Work 版本沒有增加更深的限制／取捨。 |
| 3 | `03-work-public-records.jpg` | High-risk overlap | 三筆 record 使用同一摘要模板；`mcp-google-map`／`banini-tracker` 重複 About，金流教學不是有效 public destination。 |
| 4 | `04-work-service-bridge.jpg` | Healthy | 三張服務卡是作品證據後的合理橋接；只做 teaser，不取代 Services 詳情。 |
| 5 | `05-about-public-output.jpg` | Healthy owner, conflicts with Work | About 已完整說明 mcp／banini／research 對作者能力的意義；Work 若只換句話說就沒有新增價值。 |
| 6 | `06-services-options-final.jpg` | Healthy owner | Services 正確擁有三種服務的 fit、deliverables 與合作詳情；Work 黃卡重複標題但只做入口，因此屬合理 progressive disclosure。 |
| 7 | `07-courses-learning-map.jpg` | Healthy owner, exposes broken Work claim | Courses 擁有產品狀態與購買路徑；畫面沒有「金流串接與產品交付教學」。 |
| 8 | `08-home-handbook-case.jpg` | Healthy owner, conflicts with Work | Home 已用問題／發現／手冊內容完整講過 Agent 深度工程手冊案例；Work featured 反而較淺。 |
| 9 | `09-mobile-work-featured.jpg` | Readable but too long | Featured 本體約 `784.64px`；Mobile body 重新顯示 proof，之後 evidence footer 又顯示一次。 |
| 10 | `10-mobile-work-records.jpg` | Needs revision | 每筆 record 約 `416.43px`，三筆共超過 1200px；小字、重複模板與整卡 anchor 讓掃讀成本高。 |

瀏覽器回傳的是 JPEG bytes；`.jpg` 是已接受並人工開啟的 evidence。早期 `.png` 副檔名與 `05`／`06` hash-navigation paint artifact captures 只保留除錯歷史，不可作為 audit evidence。

## Strengths to preserve

- Work Hero 的核心主張是對的：不是只秀成果，而是說明限制如何影響選擇。
- Featured／supporting records／service bridge 的視覺層級可分辨，不需要推翻整頁紙張語言。
- Heading outline 為 H1 → H2 → H3；Desktop／Mobile 都沒有水平 overflow。
- Service bridge 已建立清楚的作品信任 → 付費服務路徑，並把完整詳情留給 Services。

## Highest-impact findings

### P1 — 金流教學不是可檢查的 Public Record

- Work 將「金流串接與產品交付教學」標為 `PUBLIC RECORD`，只連到泛用 `/courses/`。
- Courses 畫面沒有這個項目；對應 `src/content/courses/payment-integration.md` 明確標示 `[TEST DATA]`、`draft: true`。
- `40+ 位學員` 是 delivery proof，不是 public destination。這筆應退出 Work，保留在 About／Services 的交付經驗語意。

### P1 — Featured handbook 已被 Home、About、Courses 擁有

- Home 已用「問題／發現／手冊內容」講完整案例。
- About 用它證明能把長期經驗整理成交付內容。
- Courses 擁有產品適配、價格與購買路徑。
- Work 再以相同的半年經驗、整理方式與 45 課作 featured，沒有增加新的 decision depth。建議退出 Work roster。

### P1 — About 與 Work 的 repo 敘事接近同義重述

- `mcp-google-map` 與 `banini-tracker` 在兩頁都說明同一問題、同一成果與相同 metrics／destination。
- About 已回答「這些輸出說明 CabLate 有什麼能力」；Work 必須增加真實 context、constraint、alternative／trade-off、decision 與 verification，否則應只留前往 Work 的入口。

### P2 — Record interaction 與可讀性不符合內容深度

- Desktop problem／decision／proof CSS 為 `.8rem`／`.76rem`／`.7rem`；Mobile body `.84rem`、proof 仍 `.7rem`。
- 三張 supporting records 都是整卡 anchor；DOM accessible name 包含整張文字，約 166–192 字，點擊任何位置都可能直接開外站。
- 建議改成非互動 `<article>`，只有明確的 action row 是 anchor；body Desktop `>=15px`、Mobile `>=16px`。

### P2 — Mobile proof 重複

- `work-file__result` 在 Mobile 顯示 proof，`work-featured__evidence` 仍再次顯示同一 proof。
- 同一 viewport 只應有一個 evidence owner。

### P2 — 頁面自我承諾與內容數量不一致

- Hero 顯示 `CASE FILES / 03`，現況卻有 01 featured 加上 02–04 supporting records，共四筆。
- Hero 宣稱會看到限制與取捨，但現有 records 只有 problem／decision／proof，沒有可查的 real constraint 或 alternatives。

## Cross-page ownership contract

| Page | Owns | Does not own |
| --- | --- | --- |
| Home | 一個能快速理解的問題案例與路由入口 | 完整作品名單、完整商品比較 |
| About | 作者經歷、輸出範圍、這些輸出透露的能力 | 深度案例推理、服務 fit 與 deliverables |
| Work | 可公開查證的 decision records：context、constraint、trade-off、decision、artifact、verification | 付費產品狀態、公司／客戶揭露、完整服務詳情 |
| Courses | 學習產品狀態、適合誰、價格、試看與購買 | 把課程學員數冒充 public work |
| Services | 服務 fit、deliverables、流程、邊界與聯絡 | 作品案例全文 |

同一 artifact 名稱可以跨頁出現；canonical facts 可以共用，但各頁 narrative 不能只是換句話說。

## Recommended Work architecture

1. **Hero：** 保留「結果＋限制＋選擇」的證據規則；record count 與實際 roster 一致。
2. **Featured decision dossier：** 改為 `mcp-google-map`，只有在 source matrix 能證明 context／constraint／trade-off／decision／verification 時才實作。
3. **Supporting decision records：** `banini-tracker`、`claude-code-research`；各自只說 About 沒有的新 decision insight。
4. **Service bridge：** 原樣保留三張黃卡與單一 Services CTA。

排除：`Agent 深度工程手冊`、`金流串接與產品交付教學`、客戶／公司 limited-disclosure records。Stars／forks／日期最多是 corroborating metadata，不當作主要說服力。

## Incremental execution

### W0c — source matrix and roster approval（no visual change）

- 為 `mcp-google-map`、`banini-tracker`、`claude-code-research` 填寫可追溯的 context／constraint／alternatives／decision／verification。
- 缺來源就留空，不以推測補案例。
- 使用者核准三件 roster 與每件新增深度後，才進 production implementation。

### W1 — canonical owner and visible roster swap

- 單一 canonical artifact owner；About／Work 使用不同 projection。
- Work 移除 handbook／payment，改為 mcp featured、banini、research；不改 layout、service bridge 或 CTA 樣式。
- Browser confirmation：`/work/#selected-work`。

### W2 — decision-record semantics

- Featured 改成完整 decision chain；supporting records 改為 `<article>`＋獨立 action。
- Browser confirmation：featured 與 supporting records。

### W3 — evidence hierarchy and readable type

- 移除同 viewport 重複 proof；降低 stars／forks 的主導性；正常化 Desktop／Mobile 字級。
- Browser confirmation：Desktop／Mobile public records。

### W4 — actions and Hero truth pass

- 修正 count／承諾、Hero Secondary、record actions 與 external-link clarity。
- Browser confirmation：Hero 與第一筆 record action。

### W5 — heading／mobile reflow and page gate

- 只處理 phrase grouping、spacing、anchor offset 與跨頁 regression；service bridge 不重做。
- Browser confirmation：320／360／390／1280／1440 final set。

## Evidence limits

- Screenshot audit 可確認可見 hierarchy、重複、字級風險、responsive reflow 與 action boundary，不能單獨聲稱完整 WCAG compliance。
- 本輪沒有開啟外部 GitHub repo 來建立 constraint／trade-off facts，因此 W0c source matrix 仍是 implementation blocker。
- 社群貼文目前沒有 canonical curated source list；在提供可公開 URL 與代表性理由前，不排入 Work roster。

## Plan readiness

既有 Master Plan 5.0a、5.3–5.9 與 incremental W0c–W6 的方向和本輪 fresh audit 一致；不需要另起一份相反規劃。Verdict 仍為 **Needs Revision / blocked at W0c**：source-backed matrix 與 user-approved roster 未完成前，不應直接改 Work public records。
