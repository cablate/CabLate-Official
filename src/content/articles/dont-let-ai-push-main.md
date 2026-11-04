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
讓 Claude Code、Codex 或 Cursor 幫忙 commit、push 時，如果專案接了 Vercel，預設往 `main` 一推就會直接建立正式部署；`main` 沒有嚴格測試與把關，可能把 AI 剛寫出來、還沒完整確認過的東西直接推上去，正式站就跟著出問題。

常見的做法是在 GitHub 設定 `main` 不允許直接 push（`direct push`），規定必須開 PR（`Pull Request`）來更新 `main`：之後讓 AI 推到新分支、開 PR，Vercel 對 `main` 的 PR 只建預覽部署，你看過預覽或等檢查通過後按合併，才會建正式部署。

## 為甚麼要在 GitHub 設規則，而不是只叮嚀 AI 不要推？

因為 AI 在你的終端機執行 git，靠對話叮嚀或當場喊停不一定攔得住；設在 GitHub 的分支保護規則，會在推送時直接退回。

在 Claude Code 的公開 issue #74844 裡，使用者自述他說了「stop everything」，結果同時在背景跑的兩個任務（背景代理）只停了一個；另一個把自己的功能分支合併進共用的 `main`、推上 `origin`，還刪了那條分支。

直接 push 到受保護的 `main` 被 GitHub 擋下時，終端機會出現 `GH006: Protected branch update failed`，後面常接 `Changes must be made through a pull request`。

## 在 GitHub 勾三個選項，讓 main 只能走 PR

到 repo 的「Settings」→ 側欄「Branches」→「Add classic branch protection rule」，在分支名稱欄位（`Branch name pattern`）填 `main`，接著勾這三格：

1. **合併前必須先開 PR（`Require a pull request before merging`）**：擋掉直接往 `main` 的 push。
2. **合併前必須通過狀態檢查（`Require status checks to pass before merging`）**：若只接了 Vercel、沒寫過 CI，這格可先選 Vercel 在每個 commit 回報的部署狀態（GitHub Commit Status）當檢查條件；檢查結果是成功、略過或中性時才允許合併。
3. **禁止繞過上述設定（`Do not allow bypassing the above settings`）**：要求所有人照上面的規則走。

## 預設不管管理員，而且一個人開發別勾 Require approvals

分支保護規則預設不適用於對 repo 有管理員權限的人。你在自己的 repo 是管理員，AI push 用的就是你的帳號；沒勾「禁止繞過上述設定（`Do not allow bypassing the above settings`）」，管理員還是能直接推 `main`，前面勾的規則就擋不住 AI，勾了管理員才要照規則走。

另外，設定頁還有個要求核准的選項（`Require approvals`），一個人開發不要勾。GitHub 規定 PR 的作者不能核准自己的 PR；同時勾了禁止繞過與要求核准，你或 AI 用你的帳號開的 PR，自己不能核准、也沒別人能審，合併就會卡住。

若是私人 repo，GitHub 方案頁只把「Protected branches」列在 Pro、Team 的「私人 repo 進階工具」底下（免費方案那段未列），需不需要 Pro 以上方案以設定頁提示為準。

下次讓 AI 改一個推上 `main` 就會上線的專案，先把 `main` 設成只能走 PR、連你自己也不能繞過；PR 靠狀態檢查把關才合併，若測試也是 AI 寫的，可看[〈AI 幫你寫的測試全綠，為甚麼上線還是壞掉？〉](/articles/ai-tests-false-safety-six-phase-overhaul/)。
