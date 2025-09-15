export function formatDateYYYYMD(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  // Convert to JST (UTC+9) and then read UTC components
  const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  const y = jst.getUTCFullYear()
  const m = jst.getUTCMonth() + 1
  const day = jst.getUTCDate()
  return `${y}年${m}月${day}日`
}

export function isoDateJST(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  const y = jst.getUTCFullYear()
  const m = (jst.getUTCMonth() + 1).toString().padStart(2, '0')
  const day = jst.getUTCDate().toString().padStart(2, '0')
  return `${y}-${m}-${day}`
}
