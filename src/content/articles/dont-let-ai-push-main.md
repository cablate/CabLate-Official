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
你讓 Claude Code 或 Cursor 改完程式，順手請它 `git commit`、`git push`。<br><br>如果有部署上 Vercel 把 main 當正式環境分支，終端機一跑完，Vercel 部署成功的通知就來了，因為只要推上 `main` 就會直接部署，你還沒看過的程式馬上換上正式站。<br><br>而這其中就有一些風險存在，你可能還沒確認好，服務就更新了。<br>只要有用戶就要對用戶負責，影響實際用戶就是破壞體驗與信任。<br><br>靠 AI 寫程式的 Vibe Coder 很多可能沒經歷過正式開發流程，而我們正式開發時，有幾道流程有助於填補高速開發到上線的落差。<br><br>做法其實很簡單：去 GitHub 把 `main` 設好三個勾，讓 AI 不能直接推、只能先開 PR，等你看過預覽網址確認沒問題再合併上線。

## 為甚麼防線要設在 GitHub，不是叮嚀 AI 別推？

因為 Claude Code 直接在你的終端機操作 git，口頭叮嚀是攔不住已送出的推送指令的，除非你有運用 [Hook](https://code.claude.com/docs/en/hooks)。<br><br>Claude Code 官方 repo [issue #74844](https://github.com/anthropics/claude-code/issues/74844) 就有使用者自述喊了「stop everything」，但完全沒用，AI 照樣未經他審核就把分支合進 `main` 推上去並刪了原分支。<br><br>因此設好 GitHub 分支保護規則才是正解，直接推 `main` 就會當場跳錯誤，AI 會收到類似 `GH006: Protected branch update failed`。

## 在 GitHub 勾三個選項，讓 main 只能走 PR

如果想要有這樣的效果，最簡單也最常見做法是在 GitHub 設 `main` 不准直接推，更新一律開 PR（合併請求）並跑自動檢查把關。<br><br>靠 PR 檢查能養成監控與保護的習慣；不檢查就直接把分支合進 `main` 等於少一層緩衝，所以只要有正式環境，我都不會這樣做。<br><br>至於有信心或是覺得炸了再修沒差的人，那我也尊重，這就是一種開發習慣而已，沒有絕對的對錯。

| | AI 直接推 main | AI 推新分支、開 PR |
|---|---|---|
| Vercel 做甚麼 | 建正式部署，正式站馬上換 | 只建預覽部署 |
| 誰決定上線 | 沒有人，推上去就上線 | 你看過預覽、檢查通過後按合併 |

你需要親自到 GitHub repo 勾這三格 (或者讓 AI 幫你操作也可以)：

路徑：Settings → Branches → Add classic branch protection rule，Branch name pattern 填 `main`。

1. Require a pull request before merging
2. Require status checks to pass before merging
3. Do not allow bypassing the above settings

第一個，擋直接推 `main`。<br>第二個擋檢查沒過的 PR；只接 Vercel 的專案，選 Vercel 每個 commit 回報的部署狀態，只要預覽部署失敗就合不進去。<br>第三個用來擋管理員：規則預設是不理管理員的，但自己的 repo 你就是管理員，AI 在你電腦操作 git 也是用你的帳號，所以這條不勾選的話一切都形同虛設。

用 Claude Code 的人調整 `CLAUDE.md` 或是設定 Hook 讓它改走 PR：

```text
改完先開一條新分支推上去，用 gh pr create 開 PR，不要直接推 main。
```

下次讓 AI 改一個推上 `main` 就會上線的專案，先把 `main` 設成只能走 PR、檢查過才合併，連你自己也不能繞過。要讓 AI 寫測試放進第二格當檢查，先看〈[AI 幫你寫的測試全綠，為甚麼上線還是壞掉？](/articles/ai-tests-false-safety-six-phase-overhaul/)〉。
