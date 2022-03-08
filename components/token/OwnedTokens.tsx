import styled from '@emotion/styled'
import { Container, Typography } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { useRecoilValue } from 'recoil'
import TokenContainer from '../../src/search/components/TokenContainer'
import { fetchOwned } from '../../store'

const HelperMessageContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  font-style: italic;
`

const ContentContainer = styled(Container)`
  height: 100%;
`

interface OwnedTokensProp {
  publicKey: PublicKey
}

const OwnedTokens = ({ publicKey }: OwnedTokensProp) => {
  const ownedTokens = useRecoilValue(fetchOwned(publicKey))

  return (
    <ContentContainer>
      {ownedTokens.length ? (
        <TokenContainer
          initialized
          tokens={ownedTokens}
          total={ownedTokens.length}
        />
      ) : (
        <HelperMessageContainer>
          <Typography>
            No tokens found for address {publicKey?.toBase58()}
          </Typography>
        </HelperMessageContainer>
      )}
    </ContentContainer>
  )
}

export default OwnedTokens
