import { selector } from 'recoil'
import { searchQueryValid } from '.'

export const isCollectionQuery = selector<boolean>({
  key: 'isCollectionQuery',
  get: ({ get }) => {
    const queryValid = get(searchQueryValid)
    const firstParent = queryValid.find((entry) => entry[0].field !== 'range')

    return firstParent?.length === 1 && firstParent[0].field === 'collection'
  },
})
