---
status: completed
created: 2026-07-13
implementation_status: completed
copy_status: approved
verdict: verified
scope:
  - align the homepage diagnosis promise with the Expertise page
  - complete the Expertise reader journey after diagnosis
  - remove repeated information and inconsistent method numbering
  - correct desktop and mobile heading, interaction and accessibility issues
canonical_parent: docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md
related_plan: docs/design/expertise-layout-plan-2026-07-12.md
---

# Expertise 第一站修正 Master Plan

## 0. 文件定位

這份文件處理首頁第一個對外頁面入口：

```text
首頁「查看診斷方法」
→ /expertise/
```

它不是 Expertise 的全面重做，也不取代全站長期總綱。這一輪只處理訪客從首頁被問題說中、進入 Expertise、完成診斷，再決定下一步的完整體驗。

- 全站目標、頁面角色與 CTA 原則，仍以 `docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md` 為準。
- Expertise 的「問題排查文件」視覺方向，仍以 `docs/design/expertise-layout-plan-2026-07-12.md` 為準。
- 本文件負責修正首頁與 Expertise 的內容接縫、方法順序、重複資訊、頁尾行動、標題斷句與互動可及性。
- 本文件核准前，不修改 `src/pages/index.astro`、`src/pages/expertise.astro`、`src/config/authority.ts` 或共用 CSS。

## 1. 先說結論

Expertise 現在已經具備正確的主體：

- Hero 先說真實問題，沒有一開始就塞方法名詞。
- 診斷表從症狀、最小檢查與常見誤判出發。
- 方法對照讓訪客理解 Context、Harness、Skill 的差異。
- 「不是每個問題都需要 Agent」清楚表達 CabLate 的判斷邊界。
- Desktop 能橫向掃讀，Mobile 沒有水平溢位。

真正需要修正的不是紙面視覺，而是整條閱讀路徑還沒有完成：

```text
首頁第三個問題沒有在 Expertise 找到直接對應
→ 診斷表與方法對照的 01／02 代表不同方法
→ 後半段重新說了一次相近內容
→ 訪客完成診斷後直接進 Footer
→ 不知道接下來應該自己學、繼續查，還是討論實際情境
```

修正後應該是：

```text
從首頁帶著一個明確問題進來
→ 在診斷表找到同一句或非常接近的症狀
→ 做一個能排除原因的檢查
→ 理解這個問題屬於哪一層，以及修到什麼程度可以先停
→ 選擇自行學習，或帶著實際情境討論
```

這一輪不追求增加內容，而是讓每一段提供新的判斷，並讓訪客知道下一步。

## 2. 現況事實基線

### 2.1 首頁送進 Expertise 的期待

來源：`src/pages/index.astro`

首頁 Diagnosis 先呈現三個情境：

1. 每次換個任務，都得重新交代背景。
2. AI 做了很多，最後還是不敢直接用。
3. 一出錯就找不到原因，只能從頭再來。

訪客按下 `查看診斷方法` 時，合理期待是：進入下一頁後，可以找到這三種情況分別該先檢查什麼。

### 2.2 Expertise 目前的閱讀順序

來源：`src/pages/expertise.astro`

1. Hero：提醒訪客不要只改 Prompt。
2. Diagnosis：三個症狀、最小下一步檢查與常見誤判。
3. Method map：Context、Harness、Skill 的定義與適合情況。
4. Route：Context → Harness → Skill 的建議順序。
5. Boundary note：不是每個問題都需要 Agent。
6. Footer：沒有頁面自己的下一步。

### 2.3 已確認的問題

#### 首頁第三個情境沒有直接對應

首頁第三個問題是「出錯後不知道哪裡壞掉，只能重來」；Expertise 第三列則是「每次都要重教，品質忽好忽壞」。前者偏向錯誤發現與復原，後者偏向可重複方法。兩者都重要，但不是同一個問題。

#### 方法編號前後不一致

- Diagnosis：01 Context、02 Harness、03 Skill。
- Method map：01 Harness、02 Context、03 Skill。
- Route：Context → Harness → Skill。

數字在文件式介面裡會被當成固定識別。`01` 在同一頁代表兩種方法，會讓讀者懷疑自己是否看錯。

#### Articles 暫停導流後，頁面失去下一步

舊規劃把「閱讀對應文章」當作 Expertise 的 Primary CTA。現在站內暫停主動導向 Articles，原本的行動被註解，但沒有替代方案。訪客得到判斷後，只能離開或使用 Footer 導覽。

