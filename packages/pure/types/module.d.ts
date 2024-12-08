/// <reference path="./common.d.ts" />

declare module 'virtual:config' {
  const Config: import('./user-config').UserConfig
  export default Config
}
