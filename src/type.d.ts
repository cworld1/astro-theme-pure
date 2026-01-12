declare module 'virtual:config' {
  const Config: import('astro-pure/types').ConfigOutput
  export default Config
}

declare module '*.astro' {
  const Component: any
  export default Component
}
