---
status: active
created: 2026-07-14
scope:
  - public-facing page narrative
  - CTA hierarchy and interaction design
  - route, process and comparison presentation
  - desktop and mobile visual acceptance
canonical_parent: docs/content/site-purpose-page-role-and-cta-master-plan-2026-07-12.md
derived_from:
  - docs/content/homepage-trust-conversion-correction-master-plan-2026-07-13.md
  - docs/content/expertise-first-destination-correction-master-plan-2026-07-13.md
  - docs/design/homepage-redesign-session-reflection-2026-07-12.md
---

# 對外頁面的閱讀、互動與視覺驗收標準

## 1. 文件定位

這份文件保存首頁與 Expertise 兩輪修正後，後續頁面都必須遵守的長期標準。它不記錄單輪待辦、臨時 checkpoint 或某次實作進度；每一頁的 Master Plan 要引用這份標準，再補上該頁自己的讀者任務、內容、視覺語法與驗收證據。

全站產品目標仍以 `site-purpose-page-role-and-cta-master-plan-2026-07-12.md` 為準。本文件負責回答：一頁內容如何被讀懂、互動如何被辨識、流程如何被看懂，以及什麼證據才足以宣告完成。

## 2. 核心品質目標

每個對外頁面都要讓訪客完成一個清楚的認知或決策變化：

```text
帶著一個問題或目的進來
→ 認出這頁與自己有關
→ 得到新的判斷、證據或選擇依據
→ 知道一個符合當下意圖的下一步
```

品質不能用「有內容、有 class、有連結、build 通過」取代。最終要證明的是：訪客看得懂、看得出層級、知道哪裡可點，也知道點下去會得到什麼。

## 3. 這兩輪真正暴露的根因

先前最常見的誤判是：

> 元件存在、可以聚焦、觸控高度達 44px，就被當成已完成設計。

這只能證明功能底線，不能證明閱讀與互動品質。以下情況都仍然算未完成：

- 關鍵 CTA 只是角落的小字或底線連結，訪客掃讀時看不出可點。
- 三個流程名詞雖然依序出現在 DOM，畫面卻只是幾個文字並排，沒有編號、方向或層級。
- Desktop 看得懂，Mobile 靠縮字、裁切或橫向溢位勉強塞下。
- 標題語意正確，真實畫面卻把標點、複合詞或關鍵句組拆壞。
- 區塊塞入很多真實素材，卻沒有安排訪客讀前、讀後的想法與下一步。

後續驗收必須把「技術成立」與「使用者看得懂」分開檢查。

## 4. 頁面閱讀契約

### 4.1 先定一頁唯一任務

每頁開始寫文案或排版前，必須先回答：

1. 訪客為什麼會進到這頁？
2. 他進來時最可能在想什麼？
3. 讀完後只需要多完成哪一個判斷？
4. 主要 CTA 要把哪一種成熟度的訪客送去哪裡？
5. 哪些相鄰內容明確不由本頁負責？

不能用「介紹 About」「展示 Work」「放課程」當頁面任務。任務必須寫成訪客成果，例如「判斷這個人的經歷與做事方式是否值得信任」。

### 4.2 每個區塊只做一件事

一頁通常規劃 4 至 7 個閱讀節點。每個節點都要寫清楚：

| 欄位 | 必須回答 |
| --- | --- |
| 讀前想法 | 訪客到這裡之前在想什麼？ |
| 區塊任務 | 這段只讓他理解哪一件事？ |
| 內容或證據 | 哪段文字、案例、圖片或事實支撐它？ |
| 情緒變化 | 讀完更安心、更好奇、更信任，還是更能做決定？ |
| 行動 | 這裡真的需要 CTA 嗎？如果需要，只推哪個動作？ |
| 退出條件 | 拿掉哪段內容仍不影響任務？哪些素材應移到其他頁？ |

素材存在不是使用理由。若一段同時介紹 CabAI、課程、顧問、作品與文章，通常代表區塊任務尚未收斂。

### 4.3 安排認知與情緒起伏

頁面不能一路列能力、列服務或列名詞。應明確安排：

- 先辨識問題，還是先建立身份？
- 信任證據在哪個疑慮出現後提供？
- 哪個區塊是全頁信任高點？
- CTA 出現時，訪客是否已經知道為什麼要點？
- 結尾是要做決定、保留低壓力入口，還是回到診斷？

