import { siteConfig, withCabAiAttribution } from './siteConfig';

export type DiagnosticLayerCode =
  | 'task_contract'
  | 'context_data'
  | 'tools_permissions'
  | 'memory_state'
  | 'acceptance_recovery';

export const diagnosticChoices = [
  { value: 'supported', label: '有，我確定' },
  { value: 'uncertain', label: '不確定' },
  { value: 'missing', label: '沒有' },
] as const;

export const diagnosticLayers = [
  {
    code: 'task_contract',
    number: '01',
    title: '題目與完成條件',
    question: 'AI 知道這次要做出什麼嗎？',
    check: '給它什麼、要它交什麼、有什麼限制、什麼時候該停、誰來驗收，能不能一句話講完。',
    symptom: '做了一大堆但方向不對、越做越多、看起來做完了卻不能用。',
    correction: '把「幫我處理這件事」改成「用＿＿當輸入，產出＿＿格式；要通過＿＿檢查；遇到＿＿就停下來回報」。',
    result: '先把輸入、輸出、限制、什麼時候停、怎麼驗收寫下來，下次直接照用。',
    cta: '學怎麼把做對的方法寫成 Skill',
    destination: withCabAiAttribution(siteConfig.cabAi.agentSkillUrl, 'diagnostic_task_contract'),
    destinationCategory: 'agentskill',
  },
  {
    code: 'context_data',
    number: '02',
    title: 'Context 與資料',
    question: 'AI 這次真的看得到對的資料嗎？',
    check: '列出它這次實際讀到的檔案、對話和版本，跟你以為它知道的東西對一遍。',
    symptom: '忘記前面講過的、引用舊版本、幾份文件互相打架。',
    correction: '拿掉過期和無關的內容，指定唯一的版本和必要來源。一次塞更多資料通常更糟。',
    result: '先確認它實際讀到哪些資料、哪個版本，再決定要不要補。',
    cta: '翻 Claude Code 手冊繼續查',
    destination: withCabAiAttribution(siteConfig.cabAi.handbookUrl, 'diagnostic_context'),
    destinationCategory: 'handbook',
  },
  {
    code: 'tools_permissions',
    number: '03',
    title: '工具與權限',
    question: '它有做這件事需要的工具和權限嗎？',
    check: '要讀、要寫、要搜尋、要執行、要通知哪些系統？現在哪些真的能用？',
    symptom: '回答聽起來都對，就是沒辦法動手；做到一半才發現沒權限。',
    correction: '寫清楚它能用哪些工具、哪些事不准做、哪一步要你點頭、失敗時怎麼回報。',
    result: '先列出要用的工具、現有權限和要你點頭的地方，免得做到一半卡住。',
    cta: '翻 Claude Code 手冊繼續查',
    destination: withCabAiAttribution(siteConfig.cabAi.handbookUrl, 'diagnostic_tools'),
    destinationCategory: 'handbook',
  },
  {
    code: 'memory_state',
    number: '04',
    title: 'Memory 與狀態',
    question: '上次做對的地方和目前進度，有留下來嗎？',
    check: '哪些是一直適用的原則、哪些只是這次的進度、哪些已經過期？下次能不能從對的地方接著做？',
    symptom: '每次都要重教、同一個錯一直犯、舊的進度干擾新任務。',
    correction: '只留下次還會用到的判斷、限制、例外和目前進度。不是每段對話都要記住。',
    result: '先把長期做法和這次進度分開，只留下次真的會用到的。',
    cta: '學怎麼把做對的方法寫成 Skill',
    destination: withCabAiAttribution(siteConfig.cabAi.agentSkillUrl, 'diagnostic_memory'),
    destinationCategory: 'agentskill',
  },
  {
    code: 'acceptance_recovery',
    number: '05',
    title: '驗收與失敗恢復',
    question: '怎樣才算做完？出錯了能從哪裡接著做？',
    check: '有沒有能直接跑的測試、檢查清單或人工確認？流程有沒有存下中間結果和出錯的位置？',
    symptom: 'AI 說做完就算做完；一步出錯全部重來；沒人知道結果能不能用。',
    correction: '至少加一個看得到的檢查，並記下最後做對的那一步、第一個出錯的訊號、從哪裡重新開始。',
    result: '先補一個看得到的檢查，記下最後做對的那一步和從哪裡重來。',
    cta: '翻 Claude Code 手冊繼續查',
    destination: withCabAiAttribution(siteConfig.cabAi.handbookUrl, 'diagnostic_recovery'),
    destinationCategory: 'handbook',
  },
] as const;

export type DiagnosticLayer = (typeof diagnosticLayers)[number];
