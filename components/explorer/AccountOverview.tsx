import { Box, Grid, Typography } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { useRouter } from 'next/router'
import { getSpace } from '../../solana/account'
import { useAccountDetails, useAccountInfo } from '../../store'
import { SolBalance } from './SolBalance'

interface AccountOverviewProps {
  pubkey: PublicKey
}

export const AccountOverview = ({ pubkey }: AccountOverviewProps) => {
  const router = useRouter()
  const account = useAccountInfo(pubkey)
  const details = useAccountDetails(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const { executable, lamports, owner, rentEpoch } = account
  const { isToken } = details

  if (isToken) {
    router.push(`/token/${router.query.id}`)
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Overview
      </Typography>
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
    </Box>
  )
}
