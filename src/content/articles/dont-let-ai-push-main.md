---
title: "AI 幫你 push 完，正式站也跟著改了？三個勾讓 main 只能走 PR"
description: "讓 Claude Code、Codex 幫忙 push，專案又接了 Vercel，推上 main 就直接正式部署。在 GitHub 勾三個選項讓 main 只能走 PR，並說明分支保護預設不管管理員、一個人開發為甚麼別勾 Require approvals。"
publishDate: 2026-11-05T00:45:00+08:00
category: AI工具實戰
tags: [Claude Code, AI 工程實戰, 部署, GitHub]
readingTime: 4
draft: false
excerpt: "AI 在你電腦上 push，用的就是你的帳號，分支保護預設管不到管理員。勾三個選項，讓 main 只能走 PR、檢查過才合併，連你自己也不能繞過。"
problemTag: "AI 推上 main 就直接上線"
---
用 Claude Code、Codex 或 Cursor 寫程式，最煩的就是它改完順手 `git commit` 加 `git push`。終端機剛跑完，Vercel 正式部署通知就跳出來，還沒看它改了什麼，正式站已經更新了。

解法很簡單，直接把 `main` 鎖在 GitHub 遠端就好。沒鎖前，AI 一行指令就換掉正式站；鎖住後，它改完只能先開 PR，等你看完 Vercel 預覽再按合併。

## 口頭交代跟本地擋，為什麼還不夠穩

很多人一開始會在對話裡交代 AI 改完別 push，但口頭約定根本攔不住送出去的指令。只要 AI 判斷這輪任務結束了，照樣有可能直接推上遠端。

在 Claude Code 官方 repo 的 [issue #74844](https://github.com/anthropics/claude-code/issues/74844) 裡，就有人回報明明喊了 "stop everything"，改動還是直接被合進 `main`，連分支都被刪掉。

如果想先在本機擋一層，Claude Code 可以照 [Hooks 官方文件](https://code.claude.com/docs/en/hooks) 用 `PreToolUse` 攔 `git push`。但這只管得到 Claude Code，換用 Cursor 或 Codex 就失效了。

最硬、最不挑工具的防線，還是直接鎖在 GitHub 遠端。只要推同一個 repo，不管換哪套工具都會被擋下來。

## GitHub 兩條設定路：新版 Rulesets 跟舊版 Classic

GitHub 目前有兩條路可以鎖 `main`。新專案直接用新版 Rulesets 最省事；舊專案如果還在用 Classic 頁面，要小心它預設放行管理員的坑。

| 比較項目 | 新版 Rulesets（2026 主推） | 舊版 Classic |
| --- | --- | --- |
| 設定路徑 | `Settings → Rules → Rulesets` | `Settings → Branches` |
| 管理員權限 | 預設連管理員一起擋 | 預設放行管理員，漏勾等於白設 |
| 必開設定 | 切 `Active`、開 PR 與狀態檢查 | 一定要勾滿三格（含禁止繞過） |
| 暫時關掉 | 切 `Disabled` 就好，不用刪規則 | 舊介面較多專案沿用，但易踩坑 |

## 作法一：新版 Rulesets（最省事）

新開的專案直接走新版 Rulesets 最省事。打開 GitHub 專案頁面之後，照著下面這個順序點過去就行了：

1. 進到 `Settings → Rules → Rulesets → New branch ruleset`。
2. 把 `Enforcement status` 切到 `Active`（新建預設是 `Disabled`，沒切換就直接存檔會沒生效）。
3. 套用目標選 `Default branch`，一般就是 `main`。
4. 開啟 `Require a pull request before merging`，強制改動一律走 PR。
5. 開啟 `Require status checks to pass`，沒寫自動測試的話，選 Vercel 回報的部署狀態即可。

Rulesets 最大的好處，是預設連 repo 管理員都不能繞過，除非你自己把 admin 加進 Bypass list。想暫時關掉時直接切 `Disabled` 就好，不用整條刪掉。

## 作法二：舊版 Classic（避開管理員大坑）

如果舊專案還在用 Classic 頁面，路徑在 `Settings → Branches → Add classic branch protection rule`，分支名稱填 `main`。

舊版有個大坑，就是預設放行管理員。自己的 repo 你就是管理員，AI 在你電腦推的時候用的是你的帳號，只勾前兩格根本擋不住。走 Classic 下面這三格一定要勾滿：

1. `Require a pull request before merging`：擋掉直接推 `main`。
2. `Require status checks to pass before merging`：檢查或 Vercel 部署沒過就不能合。
3. `Do not allow bypassing the above settings`：少了這格，你跟 AI 照樣推得上去，前面等於白設。

## 一個人開發別勾 Require approvals

不管新版還是舊版，設定時都別勾 `Require approvals`（需要他人核准）。GitHub 規定 PR 作者不能核准自己的 PR，一個人開發勾了會把自己鎖在門外，連自己都按不了合併。

## 在 CLAUDE.md 順手補一句，少讓 AI 撞牆

GitHub 遠端鎖死後，AI 已經推不上去了。但為了省得它每次改完先撞牆報錯再重來，我會在 `CLAUDE.md` 或工具的規則檔（Cursor 放 `.cursor/rules`，Codex 放 `AGENTS.md`）補上這句：

```text
改完先開一條新分支推上去，用 gh pr create 開 PR，不要直接推 main。
```

如果電腦沒裝 `gh` CLI，把後半句改成「推上新分支後印出 GitHub 開 PR 網址讓我點」就好。遠端負責擋死，本地這句先跟 AI 講清楚規矩，它改完就會直接開新分支建 PR，跑起來順很多。

## 設完馬上測一次：看到 GH006 才算穩

規則存檔後別急著關掉網頁，直接叫 AI 試著推一次 `main`，親眼確認有跑到這三步才算真的鎖穩：

1. 直接推 `main` 時，終端機立刻跳 `GH006: Protected branch update failed` 退回。
2. 改成開新分支提 PR 後，Vercel 只建預覽網址，不會動到正式站。
3. 你自己看過預覽沒問題，再回 GitHub 按 Merge 上線。

## 走不走 PR，看你的專案階段

最後講一下我自己的立場。只要專案有正式環境與用戶，我一定鎖 PR，確保東西上線前自己有先看過 Vercel 預覽。

但如果你現在做的只是小實驗，覺得炸了當場修也沒差、想直接推求快，我也完全尊重。這只是開發習慣，沒有絕對對錯。

如果你之後不只想驗 Vercel 部署狀態，還打算把自動測試也接進狀態檢查，可以接著看〈[AI 幫你寫的測試全綠，為甚麼上線還是壞掉？](/articles/ai-tests-false-safety-six-phase-overhaul/)〉。
