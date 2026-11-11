---
title: "想叫 AI 掃自己產品的漏洞卻一直被擋？申請 OpenAI Daybreak，再用 Strix 打自己的靶機"
seoTitle: "AI 掃漏洞一直被擋？OpenAI Daybreak 申請條件＋Strix 打自己靶機實測"
description: "想請 Claude Code 或 Codex 檢查自己網站的資安問題卻一直被擋？先申請 OpenAI Daybreak 拿資安權限，再讓開源工具 Strix 打自己架的靶機。整理個人申請的現行條件（實體 FIDO2 金鑰）、Blue 與 Red 的差別，以及不打正式站的做法。"
publishDate: 2026-11-10T10:00:00+08:00
category: AI工具實戰
tags: [AI資安, OpenAI Daybreak, Strix, 滲透測試, Claude Code]
readingTime: 4
draft: false
excerpt: "想讓 AI 掃自己產品的漏洞，先申請 OpenAI Daybreak 拿資安權限，再讓開源工具 Strix 打你自己架的靶機。我那次測試約花 110 美金的額度，拿到一份完整的資安報告；但個人申請現在要實體 FIDO2 金鑰，攻擊型工作也要另外核准。"
problemTag: "請 AI 做資安檢測一直被擋"
---
想請 Claude Code 或 Codex 掃自己產品的漏洞，常連問網站有甚麼資安問題都被擋下。不用每次編劇本說服模型：先申請 OpenAI Daybreak 拿資安權限，再讓開源工具 Strix 打你的靶機（攻擊型的滲透測試要另外申請核准）。

主流模型對資安越收越緊，我申請一般人也能辦的 Daybreak 後，原本被擋的請求就能用 GPT-6 Sol 與 Luna 處理，再配 Strix 自動攻擊靶機出報告，那次測試 token 約 110 美金，以資安檢測來說我覺得很便宜。

| 比較項目 | 沒有許可、直接叫 AI 掃 | Daybreak ＋ Strix ＋ 靶機 |
|---|---|---|
| **對話框反應** | 連問網站有甚麼資安問題都被擋，有讀者遇到不顯示原因| 防禦型資安請求在 GPT-6 Sol／Luna 下大幅減少阻擋|
| **操作方式** | 有讀者每次請 Claude Code 或 Codex 弱掃都得先準備劇本| Strix 自動測試、以 PoC（概念驗證）驗證漏洞並出報告|
| **正式站風險** | 直接對線上服務測試，可能打壞正式站或正式資料| 正式站留在練習場外，只打獨立靶機，打壞直接刪掉重建|

## 先拿 Daybreak 許可，再進靶機跑 Strix

到 `chatgpt.com/cyber` 申請採整體審核、非自動通過（我 10 月申請時身分驗證 1 分鐘就過）。當時我建議沒實體金鑰可用電腦加手機設兩把 passkey，但官方規定須具備：

- **滿 18 歲與符合資格的付費方案**：須年滿 18 歲並訂閱符合資格的付費方案。
- **進階帳號安全**：開啟 Advanced Account Security。
- **實體 FIDO2 金鑰**：至少一支實體金鑰（第二支備援選用），軟體或同步 passkey 不算數。
- **避開不相容型號**：TrustKey T110、T120 不符資格。

接著先架一座不連正式資料的靶機，確認 Docker（隔離執行程式的容器工具）執行中並備妥 API Key，即可安裝 Apache-2.0 授權的 Strix：

```bash
curl -sSL https://strix.ai/install | bash
export STRIX_LLM="openai/gpt-6.1-sol"
export LLM_API_KEY="你的_API_Key"
```

`STRIX_LLM` 僅指定單一模型（`openai/gpt-6.1-sol` 需 Daybreak），官方查無拆分子代理的設定，我是請 AI 把主模型改 Sol、子代理改 Luna。

可複製這段範本請 AI 改。官方也要求透過 API 呼叫時在請求帶上 Daybreak 設定（`access_programs.cyber`），範本裡一併請 AI 確認：

```text
請閱讀 Strix 的 README 與設定文件，幫我把測試目標設定為我的靶機網址（確認不要連到正式站），並修改 Strix 的模型呼叫配置：將主模型設為 GPT-6 Sol，子代理設為 GPT-6 Luna，並確認 API 請求有帶上 Daybreak 的 `access_programs.cyber` 設定。改完先列出修改位置與啟動方式給我看。
```

## 申請了 Daybreak 還是會被擋嗎？

還是可能被擋，官方明講 Daybreak 只減少部分資安阻擋，不會移除所有防護，實務做資安的人也常反映掃程式碼可以、叫它攻擊仍會被攔。

像資安研究者 Ian Carroll 在 2026 年 11 月 5 日發文提到，當週參加直播駭客活動時，授權的安全研究與漏洞利用幾乎都被 Daybreak／CVP 擋下，改用 DeepSeek 與 GLM 5.3。對照官方文件，Daybreak 有以下三道邊界：

- **Blue 與 Red 分級**：防禦工作（程式碼審查、弱點分級與鑑識）屬 Blue，滲透測試、紅隊或 exploit 驗證等攻擊型工作須另核准 Red。
- **Astra 維持標準防護**：Blue 下僅 GPT-6 Sol 與 Luna 降低拒答，GPT-6 Astra（OpenAI 另一款模型）要降擋需拿到 Red。
- **高風險與模糊請求照擋**：高風險或意圖模糊仍可能被擋，以我的經驗，真的想要無阻攔就只有中國開源模型（如讀者提到的 Qwen 3.8、GLM）或自架地端模型。

## 讓 Strix 實際發動攻擊，把環境打壞怎麼退回？

Strix 會實際測試指定目標，只讓它打獨立靶機，被打壞就刪掉重建，正式站不在它的目標裡。

同時 OpenAI Cyber Abuse Policy 與 Strix「Authorized use only」都規定，只能測自己擁有或獲書面授權的系統。

下次想請 AI 掃自己產品的漏洞，記住「先拿許可、再進練習場」：先拿 Daybreak 權限，再讓 Strix 打獨立靶機。歡迎轉給自己做網站的朋友。
