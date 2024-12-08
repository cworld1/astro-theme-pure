export type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined
export type ClassDictionary = Record<string, unknown>
export type ClassArray = ClassValue[]

export function clsx(...inputs: ClassValue[]): string {
  let str = ''
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]
    if (typeof input === 'string' || typeof input === 'number') {
      str += (str && ' ') + input
    } else if (Array.isArray(input)) {
      str += (str && ' ') + clsx(...input)
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) {
          str += (str && ' ') + key
        }
      }
    }
  }
  return str
}

export default clsx