#### Mobile 標題仍會出現不自然斷句

實際渲染可見：

- Hero 可能讓「時，」單獨落在下一行開頭。
- 方法標題可能把「檢查」拆成「檢／查」。

這不是字級太大的問題，而是標題語句沒有依窄畫面重新分組。

#### Hero 錨點的互動提示不足

`先從你看到的問題開始` 在 390px Mobile 的實測高度約 23px，低於 44px 觸控目標。`--accent` 小字放在近白紙面上的對比約 4.2:1，也低於一般小字 4.5:1 的目標。

### 2.4 已通過的項目

- 1440px Desktop 與 390px Mobile 均無水平溢位。
- Hero 的 `#diagnosis` 跳轉有避開固定 Headbar；Mobile 實測跳轉後 H2 位於 Header 下方。
- H1、H2、H3、`section`、`article`、`dl`、`ol` 的基本語意結構可保留。
- Diagnosis 在 Desktop 可以橫向比較；Mobile 依「症狀 → 檢查 → 誤判」閱讀。
- 全站已有 skip link 與共用 `:focus-visible` 規則。

## 3. GORE／產品意圖

### 3.1 產品意圖

Expertise 要讓一個已經被首頁問題說中的訪客，在不必先懂技術名詞的情況下，找到最像的失效現象，做出一個可以排除原因的檢查，最後知道自己接下來要學什麼，或是否需要找人一起處理。

### 3.2 核心目標

`EG-0`：訪客從首頁進入 Expertise 後，能辨認問題層級、採取一個最小檢查，並選擇符合自己現況的下一步。

### 3.3 角色與任務

| 訪客 | 想完成的事 | 網站不該逼他做的事 |
| --- | --- | --- |
| 每次都要重新交代背景的人 | 確認 AI 當下究竟讀到什麼 | 先學會 Context Engineering 的完整定義 |
| AI 做很多但成果不能直接用的人 | 找出任務、工具、權限或完成標準哪裡沒接好 | 把單次成功誤認成穩定流程 |
| 出錯後只能重來的人 | 找到錯在哪一步，以及能否從失敗位置恢復 | 先把問題歸因為模型不夠強 |
| 每次都要重教的人 | 判斷做對一次的方法是否被留下 | 只保存 Prompt 就以為完成制度化 |
| 想自己處理的人 | 找到適合目前問題的學習起點 | 一次理解或購買全部內容 |
| 問題已影響工作或團隊的人 | 判斷是否值得討論實際情境 | 先逛完整個網站才找到合作入口 |

### 3.4 支援目標

| Goal ID | Goal | Depends on | Observable outcome |
| --- | --- | --- | --- |
| `EG-1` | 讓首頁三個問題都能在 Expertise 找到對應 | `EG-0` | 首頁第三種失效有清楚的 Harness 診斷內容 |
| `EG-2` | 建立一套前後一致的方法識別與順序 | `EG-0` | Context、Harness、Skill 在全頁不再交換編號 |
| `EG-3` | 讓 Diagnosis 與 Method map 各自提供不同價值 | `EG-1`、`EG-2` | 後半段不再重述症狀，而是說明完成訊號與停止條件 |
| `EG-4` | 在 Articles 暫停導流期間提供合理下一步 | `EG-0` | 頁尾能前往學習路線或討論實際情境 |
| `EG-5` | 讓標題與互動在窄畫面仍自然、可點、可讀 | `EG-0` | 無孤立標點、詞語斷裂、小型點擊區或低對比連結 |
| `EG-6` | 保留 Expertise 的診斷文件特色 | `EG-1` 至 `EG-5` | 不退回三張等寬卡片，也不把頁面改成商品頁 |

### 3.5 體驗品質目標

- `ESG-1 被理解`：訪客先看見自己的症狀，再接觸方法名稱。
- `ESG-2 有進展`：每一區都讓訪客多知道一件可以採取的事。
- `ESG-3 不被推銷`：頁面先完成診斷，不把所有人直接送去買產品或談合作。
- `ESG-4 相信判斷`：方法有適用範圍，也有明確的停止條件。
- `ESG-5 可掃讀`：Desktop 可比較，Mobile 不必縮小字級或左右拖動。
- `ESG-6 自然`：標題與 CTA 是可朗讀的繁體中文，不用抽象流程口號。

### 3.6 不可破壞的規則

