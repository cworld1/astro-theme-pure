import { type ClassValue, clsx } from './clsx'

export function simpleMerge(...classes: string[]): string {
  const uniqueClasses = new Set<string>()

  classes.forEach((cls) => {
    if (cls) {
      cls.split(' ').forEach((c) => {
        uniqueClasses.add(c)
      })
    }
  })

  return Array.from(uniqueClasses).join(' ')
}

export function cn(...inputs: ClassValue[]) {
  return simpleMerge(clsx(inputs))
}
