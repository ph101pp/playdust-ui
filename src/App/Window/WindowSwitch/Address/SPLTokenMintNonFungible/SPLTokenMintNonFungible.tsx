import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import setWindowImagesAtom from '../../../_atoms/setWindowImagesAtom';
import ContentContainer from '../_sharedComponents/ContentContainer';
import MetaplexCreators from './MetaplexCreators';
import MetaplexNFTAttributes from './MetaplexNFTAttributes';
import MetaplexRawOffChainMetadata from './MetaplexRawOffChainMetadata';
import MetaplexRawOnChainMetadata from './MetaplexRawOnChainMetadata';
import NFTDetailsView from './NFTDetailsView/NFTDetailsView';
import playdustNftDataAtom from './_atoms/playdustNftDataAtom';

// 5fzi7TauBFdac94hvm8DcTVN7jrCwYmf6PLuT2TJA7oe
function SPLTokenMintNonFungible() {
  const playdustNftData = useRecoilValue(playdustNftDataAtom);
  const setWindowImages = useRecoilValue(setWindowImagesAtom);

  useEffect(() => {
    if (setWindowImages && playdustNftData) {
      setWindowImages([playdustNftData.metaplexOffChainData.image]);
    }
  }, [setWindowImages, playdustNftData]);

  return (
    <>
      <NFTDetailsView />
      <ContentContainer>
        <MetaplexNFTAttributes />
        <MetaplexCreators />
        <MetaplexRawOffChainMetadata />
        <MetaplexRawOnChainMetadata />
      </ContentContainer>
    </>
  );
}

export default SPLTokenMintNonFungible;
