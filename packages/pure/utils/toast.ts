export function showToast(detail: {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  icon?: string
  time?: number
}) {
  document.dispatchEvent(new CustomEvent('toast', { detail }))
}
