import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { compact } from '../../../../common/helpers/utils'
import { useAccountInfo } from '../../../store'
import { AccountDetails } from '../../AccountDetails'
import { ExplorerCard } from '../../ExplorerCard'
import { ExplorerGrid } from '../../ExplorerGrid'
import { AccountLink } from '../../Links'
import { SolBalance } from '../../SolBalance'

const MAX_SLASH_PENALTY = Math.pow(2, 8)

interface ConfigAccountProps {
  pubkey: PublicKey
}

const StakeConfigContent = ({ pubkey }: ConfigAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const { lamports } = account

  const configAccount = (account.data as ParsedAccountData).parsed

  const warmupCooldownFormatted = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(configAccount.info.warmupCooldownRate)

  const slashPenaltyFormatted = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(configAccount.info.slashPenalty / MAX_SLASH_PENALTY)

  const rows = compact([
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['SOL Balance', <SolBalance lamports={lamports} />],
    ['Warmup / Cooldown Rate', warmupCooldownFormatted],
    ['Slash Penalty', slashPenaltyFormatted],
  ])

  return <ExplorerGrid rows={rows} />
}

export const StakeConfig = (props: ConfigAccountProps) => {
  return (
    <>
      <ExplorerCard skeleton="table" title="Stake Config">
        <StakeConfigContent {...props} />
      </ExplorerCard>
      <AccountDetails pubkey={props.pubkey} />
    </>
  )
}