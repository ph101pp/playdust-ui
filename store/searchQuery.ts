import { nanoid } from 'nanoid'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export type FieldType = 'collection' | 'attribute'
export type SearchType = 'exact' | 'relevance'

export interface QueryId {
  id: string
  locked?: boolean
}

interface ExactCollectionContent {
  field: 'collection'
  searchType: 'exact'
  value: string
}
interface ExactCollectionQuery extends ExactCollectionContent, QueryId {}

interface ExactAttributeContent {
  field: 'attribute'
  searchType: 'exact'
  value: string[]
  trait: string
}
export interface ExactAttributeQuery extends ExactAttributeContent, QueryId {}

interface RelevanceContent {
  field: string
  searchType: 'relevance'
  value: string
  relevance: number
}
interface RelevanceQuery extends RelevanceContent, QueryId {}

export type OperationType = 'and' | 'or'
type QueryContent =
  | ExactCollectionContent
  | ExactAttributeContent
  | RelevanceContent
export type QueryType =
  | ExactCollectionQuery
  | ExactAttributeQuery
  | RelevanceQuery

export type ComposedQueryType = QueryType[][]

const searchQuery = atom<ComposedQueryType>({
  key: 'searchQuery',
  default: [],
  effects: [persistAtom],
})

export const useInitializeCollectionQuery = () => {
  const setter = useSetRecoilState(searchQuery)

  return (value: string) => {
    setter([
      [
        {
          id: nanoid(),
          field: 'collection',
          searchType: 'exact',
          value,
          locked: true,
        },
      ],
    ])
  }
}

const useAddChild = () => {
  const [state, setter] = useRecoilState(searchQuery)

  return (content: QueryContent, operation: OperationType, at?: number) => {
    const currX = at === undefined ? state.length : at

    const newNode: QueryType = {
      id: nanoid(),
      ...content,
    }

    if (operation === 'or') {
      const nextState: ComposedQueryType = state.map((entry, idx) => {
        if (idx === currX) {
          return [...entry, newNode]
        }

        return entry
      })

      return setter(nextState)
    }

    const nextState = [
      ...state.slice(0, currX + 1),
      [newNode],
      ...state.slice(currX + 1),
    ]

    setter(nextState)
  }
}

export const useAddExactCollection = () => {
  const addChild = useAddChild()

  return (value: string, operation: OperationType, at?: number) => {
    addChild(
      {
        field: 'collection',
        searchType: 'exact',
        value,
      },
      operation,
      at
    )
  }
}

export const useAddExactAttribute = () => {
  const addChild = useAddChild()

  return (
    value: string[],
    trait: string,
    operation: OperationType,
    at?: number
  ) => {
    addChild(
      {
        field: 'attribute',
        searchType: 'exact',
        value,
        trait,
      },
      operation,
      at
    )
  }
}

export const useAddRelevance = () => {
  const addChild = useAddChild()

  return (
    field: FieldType,
    value: string,
    operation: OperationType,
    relevance?: number,
    at?: number
  ) => {
    addChild(
      {
        field,
        searchType: 'relevance',
        relevance: relevance || 50,
        value,
      },
      operation,
      at
    )
  }
}

export const useUpdateExactAttribute = () => {
  const updateChild = useUpdateChild()
  const removeChild = useRemoveChild()

  return (
    id: string,
    update: Partial<ExactAttributeContent>,
    clearOnEmpty = false
  ) => {
    if (
      clearOnEmpty &&
      update.value !== undefined &&
      update.value.length === 0
    ) {
      return removeChild(id)
    }

    updateChild(id, update)
  }
}

export const useRemoveChild = () => {
  const [state, setter] = useRecoilState(searchQuery)

  return (id: string) => {
    const nextState = state
      .map((parent) => parent.filter((child) => child.id !== id))
      .filter((parent) => parent.length > 0)

    setter(nextState)
  }
}

export const useUpdateChild = () => {
  const [state, setter] = useRecoilState(searchQuery)

  return (id: string, update: Partial<QueryType>) => {
    const nextState = state.map((parent) =>
      parent.map((child) => {
        if (child.id === id) {
          return {
            ...child,
            ...update,
          }
        }

        return child
      })
    )

    setter(nextState as ComposedQueryType)
  }
}

export const useClearSearchQuery = () => {
  const setter = useSetRecoilState(searchQuery)

  return () => {
    setter((state) =>
      state
        .map((parent) => parent.filter((child) => child.locked))
        .filter((parent) => parent.length > 0)
    )
  }
}

export default searchQuery