1. Expertise 仍是失效診斷入口，不是方法名詞清單。
2. 不要求症狀數量與方法數量相同；多個症狀可以指向同一層。
3. 診斷順序固定為 Context → Harness → Skill，除非有實際證據需要例外。
4. 首頁第三個「出錯後只能重來」維持原意，不為了配合三欄版面而改弱。
5. Articles 可以存在，但本輪不恢復任何站內 Article CTA。
6. CabAI 不成為 Expertise 的直接 Primary CTA；商品與平台選擇留給 Courses。
7. 「不是每個問題都需要 Agent」必須保留，而且維持正常閱讀權重。
8. 不新增未經證實的成果、數字、客戶案例或見證。
9. 保留紫色、紙張材質、細線、編號與排查文件語法。
10. 不用縮小正文或犧牲安全內距換取 Mobile 排版。

### 3.7 不處理的範圍

- 不重做首頁 Diagnosis 的版面或三個既有問題。
- 不重新開放 Articles 導流。
- 不新增搜尋、篩選器、互動測驗或 AI 診斷工具。
- 不在本輪加入 GSAP、ImageGen 素材或新套件。
- 不修改 About、Work、Courses、Services 的頁面內容。
- 不處理文章內頁、課程內容頁或搜尋頁。
- 不做全站 CSS 整理或趁機移除其他 dead code。

## 4. 修正後的閱讀路徑

### 4.1 首頁到 Hero

訪客的內在問題：

> 這就是我遇到的情況，問題到底卡在哪裡？

Hero 的責任只有兩件事：

1. 告訴訪客「一直加 Prompt 不一定能解決」。
2. 讓他直接前往症狀診斷。

Hero 不放課程、合作、CabAI 或方法名詞清單。

### 4.2 Diagnosis

訪客的內在問題：

> 哪一個最像我？現在先檢查什麼？

Diagnosis 改為四個症狀案例、三個方法層級：

| Case | 症狀 | 層級 | 這列必須提供 |
| --- | --- | --- | --- |
| A | 換任務或回合後，背景接不起來，甚至讀到舊資料 | Context | 實際讀取內容與版本比對 |
| B | AI 做了很多，成果仍不能直接使用 | Harness | 任務、工具、權限與完成條件檢查 |
| C | 一出錯就不知道壞在哪裡，只能從頭重來 | Harness | 錯誤位置、失敗狀態與復原路徑檢查 |
| D | 同一件事每次都要重教，品質忽好忽壞 | Skill | 判斷、順序、限制與驗收是否被留下 |

規則：

- 症狀案例使用 A 至 D，不再和方法編號共用 01 至 03。
- Harness 可以有兩個案例，因為「成果不能用」與「失敗後不能恢復」都是執行環境問題，但訪客感受到的是兩種不同痛苦。
- 每列仍只保留「症狀、最小檢查、常見誤判」，不加入方法長篇定義。

### 4.3 Method map

訪客的內在問題：

> 我知道可能是哪一層了，修到什麼程度算有改善？

方法對照固定順序：

1. Context Engineering
2. Harness Engineering
3. Skill

每個方法只回答 Diagnosis 尚未回答的兩件事：

- `修好後會看見什麼`：可觀察的完成訊號。
- `什麼時候往下一層查`：停止條件或轉換條件。

不再重複「適合先看」與相同症狀描述。方法定義可以保留一至兩句，但不能比完成訊號更顯眼。

### 4.4 Route 與 Boundary note

Route 保留 Context → Harness → Skill，但角色改成簡短摘要，不再像另一張重複的方法表。

- `仍不確定？回到診斷表` 必須變成真正的 `#diagnosis` 連結；如果不做成連結，就改成不帶行動語氣的說明。
- Boundary note 繼續放在方法之後，提醒訪客簡單工具能穩定完成時就不必增加 Agent。

### 4.5 頁尾行動

訪客的內在問題：

> 我大概知道該查哪一層了，接著要去哪裡？

Articles 暫停導流期間，頁尾使用一主一次的選擇：

| 角色 | 文字意圖 | Destination | 視覺權重 |
| --- | --- | --- | --- |
| Primary | 想自己繼續學與處理 | `/courses/` | Filled primary button |
| Secondary | 問題已影響工作，想討論實際情境 | `/services/` | Bordered paper button |

建議 CTA 名稱：

- Primary：`查看學習路線`
- Secondary：`討論實際情境`

