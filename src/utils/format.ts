/**
 * 格式化日期為繁體中文顯示格式
 * @example formatDate(new Date('2026-03-10')) → '2026年3月10日'
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
