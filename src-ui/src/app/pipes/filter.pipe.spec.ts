import { MatchingModel } from '../data/matching-model'
import { FilterPipe } from './filter.pipe'

describe('FilterPipe', () => {
  it('should filter matchingmodel items', () => {
    const pipe = new FilterPipe()
    const items: MatchingModel[] = [
      {
        id: 1,
        name: 'Hello World',
        slug: 'slug-1',
      },
      {
        id: 2,
        name: 'Hello',
        slug: 'slug-2',
      },
    ]
    let itemsReturned = pipe.transform(items, 'world')
    expect(itemsReturned).toEqual([items[0]])

    itemsReturned = pipe.transform(null, 'world')
    expect(itemsReturned).toEqual([])

    itemsReturned = pipe.transform(items, null)
    expect(itemsReturned).toEqual(items)
  })

  it('should filter matchingmodel items by key', () => {
    const pipe = new FilterPipe()
    const items: MatchingModel[] = [
      {
        id: 1,
        name: 'Hello World',
        slug: 'slug-1',
      },
      {
        id: 2,
        name: 'Hello with slug',
        slug: 'not this',
      },
    ]
    let itemsReturned = pipe.transform(items, 'slug')
    expect(itemsReturned).toEqual(items)

    itemsReturned = pipe.transform(items, 'slug', 'slug')
    expect(itemsReturned).toEqual([items[0]])
  })

  it('should filter matchingmodel items by normalized independent terms', () => {
    const pipe = new FilterPipe()
    const items: MatchingModel[] = [
      {
        id: 1,
        name: 'Financ\u00e9 Taxes 2026',
        slug: 'finance-taxes',
      },
      {
        id: 2,
        name: 'Receipt Archive 2026',
        slug: 'receipt-archive',
      },
    ]

    expect(pipe.transform(items, 'finance 26')).toEqual([items[0]])
    expect(pipe.transform(items, 'finance receipt')).toEqual([])
  })
})
