---
status: active
source_snapshot: 2026-07-11
source_root: D:/_CabLate_Agents/general/projects/threads-personal-growth-reverse-analysis-2026-07/content-os-notion-backup-2026-07-11
---

# CabLate 全站內容配置

## 1. 網站要完成的事

CabLate.com 是公開權威中樞，不是把所有資料公開的知識庫。每個頁面只負責一個決策：認識、相信、探索、學習、合作或訂閱。

核心主張：判斷力比執行力值錢。

核心身份：全端工程師出身的 AI 應用創作者與講師，將 Claude Code、Agent、MCP、Skill、Context 與產品工程背後的判斷，轉成能用、能驗收的工作流。

## 2. 素材治理

- A：可直接公開，仍需保留來源與查核日期。
- B：只可使用聚合版、匿名版或經 Cab 核准的改寫版。
- C：只用來理解能力與策略，不出現在公開頁。
- 不公開：營收、客戶機密、未授權姓名／Logo／照片／原話、內部 SOP、env、權限與測試資料。
- 動態數字以 `asOf` 呈現，不寫成永久事實。

## 3. 每頁唯一任務

| 路由 | 訪客問題 | 頁面任務 | 主要素材 | Primary CTA |
|---|---|---|---|---|
| `/` | 你是誰，我該從哪開始？ | 五秒辨識＋三路分流 | A 定位、E 三個 Green proof、B 代表作品、C 三個方法 | 選擇學習／作品／合作路徑 |
| `/about/` | 為什麼你的判斷值得相信？ | canonical 作者身份與旅程 | A 旅程、F 非本科故事、A 哲學、H 開源 proof | 看方法與代表作品 |
| `/articles/` | 你真正持續研究什麼？ | 以主題探索知識，不只是最新文章 | C 六大專長、G topic clusters、現有文章 | 進入一篇旗艦內容 |
| `/articles/[slug]/` | 這篇內容可靠嗎？下一步是什麼？ | 回答單一問題並提供來源、作者與下一步 | C 方法、FAQ、來源、相關文章 | 訂閱或進入相關學習／服務 |
| `/courses/` | 我離成果多遠，該買哪一層？ | 學習路線而非商品牆 | D 免費→講座→課程→手冊→陪跑 | 選擇當下可交付產品 |
| `/courses/[slug]/` | 適不適合我，會拿到什麼？ | Outcome／fit／課綱／限制／proof | D 產品文案、E 專屬 proof、C FAQ | 購買或加入等待名單 |
| `/services/` | 我需要內容、課程還是個別判斷？ | 服務決策與適配篩選 | D 企業／顧問、B 匿名案例、E 企業 proof | 提交合作情境 |
| `/starter-pack/` | 免費資源能幫我跨過哪一步？ | 交付一個明確起點並取得同意訂閱 | D 免費邊界、C Claude Code 痛點、E 講座 proof | 領取 Starter Pack |
| `/search/` | 我知道問題，但不知道在哪一頁 | 全站內容尋路 | 文章、課程、方法、作品 taxonomy | 開啟最相關內容 |
| `/privacy/` | 你如何處理我的資料？ | 說清楚資料、第三方與退訂 | 實際表單／分析工具狀態 | 無商業 CTA |

## 4. 建議新增路由

### `/work/`

代表作品索引。只選能證明不同能力的 6–8 件，不列完整 repo 清單。

- 知識產品：Claude Code 深度工程手冊。
- 課程系統：VibeCoding 四週課／Claude 工作坊。
- 教學平台：Interactive Engine。
- 產品系統：cabai（公開抽象版）。
- 開源工具：mcp-google-map。
- 資料產品：banini-tracker。
- 匿名能力證明：企業內訓、電商平台 MCP 測試，只能發布為 Project Note，未有 outcome 與授權前不稱 Case Study。

### `/expertise/`

不是技能清單，而是 Cab 的六個權威主題：Harness Engineering、Context Engineering、Skill 設計、Claude Code／Agent 工作流、Vibe Coding 落地、AI 教學設計。

### `/guides/` 與 `/methods/[slug]/`

把長期維護、可引用的定義與框架從時效文章分開。首批：Harness Engineering、Context Engineering、Skill 路線設計。

### `/learn/`

中期取代單純 `/courses/` 商品列表，依「離成果多遠」分流免費內容、短講、系統課、手冊、陪跑與顧問。未開放產品不得建立空銷售頁。

### `/newsletter/`

說清楚訂閱承諾、頻率、代表期數、產品通知與隱私；首頁表單只保留短版。

### `/contact/`

收集目標、現況、團隊、期限、已嘗試方法與希望成果，避免只導向 Threads 私訊。

## 5. 素材重組規則

一份 Markdown 不等於一頁。網站使用以下原子：

- Claim：一句可驗證主張。
- Proof：數字、來源、日期、公開層級。
- Story：只保留服務主張的轉折，不寫私密細節。
- Method：定義、誤判、使用時機、限制、案例。
- Project：問題、Cab 角色、判斷、實作、證據、公開邊界。
- Product：適合／不適合、成果、內容、限制、狀態、CTA。
- FAQ：來自真實問卷與工作流問題，不為 SEO 虛構。
- CTA：每頁一個主要意圖，名稱描述目的地。

## 6. 內容使用優先序

### 首頁

只放能快速判斷的內容：身份、人話 Bio、三條路徑、4.59／81、5.5K+、500+、一個旗艦作品、三個方法、最新文章、電子報。開源矩陣與完整旅程不放首頁。

### About

使用非本科轉職→全端與架構→AI 應用→2025-06 全職 CabLate 的旅程。主張由「貨真價實、先上線再迭代、地基派、系統化大於靈感」支撐，再用 mcp-google-map、banini-tracker、claude-code-research 等公開 repo 證明實作歷史。

### Articles

以六個專長主題導覽，現有文章分入 Claude Code、Agent 失效診斷、Vibe Coding／產品工程。G 的 16 個主題只作 editorial backlog，不全部變成首頁分類。

### Learn／Courses

公開產品依序：免費 Starter Pack、短講／工作坊、金流課、VibeCoding、Claude Code 深度工程手冊。會員與高階陪跑仍屬 B，狀態未確認前只在策略層存在。

### Services

合併成三種結果：工作流診斷、課程／內訓設計、AI 產品與 Agent 導入。每種服務要列適合、不適合、交付物、流程、限制、所需前置資料與匿名 proof。不得保證商業結果。

## 7. 首批內容缺口

1. 正式 headshot 與多比例版本。
2. Cab／CabLate／正式姓名公開關係最終核准。
3. Newsletter promise、頻率、代表期數與 welcome sequence。
4. Starter Pack 真實交付與 thank-you flow。
5. 現在可購買／可預約的產品狀態矩陣。
6. 企業服務表單與適配條件。
7. 首批三個案例的匿名／署名／圖片授權。
8. Testimonial 授權流程。
9. 動態 proof 每月刷新機制。

## 8. 實作順序

1. 將 A 級內容原子化到 `src/config/authority.ts`。
2. 補強 Home／About／Articles／Courses／Services／Starter Pack。
3. 建立 Work 與 Expertise，再建立 Guides／Methods。
4. 完成 Newsletter／Contact 與跨站 CTA 追蹤。
5. 最後補圖片與授權素材，不讓 placeholder 阻擋內容架構驗證。

