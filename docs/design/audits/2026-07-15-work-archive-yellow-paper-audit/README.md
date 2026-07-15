# Work 封存與黃色紙張跨頁審查

日期：2026-07-15  
範圍：Work 公開入口、About 導流、舊網址、sitemap，以及黃色紙張在其餘主要頁面的適配度。  
狀態：production 已實作，等待使用者畫面確認；黃色紙張僅完成規劃，未在其他頁面施工。

## 結論

Work 目前確實是全站最卡的頁面。問題不在版型，而是它同時重複 About 的公開輸出、Home／Courses 的手冊敘事，以及 Services 的服務橋接；剩下真正能獨占的「限制、取捨、驗證」又沒有足夠公開資料支撐。暫時封存比勉強補內容更誠實，也讓主導覽回到四個明確任務：專業方法、學習、合作、關於。

黃色紙張的最適 owner 是 Services，但不建議再加一排重複的服務卡。較好的做法是把三個既有 service option 的「編號／標題／一句 outcome」做成黃色摘要紙張，右側或下方仍保留白底的適合情境與交付內容。這樣能延續已核准的素材語意，又不會重複服務名稱、客戶資訊或 CTA。

## 逐步審查

### 1. Work 原頁面 — Needs restructuring

![Work 封存前](./01-work-before-archive.jpg)

- 公開紀錄與 About 的公開輸出重複。
- 黃色服務橋接本身成立，但其內容 owner 實際是 Services。
- 沒有足夠 source-backed decision records 時，Work 無法完成比 About 更深的獨占任務。

### 2. 舊 Work 網址 — Healthy

![Work redirect 後](./03-work-redirect-after.jpg)

- `/work/` 不再輸出封存內容，靜態轉向 `/about/#public-output-title`。
- 產物含 `noindex`，sitemap 不再列出 `/work/`。
- 原始碼保留在 `src/archive/work.astro`，可以復原，但不會被 Astro 當成正式頁面。

### 3. About 導流 — Healthy

![About Hero 調整後](./04-about-hero-after.jpg)

![About 公開輸出 actions 調整後](./05-about-public-actions-after.jpg)

- Hero 改為同頁「先看公開輸出」，不再把訪客送往角色不明的 Work。
- 公開輸出 action area 只保留 GitHub 個人頁與 Threads 帳號。
- Desktop 當次畫面與 DOM 均沒有 Work 入口；手機選單共用同一份 `primaryNavigation`，production source 亦無 `/work/` link。
- 本次 in-app browser 的暫時 viewport override 未生效，因此不把外部 renderer 當成正式手機 evidence；390px 畫面留待 Services `S2a` 或最終 page gate 在 in-app browser 補驗。

### 4. Services — Best fit

![Services 目前 service options](./10-services-options-current.jpg)

- 黃色紙張原本承載的就是 `serviceTracks`，資料與訪客任務都由 Services 擁有。
- 建議套在每個既有 service option 的摘要面：`01–03`、中文標題與一句 outcome。
- fit、deliverables 與邊界維持白底詳細閱讀，不新增另一排重複卡片。
- 不放客戶／公司名稱，不增加每卡 CTA；全頁仍由最後的 Email Primary 統一收斂。

### 5. Courses — Conditional

![Courses learning map](./11-courses-learning-map-current.jpg)

- Learning map 已有 `START HERE` 紙張提示與清楚的可用／未開放狀態。
- 若未來需要黃色，只能標示「目前可採取或可購買的下一步」，不能讓四條路都像已開賣商品。
- 現階段再加黃色卡會和既有 route rail、status chips 競爭，因此不建議現在施工。

### 6. Expertise — Low priority

![Expertise next step](./12-expertise-next-current.jpg)

- 頁尾已用兩個清楚 CTA 完成「自己學／討論情境」分流。
- 黃色紙張最多只能作單一 next-step note，不應套進診斷表或方法地圖。
- 目前沒有足夠收益，不列入近期施工。

### 7. Home — Avoid

![Home route chooser](./13-home-routes-current.jpg)

- 首頁已用三列中立路線完成診斷、學習、合作分流。
- 黃色若只強調合作會破壞中立判斷；三列全黃又會形成第二個視覺主角。
- 維持現況。

### 8. Articles — Avoid

![Articles index](./14-articles-current.jpg)

- 文章索引的任務是依問題閱讀，不是選服務或付費下一步。
- 黃色紙張會讓主題導覽看起來像商品卡，維持白紙 editorial hierarchy 較一致。

### 9. About — Avoid additional yellow

- About 的中段是可查驗信任證據；改黃會把作品／交付經驗誤讀成服務選項。
- 付費分流已由頁尾 Services Primary 與 Courses Secondary 負責，不再新增黃色銷售層。

## 技術驗證

- `npm run check`：通過，0 errors、0 warnings；保留既有 18 hints。
- `npm run validate:content`：通過。
- `npm run build`：通過；`/work/index.html` 只生成靜態 redirect。
- `git diff --check`：通過。
- production source 搜尋：沒有可見 `/work/` 入口；封存檔除外。
- `dist/sitemap-0.xml`：沒有 `/work/`。
- 所有列入本報告的畫面證據均由 in-app browser 當次擷取。

## 下一個可執行切片

先完成本輪使用者確認與 checkpoint。之後若進 Services，將黃色紙張拆成獨立 `S2a` 小切片：只改三個既有服務摘要面的材質與 responsive layout，不同時改聯絡 CTA、流程、邊界或其他頁面。
