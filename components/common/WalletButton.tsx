import { Person } from '@mui/icons-material'
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
} from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useRecoilState } from 'recoil'
import { autoRefresh } from '../../helpers/auctionHouseApi'
import { shortenPublicKey } from '../../helpers/utils'
import * as store from '../../store'

const WalletButton = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const walletModal = useWalletModal()
  const wallet = useWallet()
  const open = !!anchorEl
  const [solanaClusters, setSolanaClusters] = useRecoilState(
    store.solanaClusters
  )
  const router = useRouter()
  const [cookies, setCookie, removeCookie] = useCookies([
    'authToken',
    'expires_at',
    'nonce',
  ])

  const buttonProps =
    wallet.connected && wallet.publicKey
      ? {
          children: shortenPublicKey(wallet.publicKey),
          onClick: (event: React.MouseEvent<HTMLButtonElement>) =>
            setAnchorEl(event.currentTarget),
        }
      : {
          children: 'Connect Wallet',
          onClick: () => walletModal.setVisible(true),
        }

  useEffect(() => {
    if (cookies && wallet.connected) {
      const pubKey = wallet.publicKey?.toBase58()!
      autoRefresh(pubKey, cookies.nonce, cookies.authToken)
    }
  }, [wallet])

  return (
    <>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button onClick={() => router.push('/me')}>
          <Person />
        </Button>
        <Button {...buttonProps} />
      </ButtonGroup>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          sx={{ p: 2 }}
          onClick={() => {
            wallet.disconnect()
            removeCookie('authToken')
            removeCookie('expires_at')
            setAnchorEl(null)
          }}
        >
          Disconnect
        </MenuItem>
        <MenuItem sx={{ p: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Network</InputLabel>
            <Select
              value={solanaClusters.selectedIndex}
              label="Network"
              onChange={(evt) => {
                const nextIndex = evt.target.value
                if (typeof nextIndex === 'number') {
                  setSolanaClusters((curr) => ({
                    ...curr,
                    selectedIndex: nextIndex,
                  }))
                }
              }}
            >
              {solanaClusters.clusters.map((cluster, idx) => (
                <MenuItem value={idx} key={cluster.network}>
                  {cluster.network}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MenuItem>
      </Menu>
    </>
  )
}

export default WalletButton
