import config from 'virtual:config'

const dateFormat = new Intl.DateTimeFormat(config.locale.dateLocale, config.locale.dateOptions)

export function getFormattedDate(
  date: string | number | Date,
  options?: Intl.DateTimeFormatOptions
) {
  if (typeof options !== 'undefined') {
    return new Date(date).toLocaleDateString(config.locale.dateLocale, {
      ...(config.locale.dateOptions as Intl.DateTimeFormatOptions),
      ...options
    })
  }

  return dateFormat.format(new Date(date))
}
