import { normalizeSync } from 'normalize-diacritics'

export type SearchTextValue =
  | string
  | number
  | boolean
  | bigint
  | null
  | undefined

const normalizedStringCache = new Map<string, string>()
const searchTermsCache = new Map<string, string[]>()

function normalizeString(value: string): string {
  const cachedValue = normalizedStringCache.get(value)
  if (cachedValue !== undefined) {
    return cachedValue
  }

  const normalizedValue = normalizeSync(value).toLocaleLowerCase()
  normalizedStringCache.set(value, normalizedValue)
  return normalizedValue
}

export function normalizeSearchText(value: SearchTextValue): string {
  return normalizeString(String(value ?? ''))
}

function getSearchTerms(searchText: SearchTextValue): string[] {
  const normalizedSearchText = normalizeSearchText(searchText).trim()

  if (!normalizedSearchText) {
    return []
  }

  const cachedTerms = searchTermsCache.get(normalizedSearchText)
  if (cachedTerms !== undefined) {
    return cachedTerms
  }

  const searchTerms = normalizedSearchText.split(/\s+/)
  searchTermsCache.set(normalizedSearchText, searchTerms)
  return searchTerms
}

export function matchesSearchText(
  value: SearchTextValue,
  searchText: SearchTextValue
): boolean {
  const normalizedValue = normalizeSearchText(value)
  const searchTerms = getSearchTerms(searchText)

  return searchTerms.every((term) => normalizedValue.includes(term))
}