不直接連 CabAI products URL。訪客先到 Courses 理解學習深度與目前可用內容，再決定是否前往 CabAI。

## 5. 待確認文案與內容決策

本節是實作前必須人工確認的可見內容。核准前不得先套進頁面試效果。

### 5.1 Hero heading

現行：

> AI 一直鬼打牆時，先別只改 Prompt。

內容可以保留；修正重點是句組與斷行，不必為排版硬改語意。

規則：

- 「時，」不可單獨落在新行開頭。
- 如果 320px 至 390px 無法自然排下，優先調整 phrase grouping 或改成「AI 一直鬼打牆，先別只改 Prompt。」；不可縮小到破壞主視覺。

### 5.2 新增 Harness 失敗復原案例

建議症狀：

> 一出錯就找不到問題發生在哪裡，只能從頭再來。

建議提問：

> 檢查流程有沒有留下每一步的輸入、輸出與失敗狀態，能不能從出錯的位置繼續。

建議最小檢查：

> 挑一次真實失敗，標出最後一個正確結果、第一個錯誤訊號，以及重新執行時能從哪一步開始。

建議常見誤判：

> 只增加重試次數，卻沒有留下錯誤位置、部分成果與復原條件。

### 5.3 Method map 的新資訊

| 方法 | 修好後會看見什麼 | 什麼時候往下一層查 |
| --- | --- | --- |
| Context | AI 能說出正在使用的版本、資料與缺少的資訊；換回合後不會抓錯舊資料 | 資訊正確且足夠，成果仍不能穩定完成時，改查 Harness |
| Harness | 同一個真實任務能依完成條件交付；失敗時知道停在哪一步，也能從那裡恢復 | 流程已穩定，但每次仍要重新解釋做法時，改查 Skill |
| Skill | 做對一次的方法已留下啟動條件、判斷順序、限制與驗收方式 | 工作不重複、規則不明確或簡單自動化已足夠時，不必硬做 Skill 或 Agent |

### 5.4 頁尾引導

建議標題：

> 找到最像的問題後，選一個現在用得上的處理方式。

建議說明：

> 想自己建立方法，可以先看學習路線；問題已經影響實際工作，也可以直接討論情境。

建議 CTA：

- `查看學習路線`
- `討論實際情境`

## 6. 視覺與響應式規格

### 6.1 共用原則

- 保留目前紙張、細線、方法標籤、迴紋針與邊界章戳。
- Diagnosis 與 Method map 必須看得出責任不同：前者找症狀，後者看完成訊號與停止條件。
- 紫色只用於識別、互動與少量導引，不增加大面積紫底。
- 所有文字與 CTA 必須位於紙張安全內距，不靠 `overflow: hidden` 掩蓋跑版。
- 標題先人工安排語句，再以 `text-wrap: balance` 輔助。

### 6.2 Desktop

- Hero 維持目前大標題與左右 footer，不增加第三欄。
- Diagnosis 四個案例仍用固定欄位橫向比較；增加一列不代表增加一個方法。
- Method map 採 Context、Harness、Skill 固定順序，移除重複的「適合先看」欄後，應比目前更短。
- 頁尾 CTA 放在 Boundary note 之後、Footer 之前，形成明確的頁面收尾。
- 1280px 與 1440px 下，右側欄位都必須保留紙張內距，不貼齊瀏覽器邊緣。

### 6.3 Mobile

- Diagnosis 每個案例依「症狀 → 最小檢查 → 常見誤判」垂直排列。
- Case label 與方法 label 不得壓縮正文寬度到難以閱讀；必要時讓 label 移到正文上方，不縮小內文。
- Hero、Diagnosis、Method map、Boundary note 與頁尾 CTA 的標題都要在 320px、360px、390px 人工確認斷句。
- 不得把「檢查、錯誤處理、完成條件」等詞拆成不自然的兩行。
- 頁尾兩個 CTA 垂直排列，每個高度至少 44px。
- 新增第四個案例後，應靠刪除 Method map 的重複資訊控制全頁長度，不用縮小字級。

### 6.4 互動與可及性

- Hero 的 `先從你看到的問題開始` 必須呈現為清楚的 filled primary button，並有至少 44px 的可點高度；不得再退回只有底線的小型文字連結。
- 小型互動文字使用 `--accent-text` 或其他對比達 4.5:1 的顏色；不能只靠 `--accent` 小字表示可點。
- 連結需有文字、箭頭或邊界等第二種可點提示，不能只有顏色。
- `focus-visible` 在紙張紋理上仍要清楚可見。
- `#diagnosis` 與新增頁尾 section 的 anchor 都要避開固定 Headbar。
- `prefers-reduced-motion` 下不新增自動位移、視差或進場動畫。

