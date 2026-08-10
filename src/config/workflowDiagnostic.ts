import { siteConfig, withCabAiAttribution } from './siteConfig';

export type DiagnosticLayerCode =
  | 'task_contract'
  | 'context_data'
  | 'tools_permissions'
  | 'memory_state'
  | 'acceptance_recovery';

export const diagnosticChoices = [
  { value: 'supported', label: '已有明確證據' },
  { value: 'uncertain', label: '不確定' },
  { value: 'missing', label: '尚未做到' },
] as const;

export const diagnosticLayers = [
  {
    code: 'task_contract',
    number: '01',
    title: '題目與完成條件',
    question: 'AI 知道現在要完成哪一個結果嗎？',
    check: '輸入、預期輸出、限制、停止條件與誰負責驗收，是否能用一句話說清楚。',
    symptom: '做了很多但方向不對、一直延伸、看起來完成卻不能交付。',
    correction: '把「幫我處理這件事」改成「使用＿＿輸入，產出＿＿格式；必須通過＿＿檢查；遇到＿＿就停止並回報」。',
    result: '先把輸入、輸出、限制、停止條件與驗收寫成能重複使用的方法。',
    cta: '把做對一次的方法整理成 Skill',
    destination: withCabAiAttribution(siteConfig.cabAi.agentSkillUrl, 'diagnostic_task_contract'),
    destinationCategory: 'agentskill',
  },
  {
    code: 'context_data',
    number: '02',
    title: 'Context 與資料',
    question: 'AI 此刻真的看得到正確資料嗎？',
    check: '列出這次實際讀到的檔案、對話、資料版本與優先順序，再和你以為它知道的內容比對。',
    symptom: '忘記前文、引用舊版本、不同文件互相衝突。',
    correction: '移除過期或無關內容，指定唯一版本與必要來源；不要只是一次塞入更多資料。',
    result: '先確認 AI 實際讀到哪些來源、版本與優先順序，再增加內容。',
    cta: '用工程手冊繼續排查',
    destination: withCabAiAttribution(siteConfig.cabAi.handbookUrl, 'diagnostic_context'),
    destinationCategory: 'handbook',
  },
  {
    code: 'tools_permissions',
    number: '03',
    title: '工具與權限',
    question: '它有完成任務需要的工具與權限嗎？',
    check: '需要讀取、寫入、搜尋、執行、部署或通知哪些系統？目前哪些真的可用？',
    symptom: '答案聽起來對，卻不能採取行動；做到一半才發現沒有權限。',
    correction: '把可用工具、禁止動作、需要人工批准的節點與失敗回報寫清楚。',
    result: '先列出必要工具、目前權限、人工批准點與失敗回報，不要讓流程做到一半才停。',
    cta: '用工程手冊繼續排查',
    destination: withCabAiAttribution(siteConfig.cabAi.handbookUrl, 'diagnostic_tools'),
    destinationCategory: 'handbook',
  },
  {
    code: 'memory_state',
    number: '04',
    title: 'Memory 與狀態',
    question: '上次做對的判斷與目前進度，有被正確留下嗎？',
    check: '哪些是長期原則、哪些是本次狀態、哪些已過期？下一次執行能否從正確位置繼續？',
    symptom: '每次都要重教、同一錯誤反覆發生、舊狀態干擾新任務。',
    correction: '只保存會重複使用的判斷、限制、例外與目前狀態；不要把所有對話都當永久記憶。',
    result: '先分開長期方法與本次進度，只留下下次真的要重用的判斷。',
    cta: '把做對一次的方法整理成 Skill',
    destination: withCabAiAttribution(siteConfig.cabAi.agentSkillUrl, 'diagnostic_memory'),
    destinationCategory: 'agentskill',
  },
  {
    code: 'acceptance_recovery',
    number: '05',
    title: '驗收與失敗恢復',
    question: '怎樣才算完成？錯了能從哪裡繼續？',
    check: '是否有可直接執行的測試、核對清單或人工確認？流程是否保存中間結果與錯誤位置？',
    symptom: 'AI 說完成就算完成；一步出錯全部重跑；沒人知道結果能不能用。',
    correction: '加入至少一個可觀察驗收，保存最後正確節點、第一個錯誤訊號與重新開始條件。',
    result: '先補一個可觀察驗收、最後正確節點與重新開始條件。',
    cta: '用工程手冊繼續排查',
    destination: withCabAiAttribution(siteConfig.cabAi.handbookUrl, 'diagnostic_recovery'),
    destinationCategory: 'handbook',
  },
] as const;

export type DiagnosticLayer = (typeof diagnosticLayers)[number];
