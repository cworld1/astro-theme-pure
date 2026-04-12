import { z } from 'astro/zod'

import { Icons, type IconName } from '../libs'

const iconNames = Object.keys(Icons) as [IconName, ...IconName[]]

/** String that matches the name of one of Starlight’s built-in icons. */
export const IconSchema = () => z.enum(iconNames)
