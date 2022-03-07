import { Grid } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { getSpace } from '../../../solana/account'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../ExplorerCard'
import { SolBalance } from '../SolBalance'

interface UnknownAccountProps {
  pubkey: PublicKey
}

export const UnknownAccountContent = ({ pubkey }: UnknownAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const { executable, lamports, owner, rentEpoch } = account

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={lamports} />
      </Grid>
      <Grid item xs={12} md={2}>
        SPL Token Balance
      </Grid>
      <Grid item xs={12} md={10}>
        0
      </Grid>
      <Grid item xs={12} md={2}>
        Rent Epoch
      </Grid>
      <Grid item xs={12} md={10}>
        {rentEpoch}
      </Grid>
      <Grid item xs={12} md={2}>
        Stake
      </Grid>
      <Grid item xs={12} md={10}>
        0
      </Grid>
      <Grid item xs={12} md={2}>
        Allocated Data Size
      </Grid>
      <Grid item xs={12} md={10}>
        {getSpace(account)}
      </Grid>
      <Grid item xs={12} md={2}>
        Owner
      </Grid>
      <Grid item xs={12} md={10}>
        {JSON.stringify(owner)}
      </Grid>
      <Grid item xs={12} md={2}>
        Executable
      </Grid>
      <Grid item xs={12} md={10}>
        {executable ? 'Yes' : 'No'}
      </Grid>
    </Grid>
  )
}

export const UnknownAccount = (props: UnknownAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Overview">
      <UnknownAccountContent {...props} />
    </ExplorerCard>
  )
}
