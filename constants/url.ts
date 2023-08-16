import { getRangeDateForFilter } from './date'
import { views } from './table'

const isProduction = process.env.NODE_ENV === 'production'

const domain = 'dsapnationalconvention.org'
const local = 'localhost:5000'
const home = isProduction ? domain : local

export const url = {
  // homeWithoutApp: home,
  // home: `//${home}`,
  // api: `${isProduction ? 'https://' : 'http://'}${home}`,
  // serverApi: `${isProduction ? 'https://' : 'http://'}${home}`,
  // app: {
  //   signin: `//${home}/sign-in`,
  //   signup: `//${home}/sign-up`,
  //   overview: `//${home}`
  // },
  homeWithoutApp: home,
  home: `//${home}`,
  api: `${isProduction ? 'https://app.' : 'http://app.'}${home}`,
  serverApi: `${isProduction ? 'https://' : 'http://'}${home}`,
  app: {
    signin: `//app.${home}/sign-in`,
    signup: `//app.${home}/sign-up`,
    overview: `//app.${home}`
  },
  developer: 'http://www.boredguyscorp.com/',
  twitter: 'https://twitter.com/theboredguyscorp',
  github: 'https://github.com/theboredguyscorp/'
}

export const getApiUrl = (filterKey: string, apiPath: string, categories: string[] = []) => {
  if (filterKey === views.all.key) {
    return `/api/${apiPath}?categories=${categories?.join(',')}`
  }
  const [start, end] = getRangeDateForFilter(filterKey)
  return `/api/${apiPath}?from=${start}&to=${end}&categories=${categories?.join(',')}`
}

export default url
