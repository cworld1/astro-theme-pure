export function showToast(detail: { message: string }) {
  document.dispatchEvent(new CustomEvent('toast', { detail }))
}
