import { Box, Tab, Tabs } from '@mui/material'
import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { FunctionComponent, useState } from 'react'
import { useAccountInfo } from '../../store'
import { a11yProps, TabPanel } from '../common'
import { Domains } from './Domains'
import { Security } from './Security'
import { Tokens } from './Tokens'
import { Transactions } from './Transactions'

interface AccountDetailsProps {
  pubkey: PublicKey
}

export const UnknownAccountDetails = ({ pubkey }: AccountDetailsProps) => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setValue(parseInt(newValue))
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="History" {...a11yProps(0)} />
          <Tab label="Tokens" {...a11yProps(1)} />
          <Tab label="Domains" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Transactions pubkey={pubkey} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Tokens pubkey={pubkey} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Domains pubkey={pubkey} />
      </TabPanel>
    </>
  )
}

// This will be re-organized in a future ticket. Tabs will be data-driven, not hard-coded
export const UpgradeableLoaderAccountDetails = ({
  pubkey,
}: AccountDetailsProps) => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setValue(parseInt(newValue))
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="History" {...a11yProps(0)} />
          <Tab label="Tokens" {...a11yProps(1)} />
          <Tab label="Domains" {...a11yProps(2)} />
          <Tab label="Security" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Transactions pubkey={pubkey} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Tokens pubkey={pubkey} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Domains pubkey={pubkey} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Security pubkey={pubkey} />
      </TabPanel>
    </>
  )
}

const StakeAccountDetails = UnknownAccountDetails
const TokenAccountDetails = UnknownAccountDetails
const NonceAccountDetails = UnknownAccountDetails
const VoteAccountDetails = UnknownAccountDetails
const SysvarAccountDetails = UnknownAccountDetails
const ConfigAccountDetails = UnknownAccountDetails

const map: Record<string, FunctionComponent<AccountDetailsProps>> = {
  'bpf-upgradeable-loader': UpgradeableLoaderAccountDetails,
  stake: StakeAccountDetails,
  'spl-token': TokenAccountDetails,
  nonce: NonceAccountDetails,
  vote: VoteAccountDetails,
  sysvar: SysvarAccountDetails,
  config: ConfigAccountDetails,
}

export const AccountDetails = (props: AccountDetailsProps) => {
  const account = useAccountInfo(props.pubkey)

  const AccountDetailsComponent =
    map[(account?.data as ParsedAccountData)?.program] || UnknownAccountDetails

  return <AccountDetailsComponent {...props} />
}