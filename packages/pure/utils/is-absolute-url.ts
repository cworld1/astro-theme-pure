// https://github.com/sindresorhus/is-absolute-url

// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/

// Windows paths like `c:\`
const WINDOWS_PATH_REGEX = /^[a-zA-Z]:\\/

/**
 * Check if a URL is absolute.
 * @param url - The URL to check.
 * @example
 * ```
 * import isAbsoluteUrl from 'is-absolute-url';
 *
 * isAbsoluteUrl('http://sindresorhus.com/foo/bar');
 * //=> true
 *
 * isAbsoluteUrl('//sindresorhus.com');
 * //=> false
 *
 * isAbsoluteUrl('foo/bar');
 * //=> false
 * ```
 */
export default function isAbsoluteUrl(url: string): boolean {
  if (typeof url !== 'string') {
    throw new TypeError(`Expected a \`string\`, got \`${typeof url}\``)
  }
  if (WINDOWS_PATH_REGEX.test(url)) {
    return false
  }
  return ABSOLUTE_URL_REGEX.test(url)
}