## 7. CTA 架構

| 位置 | CTA role | Destination | 理由 |
| --- | --- | --- | --- |
| Hero | Internal task starter | `#diagnosis` | 直接進入本頁主要任務 |
| Route 最後 | Internal recovery link | `#diagnosis` | 讓仍不確定的人回到症狀表 |
| Page end | Primary next step | `/courses/` | 自行學習是完成診斷後最低壓力的下一步 |
| Page end | Secondary next step | `/services/` | 給已有實際工作影響的人直接討論情境 |
| Footer／側欄 | Ecosystem navigation | Existing destinations | 不取代頁面自己的下一步 |

規則：

- 不恢復 Article 連結。
- 不新增 CabAI、Discord、Email 或單一商品 CTA。
- 同一區最多一個 filled button。
- CTA 不使用「了解更多」「立即開始」等無法說明目的的文字。

## 8. 實作計畫

### Phase 0：建立行為契約並核准文案

#### 對目標的貢獻

- Goal IDs：`EG-0` 至 `EG-6`
- 目的：先把首頁到 Expertise 的問題對應、方法順序、CTA 與視覺狀態寫成可驗證契約，避免實作時自行改變頁面責任。

#### 檔案

- 新增 `docs/contracts/expertise-first-destination-correction-2026-07-13.md`
- 更新本文件的 `copy_status` 與決策記錄

#### 契約最低內容

- 首頁三個問題與 Expertise 四個症狀案例的對應。
- Context、Harness、Skill 的固定順序與顯示識別。
- Hero anchor、Route recovery link、頁尾兩個 CTA 的 accessible name 與 destination。
- Desktop、Mobile、keyboard、reduced motion、no-overflow 等 UI states。
- Articles 連結維持暫停的 regression boundary。

#### 成果證據

- 使用者已核准第 5 節的新增案例、方法完成訊號與頁尾文案。
- Contract status 由 `draft` 升為 `active`。

### Phase 1：補齊症狀並統一方法順序

#### 對目標的貢獻

- Goal IDs：`EG-1`、`EG-2`

#### 檔案

- `src/pages/expertise.astro`
- `src/config/authority.ts`

#### 實作限制

- Diagnosis 使用四個症狀案例，不新增第四個方法。
- 案例以 A 至 D 識別；方法以 01 Context、02 Harness、03 Skill 識別。
- `signatureMethods` 目前只有 Expertise 使用；調整順序時仍需以 `rg` 再確認消費者。
- 不修改首頁三個問題，除非實作後人工測試證明仍無法理解對應。
- 不取消既有「最小下一步檢查」與「常見誤判」。

#### 成果證據

- DOM 中可找到四個症狀案例，Harness 有兩個不同失效情境。
- Diagnosis、Method map、Route 的方法順序一致。
- 首頁第三個情境能在 Expertise 首屏診斷區找到接近原句的症狀。

### Phase 2：讓 Method map 提供新判斷，補上頁尾行動

#### 對目標的貢獻

- Goal IDs：`EG-3`、`EG-4`

#### 檔案

- `src/pages/expertise.astro`
- `src/config/authority.ts`，只有確定完成訊號屬於共用方法資料時才修改

#### 實作限制

- 移除或改寫重複的「適合先看」，不再重講 Diagnosis 症狀。
- 每個方法必須顯示完成訊號與下一層條件。
- `回到診斷表` 使用真正的 `<a href="#diagnosis">`。
- 頁尾只增加 `/courses/` 與 `/services/` 兩個 CTA。
- 不把頁尾做成 CabAI 商品卡、Newsletter 或 Article 推薦區。

#### 成果證據

- 讀完 Diagnosis 與 Method map 時，兩區沒有整句同義重複。
- 訪客能回答「這層修好後會看到什麼」與「何時往下一層查」。
- 頁面 Footer 前有一個清楚的自行學習入口與一個實際情境入口。

### Phase 3：修正標題、點擊區與響應式行為

#### 對目標的貢獻

- Goal IDs：`EG-5`、`EG-6`

#### 檔案

- 優先只改 `src/pages/expertise.astro` 的 scoped styles。
- 只有兩個以上頁面確實需要同一互動規則時，才修改 `src/styles/global.css`。

