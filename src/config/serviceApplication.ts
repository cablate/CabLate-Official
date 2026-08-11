export const serviceApplicationVersion = 'service-application-v1';

export const serviceApplicationOptions = [
  {
    id: 'consulting',
    label: 'AI 專案卡關諮詢',
    shortLabel: '專案諮詢',
    summary: '60 分鐘先把問題和下一步看清楚。',
  },
  {
    id: 'coaching',
    label: 'AI 應用陪跑',
    shortLabel: 'AI 應用陪跑',
    summary: '五週一對一。帶著你手上的工作、產品、內容或專案來，一起拆問題、實作和調整。',
  },
  {
    id: 'enterprise',
    label: '企業合作',
    shortLabel: '企業合作',
    summary: '從團隊現在的工作出發，再決定要做診斷、工作坊或小規模導入。',
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
