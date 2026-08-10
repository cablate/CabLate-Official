export const serviceApplicationVersion = 'service-application-v1';

export const serviceApplicationOptions = [
  {
    id: 'consulting',
    label: 'AI 專案卡關諮詢',
    shortLabel: '專案諮詢',
    summary: '90 分鐘找出真正卡點、該做與先不做的事。',
  },
  {
    id: 'coaching',
    label: 'AI 應用陪跑',
    shortLabel: 'AI 陪跑',
    summary: '五週一對一客製合作，先理解問題，再判斷 AI 該介入哪裡並動手實作。',
  },
  {
    id: 'enterprise',
    label: '企業合作',
    shortLabel: '企業合作',
    summary: '針對團隊真實工作，討論現況診斷、工作坊或小規模導入。',
  },
  {
    id: 'partnerships',
    label: '講師與內容合作',
    shortLabel: '講師與內容',
    summary: '演講、工作坊、內容共創與產品合作邀約。',
  },
] as const;

export type ServiceApplicationId = typeof serviceApplicationOptions[number]['id'];

export function getServiceApplicationHref(service: ServiceApplicationId, source: string) {
  const params = new URLSearchParams({ service, source });
  return `/services/apply/?${params.toString()}`;
}
