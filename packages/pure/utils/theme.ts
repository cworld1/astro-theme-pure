export function getTheme() {
  return localStorage.getItem('theme')
}

export function listenThemeChange(theme?: string) {
  if (!theme || theme === 'system') return // if theme is specified, no need to listen window theme change
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    setTheme(e.matches ? 'dark' : 'light')
  })
}

export function setTheme(theme?: string, save = false) {
  const themes = ['system', 'dark', 'light']
  if (theme) {
    if (!themes.includes(theme)) return
    if (save) localStorage.setItem('theme', theme)
  } else {
    theme = getTheme() ?? undefined
    if (save) {
      // Set theme equals undefined, switch cycle in ['system', 'dark', 'light']
      const currentIndex = themes.indexOf(theme ?? 'system')
      theme = themes[(currentIndex + 1) % themes.length]
      localStorage.setItem('theme', theme) // save theme
    }
  }
  let targetTheme = theme
  if (theme === 'system') {
    targetTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    // Listen theme change
    listenThemeChange(theme)
  }

  // Set theme
  document.documentElement.classList.toggle('dark', targetTheme === 'dark')
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', targetTheme === 'dark' ? '#0B0B10' : '#FCFCFD')

  return theme
}
