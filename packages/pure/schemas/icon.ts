import { z } from 'astro/zod'

import { Icons, type IconsType } from '../libs/icons'

const icons = Object.keys(Icons) as [IconsType, ...IconsType[]]

/** String that matches the name of one of Starlight’s built-in icons. */
export const IconSchema = () => z.enum(icons)