#### 實作限制

- 不用降低正文可讀性換取排版。
- 不用 `overflow: hidden`、負 margin 或 absolute positioning 遮住內容問題。
- Hero button 與頁尾 CTA 的觸控高度至少 44px。
- 互動文字使用符合對比要求的顏色。
- 標題 phrase grouping 需分別為 Desktop 與 Mobile 驗證；不能只相信自動換行。
- 不新增 GSAP、圖片素材、額外裝飾或套件。

#### 成果證據

- 320px、360px、390px 不出現「時，」孤行、`檢／查` 或其他詞語斷裂。
- 1280px、1440px 的表格與紙張內距完整。
- 所有 CTA 可聚焦、可用 Enter 啟動，且 focus ring 可見。

### Phase 4：上線前驗證

#### 對目標的貢獻

- Goal IDs：`EG-0` 至 `EG-6`

#### 必要檢查

1. `npm run check`
2. `npm run validate:content`
3. `npm run build`
4. `git diff --check`
5. 精準 `rg` 確認 Article CTA 仍維持暫停
6. Browser DOM snapshot 核對 heading、link name、href 與方法順序
7. Keyboard Tab、Shift+Tab、Enter 測試
8. Desktop 與 Mobile 截圖人工檢查
9. Homepage `查看診斷方法` → Expertise → `#diagnosis` → 頁尾 CTA 的完整路徑測試

#### 瀏覽器驗證尺寸

| Viewport | 核對重點 |
| --- | --- |
| 1440 × 900 | Hero、完整診斷欄位、右側安全內距、頁尾 CTA |
| 1280 × 720 | 一般筆電下的標題、欄位寬度與首屏節奏 |
| 390 × 844 | 主流手機標題、Headbar offset、案例閱讀順序 |
| 360 × 800 | 窄手機 CTA 與方法內容斷句 |
| 320 × 568 | 最小安全內距、零水平溢位、觸控目標 |

#### 版面與可及性判定

- `document.documentElement.scrollWidth <= window.innerWidth`
- Hero anchor 點擊後，Diagnosis heading top 大於 mobile header bottom，並保留至少 16px 視覺空間
- Hero link 與頁尾 CTA 高度至少 44px
- 一般小字與背景對比至少 4.5:1
- 每個方法編號在全頁只代表一個固定方法

#### 證據位置

- `docs/design/audits/2026-07-13-expertise-first-destination/`
- 至少保存 homepage entry、desktop hero、desktop diagnosis、desktop method map、desktop page end、mobile hero、mobile diagnosis、mobile method map、mobile page end。

## 9. 目標與實作追蹤

| Goal ID | Requirement | Owner／phase | Evidence |
| --- | --- | --- | --- |
| `EG-0` | 完成從首頁問題到下一步的完整旅程 | Phase 0 至 4 | End-to-end browser path、人工讀者測試 |
| `EG-1` | 四個症狀涵蓋首頁三個問題與 Skill 失效 | Phase 1 | DOM copy、homepage-to-expertise mapping |
| `EG-2` | 固定 Context、Harness、Skill 順序與識別 | Phase 1 | DOM order、method ID assertions |
| `EG-3` | Method map 改為完成訊號與下一層條件 | Phase 2 | Copy diff、desktop/mobile screenshots |
| `EG-4` | 新增 Courses primary 與 Services secondary | Phase 2 | href/name assertions、keyboard test |
| `EG-5` | 修正標題、對比、觸控與 anchor offset | Phase 3 至 4 | Five viewport QA、contrast、geometry |
| `EG-6` | 保留問題排查文件視覺與邊界原則 | Phase 1 至 4 | Visual review、Boundary note regression check |

## 10. 驗收條件

### 10.1 訪客成果

- 從首頁三個問題任一項進入 Expertise，都能在 Diagnosis 找到直接對應或明確相近的症狀。
- 訪客不必先懂 Context、Harness、Skill，也能知道下一個最小檢查。
- 訪客讀完 Method map 後，知道修到什麼狀態可以先停，以及何時改查下一層。
- 訪客完成診斷後，不會直接落入 Footer；可以選擇自行學習或討論實際情境。
- 不想買東西或談合作的人，仍能只使用這份診斷內容而得到完整價值。

### 10.2 內容

