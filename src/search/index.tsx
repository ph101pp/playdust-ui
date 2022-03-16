import styled from '@emotion/styled'
import { CircularProgress } from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import CollectionResults from './components/CollectionResults'
import SearchResults from './components/SearchResults'
import SearchSideBar from './components/SearchSideBar'
import * as store from './store'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const TokenContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: auto;
`

const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
`

const ResultsContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  border: soild 1px green;
`

const Search: NextPage = () => {
  const { initialized } = useRecoilValue(store.searchResults)

  return (
    <>
      {!initialized && (
        <SpinnerContainer>
          <CircularProgress />
        </SpinnerContainer>
      )}
      <RootContainer>
        <CollectionResults />
        <ResultsContainer>
          <SearchSideBar />
          <TokenContainer>
            <SearchResults />
          </TokenContainer>
        </ResultsContainer>
      </RootContainer>
    </>
  )
}

const Page = () => {
  const { isReady } = useRouter()

  if (!isReady) {
    return <div />
  }

  return <Search />
}

export default Page
