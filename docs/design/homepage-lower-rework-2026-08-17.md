# 首頁後半段調整紀錄

日期：2026-08-17  
範圍：首頁的「下一步選擇 → 講師經歷與社群旁證 → CabAI 交接 → 電子報」  
基準：`c46c68b feat: refine homepage hero and diagnostic story`

## 先看結論

這一輪把信任段從「技術作品清單」改成真正回答讀者疑問的證據線：

```text
這一年站過哪些現場
        ↓
每一段講師經歷留下什麼可核對的結果
        ↓
現在有多少人持續看 CabLate 的公開分享
```

主證據是 2025 年 7 月首次受邀講座、2025 年 10 月主辦第一場講座，以及目前持續交付的企業內訓與工作坊。Threads Profile 只作當下社群觸達的旁證，不代表課程成效，也不再拿 2025 年回顧頁冒充目前社群數字。

Hero 與診斷台沒有在本輪重新設計；CabAI、Newsletter 與前一輪已確認的架構保留。

## 本輪交付

### 1. 下一步選擇：三個平行入口

- 保留三個讀者入口，但使用 `<ul>`／`<li>` 表達平行選擇
- 不再使用 `01／02／03`，因為入口不是必須依序完成的流程
- 每列維持「我現在想做什麼 → 可以得到什麼 → 往哪裡去」
- 手機改成單欄堆疊，避免桌面版的三欄壓縮成難掃讀的窄格

三條路的結果分別是：看完整判斷路徑、看可以自己學的內容、查看合作方式。

### 2. 講師經歷：用時間與現場建立信任

信任段的標題是：

> 這一年，我從受邀分享開始，也自己辦講座、做工作坊和企業內訓

內容順序固定為：

| 順序 | 畫面文字 | 可核對來源 | 在頁面負責的事情 |
|---|---|---|---|
| 2025.07 | 從第一次受邀講座開始 | `public/2025-review.html`：首次受邀講座分享；研討會、開發者社群 | 交代講師經歷的起點 |
| 2025.10 | 接著主辦第一場講座；首頁簡寫為「網站資安入門，200 人報名。」 | 同檔案：免費網站資安入門；200 人報名、50% 參與率 | 首頁只保留場次與報名數；完整來源資料留在文件，不把所有查核結果塞回畫面 |
| 目前 | 企業內訓與工作坊持續交付 | `about.astro` timeline、`authority.ts` training track、現行公開內容結構 | 說明現在提供的形式與交付方法，不虛構場次數量或企業名稱 |

`2025-06 至今` 只放在段落導言，作為這段時期的總結；不把它當作第三個倒序時間點。這樣視覺 rail 是「已核實的時間順序」，不是用動畫製造一條看似精確但無來源的履歷。

時間線不另加 `01／02／03` 小型索引；日期、rail 與內容順序已能完成導讀，額外編號只會重複資訊，並回到裝飾性微標的濫用。

第三筆的內容限縮為已核實的需求與交付工作：需求／受眾盤點、課綱、示範案例、實作題目、課後改善建議與學習方向。已移除沒有來源支持的「現場把問題做出第一個版本」等擴張主張。

### 3. Threads：直接放現在的 Profile

- 圖片：`public/images/proof/threads-cab-late-profile-2026-08-18.png`
- 數字：9,163 位追蹤者
- 畫面不另放擷取日期與主題微標；來源截圖留在文件與素材檔名中
- 連結：`https://www.threads.net/@cab_late`
- 用途：讓讀者直接核對目前的公開 Profile；不是 2025 年度回顧，也不是課程／顧問成果的替代證據

### 4. CabAI：保留「交接」而非平台名詞堆疊

這段仍然是：

```text
CabLate：先把卡點看清楚
        →
CabAI：拿一份內容開始實作
```

