export const PAGES = ['event', 'news', 'convention'] as const
export type Pages = (typeof PAGES)[number]
