const pad = (n: number) => String(n).padStart(2, '0');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const naira = (amount: number, digits = 2) => `₦${amount.toFixed(digits)}`;

/** "MMM dd, yyyy" */
export const formatDate = (d: Date) => `${MONTHS[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()}`;

/** "MMM dd, yyyy - hh:mm a" */
export function formatDateTime(d: Date) {
  const h = d.getHours();
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${formatDate(d)} - ${pad(h12)}:${pad(d.getMinutes())} ${h < 12 ? 'AM' : 'PM'}`;
}

/** "yyyy-MM-dd HH:mm:ss" in local time (home screen recent list). */
export const formatSql = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

/** "dd/MM/yyyy" */
export const formatDmy = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

/** "yyyy-MM-dd" for API payloads. */
export const formatIsoDate = (d: Date) => `${String(d.getFullYear()).padStart(4, '0')}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (days === 0) return hours === 0 ? `${minutes} minutes ago` : `${hours} hours ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return formatDate(date);
}
