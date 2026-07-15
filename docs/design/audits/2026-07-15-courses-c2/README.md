# Courses C2 yellow recommendation paper audit - 2026-07-15

## Decision

使用者確認 `01-04` 的「建議從這裡開始／名稱／結果／價格／行動」最適合使用既有黃色紙張。本輪把 material role 固定為：

- 外層白紙：描述訪客目前的狀況與路線判斷。
- 內層黃紙：承接具體建議、預期結果、價格或狀態與下一步。
- 白色小紙按鈕：只出現在三條目前可採取的路線。
- 第二條黃紙：保留建議內容，但只顯示更新狀態，不模仿可點擊 action。

這不是新增四張等權重商品卡，而是用材質把「你的狀況」與「我建議你怎麼開始」分開。

## Scope

- Production: `src/pages/courses/index.astro`
- Contract: `docs/contracts/courses-yellow-route-actions-c2-2026-07-15.md`
- Route: `/courses/#learning-map`
- Reused asset: `--paper-reading-card-image`
- Deferred: CabAI onboarding、帳號按鈕權重、Mobile rail 與 anchor 的 C3 全面處理。

## Visual evidence

- `01-before-desktop-learning-map.png`: C1 完成後、C2 前的淡紫 suggestion block 與小型文字連結。
- `03-desktop-route-01-yellow-paper.png`: 一般瀏覽器寬度下的免費診斷黃紙與 bordered paper action。
- `04-pending-route-yellow-paper.png`: 一般瀏覽器寬度下的未開放黃紙與純狀態文字。
- `05-paid-route-yellow-paper.png`: AgentSkill 價格與 action 在同一黃紙內的層級。
- `06-desktop-1280-route-01.png`: 1280px Desktop route surface。
- `07-mobile-390-route-01.png`: 390px 免費診斷，action 在黃紙安全區內 full width。
- `08-mobile-390-pending.png`: 390px 未開放 route，虛線黃紙、無假按鈕。
- `09-mobile-320-paid-route.png`: 320px AgentSkill 黃紙與自然換行 action；C2 map 本身無 overflow。

## Runtime facts

### 1280px Desktop

- Viewport: `1280 x 800`。
- 三個 `.learn-map__route-action`：`142.5 x 48px`、`183.8 x 48px`、`183.8 x 48px`。
- 四個 `.learn-map__solution` 的 computed background 均解析為 `paper-reading-card` WebP `image-set(...)`。
- Pending solution border 為 dashed；其餘三個為 solid。
- `documentElement.scrollWidth - clientWidth === 0`。

### 390px Mobile

- Viewport runtime: `390 x 845`。
- 第一個 action：`197.6 x 48px`；solution 左右邊界為 `108px` 與 `342.6px`，沒有超出 viewport。
- Pending solution viewport rect 為 top `346px`、bottom `581px`，畫面可完整檢查。
- `documentElement.scrollWidth - clientWidth === 0`。

### 320px narrow Mobile

- 初次補查發現兩個長 action 的 `white-space: nowrap` 會撐寬 learning map；此結果未通過 C2 gate。
- 修正後只在 `max-width: 340px` 允許 action label 自然換行；route title 從 `21.6px` 收到仍清楚的 `20px`，讓 `AgentSkill：` 保持完整，不產生行首孤立冒號。三個 action block size 仍至少 `48px`，`.learn-map` 回到 `scrollWidth === clientWidth === 281px`。
- 全頁 document 仍比 client area 多 `5px`。定位後來源是既有 Hero H1 最後一句 `最卡的那一步。`，該 phrase `scrollWidth - clientWidth === 37px`；不是黃色紙或 action 造成。依切片邊界保留給 C3 的 Mobile 句組與 rail 處理，不把 320px 全頁誤寫為已通過。

### Interaction and semantics

- 三個可走 route 都是原生 `<a>`，href、external target／rel 與 CabAI campaign 未變。
- Pending solution：`a === 0`、`button === 0`；solution 與 status computed cursor 都是 `auto`。
- Action min block size 為 `3rem`，runtime computed height 為 `48px`。
- Button normal contrast `6.30:1`，hover `5.82:1`；黃紙 body text `4.73:1`，title `11.13:1`。
- `@media (forced-colors: active)` 移除背景圖與 shadow，保留實體 border 與 system colors。

## Fresh preview incident and resolution

第一次 HMR 後，瀏覽器已收到新 HTML class，但仍保留舊版 CSS，runtime 量到 action `42.2px`、背景圖為 `none`。此畫面被判定為 stale，不作為完成證據。

重啟本機 Astro preview、重新 claim 使用者分頁並 fresh navigate 後，browser style tag、computed styles、尺寸與截圖才全部對齊 production source。上列 `03-08` 與 runtime facts 都來自這次 fresh preview。

## Automated gate

- `npm run check`: pass，`0 errors / 0 warnings / 18 existing hints`。
- `npm run validate:content`: pass。
- `npm run build`: pass；既有 Vite public asset placeholder warnings 保留，未由 C2 新增。
- `git diff --check`: pass；僅有既有 LF／CRLF conversion notices。

## Master Plan alignment

- 對應 Courses C2：三個可走入口已升為至少 48px 的 contextual／recovery paper actions。
- 對應 Learning route contract：DOM 與 01-04 排序未變，黃色紙只承接 route recommendation。
- 對應 unavailable invariant：第二條沒有 href、button、pointer cursor 或 hover affordance。
- C3、C4 仍為 pending；本輪沒有把 Courses 頁面標示為全部完成。