證據必須緊鄰它支撐的主張，不能縮成角落附註，也不能用無關數字製造權威感。

## 5. CTA 角色與外觀契約

### 5.1 CTA role

| Role | 用途 | 常見外觀 | 限制 |
| --- | --- | --- | --- |
| Primary | 完成頁面的主要決策 | filled button | 同一決策區通常只有一個 |
| Secondary | 提供另一個合理但較低權重的選擇 | bordered paper button | 不與 Primary 做成兩個同權重深色按鈕 |
| Contextual | 延續訪客剛產生的動機 | compact filled 或 bordered paper button | 必須出現在相關內容讀完之後 |
| Recovery | 讓不確定或走錯的人回到可重新判斷的位置 | bordered paper button | 關鍵 recovery 不得縮成角落小字 |
| Navigation | 跨頁或全站探索 | clear text link 或 navigation item | 不得冒充頁面自己的下一步 |

### 5.2 每個 CTA 必填規格

Master Plan 的 CTA inventory 必須逐項定義：

- accessible name 與可見文字；
- destination 或頁內 anchor；
- role；
- 外觀：filled、bordered paper、text link；
- Desktop 尺寸與位置；
- Mobile 寬度、排列與至少 44px 的互動高度；
- hover、active、focus-visible；
- 外部連結的 `target`、`rel` 與真實 URL；
- 不可退回的低辨識形式。

只有顏色不是可點提示。重要文字連結至少還要有箭頭、邊界、底線或明確的 action row。CTA 文案離開上下文後仍應大致說得出目的，避免「了解更多」「下一步」等空泛名稱。

## 6. Route、流程與比較表的規格

任何 Route、時間軸、步驟、圖例、方法順序或選擇比較，都必須分別定義：

1. **語意順序**：為什麼是這個順序？
2. **DOM 順序**：鍵盤與螢幕閱讀器實際讀到的順序。
3. **Desktop 視覺**：欄位、導引線、方向、編號與層級。
4. **Mobile 視覺**：是縮成橫向、改為垂直，還是拆成可掃讀段落？
5. **辨識元素**：編號、箭頭、標籤、目前位置或停止條件。
6. **回復路徑**：不確定時要去哪裡重新判斷？

不能只寫「顯示 A → B → C」，也不能只確認三個文字存在。

順序必須服務頁面任務，不必讓所有區塊服從同一分類。例如 Expertise 的 Diagnosis 依症狀排序，Method map 與 Route 才固定使用 Context → Skill → Harness。若為了整齊強迫症狀表跟著方法順序，反而會破壞讀者帶入。

## 7. 文案與標題驗收

### 7.1 文案

- 先說人能辨識的情境，再說專有名詞。
- 一句只承擔一個主要意思，能自然朗讀。
- 不用抽象流程口號代替訪客利益。
- 不為了素材完整而重複其他頁面已負責的解釋。
- 不承諾沒有持續提供的更新頻率、內容或服務。
- 不新增無來源的數字、結果、見證、客戶名稱或產品能力。
- 每一段都要能回答「訪客可以從這裡得到什麼」。

### 7.2 大標題

- 先人工安排 phrase grouping，再使用 `text-wrap: balance` 或 `pretty` 輔助。
- Desktop 與 Mobile 必須分別檢查，不可相信自動換行。
- 不允許孤立標點、單字、方法名或中文複合詞被拆壞。
- 排版不成立時，先調整句組或文案，不先縮小到破壞主視覺。
- 特大標題是否使用句號，依語氣與畫面決定；同一頁應一致，不把標點當裝飾。

## 8. 紙張與響應式布局標準

### 8.1 紙張責任

- `.paper-card` 只負責紙張材質、邊緣與表面。
- `.paper-card__inner` 或頁面等價安全區負責內容內距。
- 可變文案不得依賴固定高度，也不得靠 `overflow: hidden` 掩蓋跑版。
- 不在紙張裡再蓋不透明白卡遮住材質。
- 迴紋針、章戳、標籤與裝飾只有在能幫助辨識內容角色時才使用。

### 8.2 Responsive

