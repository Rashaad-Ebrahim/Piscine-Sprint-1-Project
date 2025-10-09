export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(); // Format according to user's local time
}
