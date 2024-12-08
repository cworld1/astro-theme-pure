declare module 'virtual:types' {
  export interface SiteMeta {
    title: string
    description?: string
    ogImage?: string | undefined
    articleDate?: string | undefined
  }

  // export interface SocialLink {
  //   name:
  //     | 'coolapk'
  //     | 'telegram'
  //     | 'github'
  //     | 'bilibili'
  //     | 'twitter'
  //     | 'zhihu'
  //     | 'steam'
  //     | 'netease_music'
  //     | 'mail'
  //   url: string
  // }

  export type CardListData = {
    title: string
    list: CardList
  }

  export type CardList = {
    title: string
    link?: string
    children?: CardList
  }[]

  export type TimelineEvent = {
    date: string
    content: string
  }
}
