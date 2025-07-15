/**
 * 安全地获取 ISO 字符串，处理可能不是 Date 对象的情况
 */
export function getISOString(date: Date | string | number | undefined): string | undefined {
    if (!date) return undefined

    const dateObj = date instanceof Date ? date : new Date(date)
    return dateObj.toISOString()
}
