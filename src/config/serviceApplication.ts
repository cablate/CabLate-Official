export const serviceApplicationVersion = 'service-application-v2';

export const serviceApplicationOptions = [
  {
    id: 'consulting',
    label: 'AI 專案卡關諮詢',
    shortLabel: '60 分鐘付費諮詢',
    summary: '手上已有具體問題，需要一起診斷、取捨並決定下一步。',
    situationLabel: '你現在最想解決哪件事？目前卡在哪裡？',
    situationHelp: '簡單交代情境和卡點即可，不需要先整理成完整企劃書。',
    focusQuestion: '這 60 分鐘，你最需要帶走什麼？',
    responseNote: '適合的話，我會回覆付款方式與可選時間；諮詢為 60 分鐘，費用 NT$5,000。',
    focusOptions: [
      { id: 'find_root_cause', label: '找出真正卡點', summary: '現在看到的是症狀，還不確定問題到底出在哪。' },
      { id: 'compare_options', label: '比較方向、做取捨', summary: '手上有幾種做法，需要判斷哪一條比較值得走。' },
      { id: 'set_next_step', label: '決定先做什麼', summary: '事情很多，希望排出優先順序和下一步。' },
      { id: 'review_current_plan', label: '檢查目前做法', summary: '已經有方案或原型，想確認問題與風險。' },
    ],
  },
  {
    id: 'coaching',
    label: 'AI 應用陪跑',
    shortLabel: '30 分鐘免費陪跑訪談',
    summary: '先聊你正在推進的事與反覆卡住的地方，確認五週陪跑是否適合。',
    situationLabel: '你現在最想把什麼做下去？做到哪裡開始卡住？',
    situationHelp: '工作、事業、產品或內容都可以，簡單說明目前做到哪裡。',
    focusQuestion: '下面哪一句最像你現在的狀況？',
    responseNote: '適合的話，我會回覆 30 分鐘訪談的可選時間。',
    applicationCopy: {
      heroLabel: '30 分鐘免費訪談',
      heroTitle: '先跟我說說，你現在最想把什麼做下去。',
      heroDescription: '把你正在做的事和目前卡住的地方告訴我，我會先看陪跑適不適合。',
      nextTitle: '送出後',
      nextFirstStep: '我會先看你寫的內容。',
      formLabel: '',
      formTitle: '先回答下面幾題。',
      formDescription: '其他資料可以之後再補。',
      submitLabel: '送出免費訪談申請',
      submitNote: '送出不會扣款或保留名額。這 30 分鐘只確認陪跑是否適合，不做完整診斷。',
    },
    focusOptions: [
      { id: 'unsure_where_to_start', label: '事情很多，最後沒有一個真的做下去', summary: '每個方向都想試，不知道現在該先做哪一個。' },
      { id: 'using_but_reworking', label: '已經在用 AI，卻還是一直重做', summary: '結果不穩，常常又換方法、換工具，或從頭來過。' },
      { id: 'prototype_stuck', label: '已經做了一版，卻不知道怎麼繼續', summary: '不確定該繼續修、縮小範圍，還是換方向。' },
      { id: 'unsure_if_ai_problem', label: '還不確定是不是 AI 的問題', summary: '我只知道事情做不下去，想先弄清楚問題出在哪裡。' },
    ],
  },
  {
    id: 'enterprise',
    label: '企業合作',
    shortLabel: '企業合作',
    summary: '從團隊現在的工作出發，再決定要做診斷、工作坊或小規模導入。',
    situationLabel: '團隊現在最想改善哪件事？目前遇到什麼阻力？',
    situationHelp: '先說明使用情境、參與對象和目前做法；不需要先決定課程或導入形式。',
    focusQuestion: '這次最想先談哪一類合作？',
    responseNote: '我會先確認需求與適配，再決定是否安排進一步會議。',
    focusOptions: [
      { id: 'team_diagnosis', label: '團隊使用診斷', summary: '先看目前怎麼使用 AI、問題在哪，再決定做法。' },
      { id: 'training_workshop', label: '內訓或工作坊', summary: '需要依真實工作情境設計培訓。' },
      { id: 'pilot_implementation', label: '小規模導入', summary: '想挑一個場景先做、驗證後再擴大。' },
      { id: 'not_sure_yet', label: '還不確定', summary: '先把問題和限制談清楚，再決定合作形式。' },
    ],
  },
  {
    id: 'partnerships',
    label: '講師與內容合作',
    shortLabel: '講師與內容',
    summary: '演講、工作坊、內容共創與產品合作邀約。',
    situationLabel: '這次想合作什麼？目前已有什麼想法或條件？',
    situationHelp: '簡單說明主題、對象、形式與已知條件即可。',
    focusQuestion: '這次合作比較接近哪一種？',
    responseNote: '我會先確認主題、形式與檔期，再回覆是否適合往下談。',
    focusOptions: [
      { id: 'speaking', label: '演講或分享', summary: '單次主題演講、論壇或公開活動。' },
      { id: 'workshop', label: '工作坊', summary: '需要參與者動手做、帶走具體成果。' },
      { id: 'content', label: '內容共創', summary: '文章、影音、專題或其他內容合作。' },
      { id: 'product', label: '產品或其他合作', summary: '工具、平台、課程或其他形式。' },
    ],
  },
] as const;

export type ServiceApplicationId = typeof serviceApplicationOptions[number]['id'];

export function getServiceApplicationHref(service: ServiceApplicationId, source: string) {
  const params = new URLSearchParams({ service, source });
  return `/services/apply/?${params.toString()}`;
}