- 首頁第三個「一出錯就找不到原因，只能從頭再來」有對應的 Harness 診斷。
- 同一方法在 Diagnosis、Method map、Route 使用一致名稱與順序。
- Diagnosis 回答症狀與檢查；Method map 回答完成訊號與停止條件，兩區不互相重寫。
- 「不是每個問題都需要 Agent」保留，且沒有被縮成頁尾附註。
- 所有可見文字使用繁體中文與全形標點。
- 不新增沒有來源的事實、數字、結果或客戶案例。

### 10.3 介面與可及性

- 320px 至 1440px 無水平捲動、紙張內容溢出或 CTA 超出安全內距。
- H1/H2 不出現孤立標點、單字或中文複合詞斷裂。
- 每個互動元素有可見 focus state，並可由鍵盤完成操作。
- Mobile 觸控目標至少 44px。
- 小型連結對比至少 4.5:1，色彩不是唯一可點提示。
- `#diagnosis` 不被 Desktop 或 Mobile 固定導覽遮住。

### 10.4 不可退步的範圍

- Articles 頁面仍可直接造訪，但全站不新增導向 Articles 的 CTA。
- 首頁既有三個問題、Diagnosis 雙 CTA、About、Routes、Case 與 CabAI 不因本輪修改而改動。
- Sidebar、Mobile menu、Footer、紙張材質與共用導覽行為維持不變。
- 不新增依賴，不改 CabAI URL、Email、Discord 或外部商品頁。

## 11. 目標衝突與決策

### 11.1 四個症狀會不會讓頁面更長

會增加一個診斷案例，但這是首頁已經承諾要處理的問題，不能省略。為了控制 Mobile 長度，Method map 必須刪除重複症狀，改成更短的完成訊號與下一層條件。不能用縮小字級或壓縮內距抵銷。

### 11.2 為什麼不是把首頁第三個問題改成 Skill

首頁第三個問題的帶入感很強，也代表真實的錯誤發現與復原困境。為了讓三個方法剛好對應三個症狀而改寫首頁，會讓內容服從版面，而不是服從訪客問題。

### 11.3 為什麼頁尾先去 Courses，而不是 CabAI

Expertise 負責診斷，Courses 負責協助訪客選擇學習深度；CabAI 負責試看、商品、購買與內容存取。直接從診斷頁送到 CabAI products 會跳過「我現在需要學到哪一層」的判斷。

### 11.4 為什麼還要保留 Services

有些訪客不是缺內容，而是問題已經影響實際交付或團隊工作。Services 只作 Secondary CTA，讓這些人不用被迫先逛課程；不把所有訪客都推向合作。

### 11.5 未來恢復 Article 導流時怎麼辦

重新評估每個症狀是否有真正對應且仍有效的文章，再把文章放回該案例的 Contextual CTA。恢復文章時必須重新檢查頁尾 CTA，不能同時保留 Articles、Courses、Services 三組同權重入口。

## 12. 回退與工作區邊界

- 目前 worktree 已有既存修改與未追蹤稽核素材。實作時禁止 `git reset --hard`、廣泛 `git restore`、`git add -A` 或清除未追蹤檔案。
- 本計畫文件是獨立新增檔案，不得覆蓋現有長期總綱或 Expertise 舊版視覺計畫。
- 每個 phase 只檢查並 stage 明確列出的檔案。
- Content／method change 與 responsive／accessibility change 分開 commit，方便獨立回退。
- 如果新增第四個症狀造成 Mobile 失衡，先壓縮重複內容與重新安排欄位，不回退症狀本身。
- 如果頁尾 CTA 被人工審查判定過度銷售，回退 CTA 視覺權重或說明文字，不恢復 Article 連結。

## 13. 以成果為準的完成定義

這輪不是在 build 通過時完成，而是在以下結果同時成立時完成：

1. 首頁三個問題都能在 Expertise 找到對應診斷。
2. Context、Harness、Skill 的名稱、識別與順序全頁一致。
3. Diagnosis 與 Method map 不再重複同一份內容。
4. 訪客知道每一層修好後會出現什麼變化，以及何時往下一層查。
5. Articles 維持暫停導流，但頁面不再以 Footer 作為唯一出口。
6. Hero link、Route recovery link 與頁尾 CTA 都清楚可點、可聚焦、可由鍵盤操作。
7. Desktop 與 Mobile 的標題斷句自然，沒有詞語斷裂、水平溢位或紙張安全內距問題。
8. 「不是每個問題都需要 Agent」仍是頁面的信任高點。
9. `npm run check`、`npm run validate:content`、`npm run build` 與 `git diff --check` 全部通過。
10. 人工從首頁依序走完 Expertise，能回答：「我的問題可能在哪一層、現在先檢查什麼、接著去哪裡。」

