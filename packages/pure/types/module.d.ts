declare module 'virtual:config' {
  const Config: import('./user-config').UserConfig
  export default Config
}

declare module 'virtual:project-context' {
  const ProjectContext: {
    build: { format: string }
    legacyCollections: boolean
    root: unknown
    srcDir: unknown
    trailingSlash: 'always' | 'never' | 'ignore' | undefined
    i18n?: {
      defaultLocale?: string
      locales?: string[]
    }
  }
  export default ProjectContext
}
