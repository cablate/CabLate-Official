# CabLate Design Director 夜間審核總索引

日期：2026-08-17  
性質：唯讀設計審核；沒有修改正式頁面、安裝 dependency 或把未驗證事項寫成通過。

## 一分鐘結論

CabLate 現在不是「沒有設計」，而是同一套設計語彙被用得太平均：紙張、紫色微標、clip、編號、卡片與清單幾乎到處出現。品牌人格已經可辨認，但不同頁面與不同 section 還沒有依自己的任務長出不同世界。

下一階段不應先做全站換皮。應依序解決：

1. 讓首頁後半段出現真正的成果證據，而不是繼續自我介紹。
2. 讓每種服務用自己的交付物構圖，不再共用「hero＋卡片＋流程＋FAQ＋CTA」。
3. 讓手機重新安排證據與選擇順序，而不是把桌面卡片全部往下堆。
4. 修正目前已確認的閱讀與無障礙缺陷。
5. 收斂內容入口與 `/work/` 的 route ownership。

## 三份決策版

- [首頁後半段：下一輪怎麼改](./2026-08-17-home-remaining-decision-brief.md)
- [Expertise 與服務頁：下一輪怎麼改](./2026-08-17-services-expertise-decision-brief.md)
- [About、課程與文章：下一輪怎麼改](./2026-08-17-content-about-decision-brief.md)

## 完整證據報告

- [首頁後半段審核](./2026-08-17-home-remaining-director-audit.md)
- [Expertise 與服務頁審核](./2026-08-17-services-expertise-director-audit.md)
- [About、課程、文章與系統頁審核](./2026-08-17-content-about-director-audit.md)

截圖證據：

- `artifacts/night-audit/home-remaining/`
- `artifacts/night-audit/services-expertise/`
- `artifacts/night-audit/content-about/`

## 跨站共同發現

### P1：紙張從品牌媒介變成預設皮膚

紙張可以保留，但必須有資訊責任。現在首頁下半段、服務頁、About、Courses、文章附加區與 footer 大量使用同級紙張卡片，造成主次扁平。

下一輪規則：一個 viewport 只允許一個主要紙張物件。其他內容用留白、分隔、底色、列表或產品原生物件承接。紙張應表示文件、診斷、交接、證據或可保存成果，不能只代表「這是一個 section」。

### P1：承諾多，真正成果物少

Identity、Coaching、Enterprise、Partnerships 與 CabAI hand-off 都能說清楚立場，但多數仍以敘述、清單和承諾證明價值。缺少讀者可以看到的 action card、診斷摘要、責任圖、合作 brief、rights sheet、handoff trace 或真實產品畫面。

下一輪規則：每一頁先選一個最能證明價值的產品原生物件，再讓版型圍繞它生長。沒有真實案例時可以使用明確標示的示意 artifact，但不能假造數字、客戶或成果。

### P1：手機沒有重新構圖

服務頁在 390px 沒有 page-level overflow，但頁面高度約 5,300–6,564px；大多只是把桌面卡片、流程、FAQ 與 CTA 依序堆直。文章頁則隱藏 TOC，code/table 又缺少明確的橫滑提示。

下一輪規則：手機前兩個 viewport 優先回答「這頁能幫我什麼、會留下什麼、下一步是什麼」。次要細節用摘要、details 或短 trace 延後，不靠縮字或整批隱藏證據。

### P1：裝飾微標與編號過量

`section-label`、英文 kicker、`01/02/03`、clip 與角落小字經常沒有導航、狀態、來源或操作責任。它們分散視線，也讓不同頁面呈現同一個模板味。

下一輪規則：每個小標都必須回答「我在哪裡、這是什麼狀態、來源是什麼、我要做什麼」。答不出來就刪除。平行選擇不可用流程編號暗示先後。

### P1：發現路徑仍要讀者自己拼接

About 的公開作品、Courses 的學習路徑、Articles 的 topics/tags、文章 detail 的相關內容與 `/work/` 之間沒有形成短而清楚的回路。`/work/` 目前 200 後導向 `/about/#public-output-title`，route ownership、canonical 與導覽語意尚未收斂。

下一輪規則：每個入口只承擔一個選擇問題；`/work/` 要明確決定是獨立作品索引或正式 redirect。文章結尾依讀者完成的任務選下一步，不再固定堆上整套全域卡片。

## 已確認的具體缺陷

1. 首頁 Newsletter input 的鍵盤 focus 幾乎不可見；目前移除 outline，只剩低對比陰影。
2. 文章 Newsletter CTA 初始狀態會露出空的紅色 error slot。
3. 長文章 mobile code/table 缺少清楚的橫向捲動 affordance，mobile TOC 同時被隱藏。
4. `/work/` route ownership 與 canonical 行為需要收斂。
5. Apply 表單本機 client validation 已確認有 error summary、`aria-invalid` 與 focus transfer；但 production Turnstile、API、成功／失敗／重送與四種 `?service=` 狀態尚未完成 production evidence。

## 應保留的東西

- 紙張材質與人的工作文件感，但限制使用層級。
- CabLate 的判斷語氣：不先推工具、不假裝保證成果、可以明確說不用 AI。
- 首頁診斷入口、服務邊界、價格／時長／回覆方式等可驗證資訊。
- Apply 的 labels、fieldset/legend、錯誤總結與漸進揭露基礎。
- Consulting 的低摩擦語言、Enterprise 的責任／安全／驗收意識、Partnerships 的權利與條件透明度。
- 靜態優先。沒有必要為了「像 Made By Pan」替每段加動畫。

## 建議的實作順序

### 第一刀：首頁 Identity＋CabAI hand-off

目的：先補上「看得見的成果」，並打破首頁下半段紙張卡片牆。Identity 應選一個真實 proof；CabAI 應展示交接結果或真實產品畫面，而非內容 inventory。

### 第二刀：Consulting

目的：用最小服務頁驗證新的頁面生成方法。以「帶一個真實物件來 → 一起判斷 → 帶走一頁行動卡」構圖，取代通用 fit grid、編號流程與重複 CTA。

### 第三刀：Enterprise 或 Partnerships

目的：測試同品牌不同藝術方向。Enterprise 使用 responsibility／verification map；Partnerships 使用 brief／rights／release handoff。兩頁不可只是換文案的同款卡片頁。

### 第四刀：文章閱讀系統

目的：先修 code/table、mobile TOC、空 error slot，再重排文章結尾的 related／newsletter／FAQ／nav，讓結論仍是最後的主要記憶點。

### 第五刀：Courses／Articles／Work IA

目的：減少等權入口，建立「我現在要解哪個問題」到適合內容的短路徑，並正式決定 `/work/` 的 ownership。

## 執行邊界

這次只建立 evidence-backed audit，不代表所有建議都已獲准實作。每次修改仍應逐 section 建立 change contract、保留 before screenshot、完成 desktop/mobile visual check，並記錄：參考了哪一種能力、如何抽象轉換、如何來自 CabLate 自己的產品語彙，以及排除了哪些過度相似的表面手法。