- Desktop 不代表把 Mobile 拉寬；Mobile 也不是把 Desktop 表格壓窄。
- 320px、360px、390px 必須保留正常正文、紙張安全內距與零水平溢位。
- 1280px、1440px 必須檢查側欄、欄位對齊、右側安全內距與 CTA 權重。
- Sticky Headbar 存在時，所有 anchor 必須有足夠 `scroll-margin`；跳轉後目標不可被遮住。
- 陰影、背景圖與 pseudo-element 在 Mobile 要獨立驗證，不能形成第二層深色底或露出父容器。

## 9. Production 視覺驗收

### 9.1 每輪都要重新捕捉

視覺驗收只能使用本輪 production runtime 的新截圖。舊圖可以作基線，不能冒充目前證據。每張截圖必須先打開檢查，若為空白、載入中、裁切錯誤、錯頁或錯狀態，必須捨棄重拍。

最低 viewport：

| Viewport | 核對重點 |
| --- | --- |
| 1440 × 900 | 完整 Desktop 層級、側欄、主要 Route／CTA |
| 1280 × 720 | 一般筆電高度與欄位壓縮 |
| 390 × 844 | 主流 Mobile、Headbar、標題與 CTA |
| 360 × 800 | 窄 Mobile 的斷句與 safe inset |
| 320 × 568 | 最窄支援尺寸、零水平溢位與互動辨識 |

每頁至少保存：首屏、主要任務區、關鍵 CTA／Route、頁尾決策區；若內容很長，再補完整長頁作整體節奏檢查。

### 9.2 技術證據與體驗證據分開

技術證據：

- 正確原生元素與 href；
- accessible name；
- DOM 順序；
- `scrollWidth === innerWidth`；
- 互動高度至少 44px；
- focus-visible、Enter、anchor offset；
- `npm run check`、`npm run build`、`git diff --check`。

體驗證據：

- 五秒內看不看得出這頁的用途；
- 一眼看不看得出哪個是主要行動；
- 流程方向是否不必讀完內文就能理解；
- CTA 是否像可點的元件，而不是一般小字；
- 標題與正文是否形成自然閱讀節奏；
- Desktop 與 Mobile 是否都維持同一決策意圖。

兩組都通過才算完成。

## 10. 每頁 Master Plan 的必要章節

後續每一頁的 Master Plan 至少包含：

1. 產品意圖、Actors 與唯一訪客任務。
2. Primary／Supporting／Soft goals。
3. Domain invariants、non-goals 與頁面邊界。
4. 現況 production 截圖與事實基線。
5. 閱讀節點表：讀前想法、區塊任務、證據、情緒、行動。
6. CTA inventory，包含 role、外觀、destination、Mobile 與 states。
7. Route／流程／比較表的語意、DOM、Desktop、Mobile 規格。
8. 標題 phrase grouping 與文案待確認清單。
9. Phase、檔案、禁止項、rollback 與 outcome evidence。
10. Goal-to-plan traceability 與 outcome-based DoD。

若計畫只寫「調整 CTA」「美化流程」「套紙張風格」，但沒有具體外觀、讀者感受、響應式與截圖驗收，判定為 `Needs Revision`，不得開始實作。

## 11. 文件與 checkpoint 紀律

- 長期標準只保存可跨頁重用的原則；單輪修改、臨時狀態與 commit 清單留在該頁 Master Plan 或 audit README。
- 使用者確認畫面後，進入下一頁或大改前立即建立 checkpoint。
- 每個 checkpoint 前確認 staged files，只提交本輪程式、契約、文件與已人工接受的證據。
- 文件、程式碼、production 畫面與連結目的必須同一輪同步；不能出現「說的是一套、做的是另一套」。
- 新一頁開始前，先引用本文件並逐項填完 CTA 與視覺驗收，不再只沿用上一頁的 class 名稱。

## 12. 最終判定

一頁只有在下列問題都能回答「是」時才算完成：

- 訪客知道這頁與自己有什麼關係嗎？
- 每個區塊只推進一個清楚的認知或情緒任務嗎？
- 證據出現在疑慮發生的位置嗎？
- CTA 的角色、目的與可點邊界一眼可辨識嗎？
- Route 或流程不看說明也能大致讀懂方向嗎？
- Desktop、390px 與 320px 都沒有壓縮、裁切或溢位嗎？
- 標題斷句、紙張安全內距、Headbar anchor 與鍵盤操作都已用真實畫面驗證嗎？
- 拿掉任何產品名後，頁面的核心敘事仍然成立嗎？

只通過 build、DOM 或尺寸檢查，不足以宣告頁面完成。
