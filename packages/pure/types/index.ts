export type { IntegrationUserConfig } from './integrations-config'
export type { ThemeUserConfig } from './theme-config'
export type { UserConfig as ConfigOutput, UserInputConfig as Config } from './user-config'

export type { IconsType } from '../libs/icons'

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
