import type { Icons } from '../libs/icons'

export type { IntegrationUserConfig } from './integrations-config'
export type { ThemeUserConfig } from './theme-config'
export type { UserConfig as ConfigOutput, UserInputConfig as Config } from './user-config'

export interface SiteMeta {
  title: string
  description?: string
  ogImage?: string | undefined
  articleDate?: string | undefined
}

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

export type iconsType = keyof typeof Icons

export { socialLinks } from './constants'