## 14. 執行與驗證結果

**Verdict: Verified**

第 5 節文案、A 至 D 四個症狀、Context → Harness → Skill 順序、Boundary note，以及 Courses／Services 兩種下一步均已實作。2026-07-13 重新對照第 3、4、6、10 與 13 節後發現的五項落差，也已逐項修正並由 production runtime 證據覆蓋：

1. Diagnosis 現在先顯示 Case 與症狀，方法分類只在症狀與提問後弱化呈現，符合 `ESG-1`。
2. Method map 已移除方法定義，只保留完成訊號與下一層條件；五種尺寸均短於 Diagnosis。
3. 公開方法名稱統一為 Context、Harness、Skill，中文只作輔助說明。
4. v2 evidence 已包含首頁入口、完整 Desktop Diagnosis、Method map、page end，以及 320／360／390／1280／1440 長頁。
5. Hero、Route、Courses、Services 均以真實 Tab、Shift+Tab 與 Enter 完成操作，不再以 href 或 click 取代鍵盤證據。

### 14.1 Git checkpoints

- `f3317f2 chore: checkpoint before expertise correction`：本輪修改前基線。
- `300f909 feat: complete expertise diagnosis journey`：四個症狀、方法順序、頁尾 CTA 與行為契約。
- `612c60a fix: refine expertise responsive experience`：320 至 1440px 排版、錨點、標題斷句與視覺證據。
- `8dfb9ad docs: verify expertise correction`：第一版驗收記錄。
- `ecefb96 docs: reopen expertise correction audit`：依 Master Plan 重新打開未落實項目。
- `cdee402 fix: enforce symptom-first expertise flow`：完成症狀優先、方法去重、命名一致與 Route 壓縮。

### 14.2 Production evidence

- `npm run check`：通過，0 errors、0 warnings、17 個既有 hints。
- `npm run validate:content`：通過。
- `npm run build`：通過，共 48 pages。
- `git diff --check`：通過。
- 320 × 568、360 × 800、390 × 844、1280 × 720、1440 × 900：`scrollWidth === clientWidth`，沒有水平溢位。
- Hero button 高度為 48px；Route 的互動高度為 44px；Courses 與 Services CTA 高度為 48px。
- 人工複核後，Hero 入口已由只有底線的 `text-link` 改為全站既有 `.btn.btn-primary`；Desktop 為 232 × 48px，390px Mobile 為紙張內滿寬 326 × 48px。
- `--accent-text` 對白底與紙面近似底色的對比分別約 6.40:1、6.03:1，高於一般文字 4.5:1。
- 390px Mobile 點擊 Hero 後，固定 Headbar bottom 為 70px，Diagnosis heading top 為 260px，保留 190px 安全距離。
- Diagnosis 與 Method map 高度比依序為：320px 0.754、360px 0.765、390px 0.765、1280px 0.824、1440px 0.880；方法對照在所有支援尺寸都更短。
- 首頁 `查看診斷方法` 已實際前往 `/expertise/`；Hero 與 Route 均能回到未被 Headbar 遮住的 `#diagnosis`。
- Hero 由連續四次 Tab 聚焦；Shift+Tab 後再 Tab 可返回，Enter 正確前往 `#diagnosis`。
- Route 通過 Shift+Tab、Tab 與 Enter；Courses 以 Enter 前往 `/courses/`，再 Tab 至 Services 後以 Enter 前往 `/services/`。
- Hero、Route、Courses、Services 均使用原生 `<a href>`，且紙張上的 `:focus-visible` outline 清楚。
- 五種尺寸的 DOM 均為症狀先於方法分類，Method map 沒有舊方法定義，公開名稱為 Context、Harness、Skill。
- Expertise 可執行的 Article CTA 為 0；既有 Article URL 只留在註解中，未恢復導流。
- Boundary note 保留，且本輪沒有修改首頁、About、Work、Courses 或 Services。

### 14.3 Visual evidence

完整 Desktop、Mobile、局部畫面、量測與鍵盤紀錄位於：

- `docs/design/audits/2026-07-13-expertise-first-destination-v2/README.md`

第一版 `docs/design/audits/2026-07-13-expertise-first-destination/` 只保留為基線，不作為最終 Verified 證據。
