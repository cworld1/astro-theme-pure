'use strict'

// Tks for issue https://github.com/cworld1/astro-theme-pure/issues/36
// CJK character ranges
const CJK_RANGES = [
  [0x4e00, 0x9fff], // CJK Unified Ideographs
  [0x3400, 0x4dbf], // CJK Extension A
  [0x20000, 0x2a6df], // CJK Extension B
  [0x2a700, 0x2b73f], // CJK Extension C
  [0x2b740, 0x2b81f], // CJK Extension D
  [0x2b820, 0x2ceaf], // CJK Extension E
  [0xf900, 0xfaff], // CJK Compatibility Ideographs
  [0x2f800, 0x2fa1f] // CJK Compatibility Ideographs Supplement
]
// CJK punctuation ranges
const CJK_PUNCTUATION = /[\u3000-\u303F\uff00-\uffef]/

interface ReadingTimeResult {
  text: string
  minutes: number
  time: number
  words: number
}

/**
 * Checks if a character is a CJK character
 * @param {string} char - The character to check
 * @returns {boolean} - Returns true if the character is CJK, otherwise false
 */
function isCJK(char: string): boolean {
  const code = char.charCodeAt(0)
  return CJK_RANGES.some(([start, end]) => code >= start && code <= end)
}

/**
 * Calculates the reading time of a text
 * @param {string} text - The text to calculate
 * @param {number} wordsPerMinute - The number of words read per minute, default is 200
 * @returns {ReadingTimeResult} - An object containing the reading time
 */
export function getReadingTime(text: string, wordsPerMinute: number = 200): ReadingTimeResult {
  let words = 0
  let inWord = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (isCJK(char)) {
      words++
      // Skip following CJK punctuation
      while (i + 1 < text.length && CJK_PUNCTUATION.test(text[i + 1])) {
        i++
      }
      inWord = false // reset inWord after counting a CJK character
    } else if (/\S/.test(char)) {
      if (!inWord) {
        words++
        inWord = true // mark that we are inside a word
      }
    } else {
      inWord = false // reset inWord on whitespace
    }
  }

  // Calculate reading time
  const minutes = words / wordsPerMinute
  const time = Math.round(minutes * 60 * 1000) // Convert to milliseconds
  const displayed = Math.ceil(minutes)

  return {
    text: displayed + ' min',
    minutes,
    time,
    words
  }
}

// Export module
export default getReadingTime