首頁只保留兩條可直接採取的路徑：公開文章前往 `/library`，課程平台前往 `/products`。標題先說「課程和文章，都放在 CabAI」，再讓讀者依「先找一篇內容」或「照完整路徑實作」選入口；不拿 `Skill`、`Agent API` 或登入後狀態搶第一層注意力。兩個入口分別使用 `home_cabai_library` 與 `home_cabai_courses` attribution。

### 5. Newsletter：保留可用性，不增加卡片噪音

- 保留可見 Label、`email` 型別、`autocomplete`、POST action、成功訊息與錯誤 live region
- 手機 email input 使用 16px 字級、`inputmode="email"` 與 `enterkeyhint="done"`，避免輸入時縮放或鍵盤意圖不明
- 保留鍵盤可見的紫色 `:focus-visible` ring
- 不再包一層重複紙卡或裝飾性小標
- 收尾文案只說寄送時機、頻率與退出方式，不再列完整資源分類或重複行銷保證

## GSAP 動態契約

GSAP 不是為了把每段文字做成淡入，而是讓讀者捲動時知道「頁面進入新的心理階段」以及「現在正在讀哪一段講師證據」。沿用既有 `gsap` 與 `ScrollTrigger`，分成 chapter transition 與 speaker evidence 兩個 lifecycle owner；不使用 scroll snap、pin 或強制吸附。

| 動詞 | target | 意義 | trigger | end／結束 | reduced-motion | cleanup |
|---|---|---|---|---|---|---|
| 交接／填入 | speaker progress rail | 將讀者在時間線上的閱讀進度視覺化 | speaker trace 進入 viewport；`top 72%` | trace 到 `bottom 28%`，`scrub: .35` | 直接顯示完整 rail | `gsap.context().revert()` |
| 聚焦 | 當前 speaker record | 明確指出目前焦點場次，不讓 rail 冒充新資料 | 每筆 record 的 `top 68%` | `bottom 32%`，進入與回捲都更新 | 第一筆保持完整可讀，不依動畫理解 | `ScrollTrigger` 由 context 一起清除 |
| 交接／換片 | event photo frame | 將目前場次與相對應現場照片連起來 | record `onEnter`／`onEnterBack` | 舊片淡出上移，新片短距離進場；約 0.5 秒 | 手機與 reduced motion 使用靜態 visual strip，所有文字與必要圖片可見 | kill tweens、`context.revert()` |
| 落位 | 重大章節 lead | 讓「選路 → 人的證據 → CabAI」像舞台交接，而不是一串同底色容器 | section top 從 viewport `86%` 到 `62%` | `translateY(22px → 0)`，`scrub: .45`，不改內容透明度 | 保持原位、完整可讀 | chapter context `revert()` |
| 展開 | 講師證據紙張頂端 seam | 明確結束選路階段，開始經歷與社群證據 | identity top 從 viewport `92%` 到 `66%` | seam `scaleX(.08 → 1)`，`scrub: .4` | 直接顯示完整 seam | chapter context `revert()` |

邊界：桌面只有短距離 sticky photo，不把讀者困在長 pin；手機不 pin，講師 records 先於 visual proof，照片改為一張主要現場照片加一張短 strip，Threads 放在 records 後。若瀏覽器不執行 JS，第一張照片仍由 CSS 顯示；`prefers-reduced-motion: reduce` 時，CSS 顯示完整文字與必要影像，JS 不建立 ScrollTrigger。

章節分界採三種強度：深色舞台表示大轉折；紙張材質表示可核對的經歷／社群證據；同一證據章內才使用細線與局部底色。Threads 是紙張內的淡紫 evidence band，不另包紙卡或四邊框。Astro View Transitions 重新換頁時以 `astro:before-swap` 清理 context、監聽器與狀態，`astro:page-load` 再初始化，避免重複掛載。

## 已核對的來源與不確定性

