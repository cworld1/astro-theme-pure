/**
 * 解码URL中的编码字符（如中文）
 * @param url - 需要解码的URL字符串
 * @returns 解码后的URL字符串
 */
export function decodeUrl(url: string): string {
  try {
    return decodeURIComponent(url)
  } catch {
    // 如果解码失败，返回原始URL
    return url
  }
}

/**
 * 格式化URL显示，只解码不限制行数
 * @param url - 需要格式化的URL字符串
 * @returns 解码后的URL字符串
 */
export function formatUrlForDisplay(url: string): string {
  // 只解码URL，不限制行数
  return decodeUrl(url)
}

/**
 * 获取适合HTML显示的URL（只处理编码）
 * @param url - 原始URL（可以是字符串或URL对象）
 * @returns 解码后的URL字符串
 */
export function getDisplayUrl(url: string | URL): string {
  // 处理URL对象
  const urlString = typeof url === 'string' ? url : url.href
  // 只解码URL，不添加换行
  return formatUrlForDisplay(urlString)
}