import { Box, Card, Grid, styled, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import ImageButton from '../../../../_sharedComponents/ImageButton';
import humanizeCollection from '../../../_helpers/humanizeCollection';
import OpenSearchCollectionSourceType from '../../../_types/OpenSearchCollectionSourceType';
import searchResultsAtom from '../../_atoms/searchResultsAtom';
import humanizeSolana from '../../_helpers/humanizeSolana';
import SimilarCollections from './SimilarCollections';
import collectionOverviewAtom from './_atoms/collectionOverviewAtom';

const border = '1px solid #EEEEEE';

type Item = {
  label: string;
  getValue: (data: OpenSearchCollectionSourceType) => ReactNode;
};

const items: Item[] = [
  {
    label: 'Total Volume',
    getValue: ({ volume }) => humanizeSolana(volume.global.total),
  },
  {
    label: 'Floor Price',
    getValue: ({ floorPrice }) => humanizeSolana(floorPrice.global),
  },
  {
    label: 'Items',
    getValue: ({ elementCount }) => elementCount.toLocaleString(),
  },
  {
    label: 'Listed Items',
    getValue: () => null,
  },
  {
    label: 'Listed In',
    getValue: () => null,
  },
];

interface OverviewItemProps {
  label: string;
  value: ReactNode;
}

function OverviewItem(props: OverviewItemProps) {
  return props.value ? (
    <Box
      sx={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        ':not(:last-child)': {
          borderRight: border,
        },
      }}
    >
      <Box>{props.label}</Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {props.value}
      </Box>
    </Box>
  ) : null;
}

const CardContainer = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'white',
  border,
  padding: 24,
  width: '100%',
  height: '100%',
});

const ItemsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-around',
  width: '100%',
  border,
  marginBottom: 16,
});

function CollectionNFTDetails() {
  const overview = useRecoilValue(collectionOverviewAtom);
  const searchResults = useRecoilValue(searchResultsAtom);

  if (!overview) {
    return null;
  }

  const images = searchResults.total
    ? searchResults.nfts
        .filter((nft) => nft.image)
        .slice(0, 4)
        .map((nft) => nft.image)
    : [];

  const hasSimilar = !!overview.similar.length;

  return (
    <Grid container={true} spacing={2}>
      <Grid item={true} xs={12} md={hasSimilar ? 6 : 12}>
        <CardContainer>
          <ImageButton size={200} transitionDuration={1} images={images} />
          <Typography
            gutterBottom={true}
            variant="h5"
            component="div"
            sx={{ mt: 2 }}
          >
            {humanizeCollection(overview)}
          </Typography>
          {overview.description && (
            <Typography variant="body2" color="text.secondary">
              {overview.description}
            </Typography>
          )}
          {/* <ItemsContainer>
              {items.map(
                (item) =>
                  overview && (
                    <OverviewItem
                      key={item.label}
                      label={item.label}
                      value={item.getValue(overview)}
                    />
                  )
              )}
            </ItemsContainer> */}
        </CardContainer>
      </Grid>
      {hasSimilar && (
        <Grid item={true} xs={12} md={6}>
          <ItemsContainer>
            {items.map(
              (item) =>
                overview && (
                  <OverviewItem
                    key={item.label}
                    label={item.label}
                    value={item.getValue(overview)}
                  />
                )
            )}
          </ItemsContainer>
          <Box sx={{ border }}>
            <SimilarCollections overview={overview} />
          </Box>
        </Grid>
      )}
    </Grid>
  );
}

export default CollectionNFTDetails;