| 項目 | 來源 | 狀態／限制 |
|---|---|---|
| 2025-06 至今全職投入 CabLate | `src/pages/about.astro` timeline；`docs/content/site-copy-structure-current-2026-07-15.md` | Confirmed in source |
| 2025-07 首次受邀講座、研討會與開發者社群 | `public/2025-review.html` | Confirmed in source；頁面沒有在首頁宣稱活動名稱 |
| 2025-10 主辦第一場講座、200 人報名、50% 參與率 | `public/2025-review.html` | Confirmed in source；數字保留原始範圍，不外推成長率 |
| 企業 AI 內訓、系列工作坊、線上實作課 | `authority.ts` training track、現行公開內容結構 | Confirmed as service/content scope；沒有宣稱特定企業或場次總數 |
| 需求盤點、示範、實作題目、課後建議 | `src/config/authority.ts` 的 training deliverables | Confirmed as 交付內容；不等於每一場都包含全部項目 |
| Threads 9,163 位追蹤者 | `public/images/proof/threads-cab-late-profile-2026-08-18.png` | Screenshot evidence，擷取日 2026-08-18；數字會變動，頁面不另加裝飾性日期微標 |
| `/about/#delivery-experience-title` | `src/pages/about.astro` | Confirmed；anchor 真實存在 |
| GSAP／ScrollTrigger | `package.json`、`src/pages/index.astro` | Confirmed in implementation；仍需真機效能與 Lighthouse 量測 |

尚未主張的內容：企業名稱、累計授課場次、總學員數、目前 Threads 的貼文／互動總量、課程轉換率、每場都達成的具體成效。這些資料若要進首頁，需先取得帶日期與範圍的第一方來源。

## 畫面驗收

本輪只保留與 speaker／GSAP 驗收直接相關的 viewport 截圖：

| Viewport | 截圖 | 檢查內容 |
|---|---|---|
| 1440×900 | `artifacts/homepage-speaker-gsap/after-1440.png` | 桌面 Hero／後半段舞台基線 |
| 760×900 | `artifacts/homepage-speaker-gsap/after-760-top.png`、`after-760-speaker.png` | 中尺寸自然改成單欄，照片與 records 不重疊 |
| 390×845 | `artifacts/homepage-speaker-gsap/after-390-hero.png`、`after-390-speaker.png` | 手機不 pin，records 先讀，必要照片與 Threads 依序可讀 |

實際瀏覽器檢查結果：

- 1440：`scrollWidth = 1425`，視窗有固定側欄，沒有內容超出可用頁面寬度
- 760：`scrollWidth = 745`，沒有水平內容溢出
- 390：`scrollWidth = 375`，差值來自瀏覽器垂直 scrollbar，沒有水平內容溢出
- 桌面捲動時 record active 狀態由 `invited-talk` → `hosted-talk` → `delivery`，照片由 meetup → workshop 交接
- 760／390：手機不使用 sticky pin；必要 visual 不遮住 records，Threads 在後段
- `/about/#delivery-experience-title` 可由首頁連結抵達

## 自動化驗證

- `npm.cmd run check`：Pass，0 errors；15 個既有 hints
- `npm.cmd run build`：Pass，53 pages built
- `git diff --check`：待本輪文件與 source 收尾後執行
- GSAP dependency：`package.json`／`package-lock.json` 已更新；build bundle 實際包含 GSAP／ScrollTrigger
- reduced motion：已由 source/CSS contract 驗證；Browser capability 未提供 media emulation，尚未做真實 OS preference screenshot

## 下一步

1. 父代理人工 review 三組 speaker 截圖與手機完整高度，決定是否調整照片裁切或文字密度
2. 若要公開更多授課／社群數據，先補日期、來源與範圍，再增加首頁證據
3. 之後再量測 GSAP bundle 與現場照片的傳輸成本，必要時改為更細的 lazy／responsive image strategy
4. 不在這個子任務 commit；由父代理整合所有首頁變更後決定提交內容
