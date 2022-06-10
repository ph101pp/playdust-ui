import styled from '@emotion/styled';
import { HomeSharp } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import useGoHome from '../../../../_hooks/useGoHome';
import setWindowImagesAtom from '../../../_atoms/setWindowImagesAtom';
import TokenGrid from '../../_sharedComponents/TokenGrid/TokenGrid';
import isSearchQueryValidAtom from './_atoms/isSearchQueryValidAtom';
import searchResultsAtom from './_atoms/searchResultsAtom';
import useFetchMoreSearchResults from './_hooks/useFetchMoreSearchResults';

const NoResultsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 64px;
`;

function SearchResults() {
  const searchResults = useRecoilValueLoadable(searchResultsAtom);
  const fetchMoreSearchResults = useFetchMoreSearchResults();
  const hasValue = searchResults.state === 'hasValue';
  const goHome = useGoHome();
  const isSearchQueryValid = useRecoilValue(isSearchQueryValidAtom);
  const setWindowImages = useRecoilValue(setWindowImagesAtom);

  useEffect(() => {
    if (setWindowImages && searchResults.state === 'hasValue') {
      const filtered = searchResults.contents.nfts
        .filter((nft) => nft?.image)
        .slice(0, 4)
        .map((nft) => nft?.image);

      setWindowImages(filtered);
    }
  }, [searchResults, setWindowImages]);

  if (hasValue && (searchResults.contents.total === 0 || !isSearchQueryValid)) {
    return (
      <NoResultsContainer>
        <Stack sx={{ gap: 2 }}>
          <i>no results found...</i>
          <Button
            onClick={() => goHome()}
            startIcon={<HomeSharp />}
            variant="contained"
            size="large"
          >
            Go Home
          </Button>
        </Stack>
      </NoResultsContainer>
    );
  }

  return (
    <TokenGrid
      initialized={hasValue}
      imageSize={225}
      contentHeight={70}
      cardGap={16}
      rowGap={16}
      tokens={hasValue ? searchResults.contents.nfts : []}
      total={hasValue ? searchResults.contents.total : 0}
      next={fetchMoreSearchResults}
    />
  );
}

export default SearchResults;
