import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { getSpace } from '../../../helpers/account'
import compact from '../../../helpers/compact'
import { useAccountInfo } from '../../../store'
import {
  AccountLink,
  Downloadable,
  ExplorerCard,
  ExplorerGrid,
  SlotLink,
  SolBalance,
} from '../../common'
import { AccountDetails } from '../AccountDetails'

interface UpgradeableLoaderAccountProps {
  pubkey: PublicKey
}

const UpgradeableProgramDataContent = ({
  pubkey,
}: UpgradeableLoaderAccountProps) => {
  const account = useAccountInfo(pubkey)

  const programData = (account?.data as ParsedAccountData)?.parsed?.info

  if (!account) {
    return <div>No data available</div>
  }

  const rows = compact([
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['SOL Balance', <SolBalance lamports={account.lamports} />],
    [
      'Data (Bytes)',
      <Downloadable
        data={programData.data[0]}
        filename={`${pubkey.toString()}.bin`}
      >
        <span className="me-2">{getSpace(account)}</span>
      </Downloadable>,
    ],
    ['Upgradeable', programData.authority !== null ? 'Yes' : 'No'],
    ['Last Deployed Slot', <SlotLink to={programData.slot} allowCopy />],
    programData.authority !== null && [
      'Upgrade Authority',
      <AccountLink to={programData.authority} allowCopy />,
    ],
  ])

  return <ExplorerGrid rows={rows} />
}

// 72xbspJP8vtJ91Lp7k6mqJXFiPSvpad5BBRrixfAWh8m
export const UpgradeableProgramData = (
  props: UpgradeableLoaderAccountProps
) => {
  return (
    <>
      <ExplorerCard skeleton="table" title="Program Executable Data Account">
        <UpgradeableProgramDataContent {...props} />
      </ExplorerCard>
      <AccountDetails pubkey={props.pubkey} />
    </>
  )
}
