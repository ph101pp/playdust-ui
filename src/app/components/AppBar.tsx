import styled from '@emotion/styled'
import { DeleteSweep, Home } from '@mui/icons-material'
import {
  Button,
  createTheme,
  IconButton,
  Paper,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { PropsWithChildren, ReactNode } from 'react'
import { useRecoilValue, useResetRecoilState } from 'recoil'
import Notifications from '../../../components/common/Notifications'
import WalletButton from '../../../components/common/WalletButton'
import { encodeWindowSearch } from '../helpers/getWindowUrl'
import * as store from '../store'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const appBarWidth = 64

const VerticalAppBar = styled(Paper)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${appBarWidth}px;
`

const VerticalAppBarContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 16px 8px;
`

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

const ChildrenContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${appBarWidth}px;
  bottom: 0;
  right: 0;
  overflow: hidden;
`

const ChildrenRelativeContainer = styled.div`
  position: relative;
  height: 100%;
  overflow: auto;
`

interface AppBarProps {
  children: ReactNode
}

type TabButtonProps = PropsWithChildren<{
  isActive: boolean
  onClick: () => any
}>

const TabButton = ({ children, isActive, onClick }: TabButtonProps) => (
  <Button
    sx={{
      width: 36,
      minWidth: 0,
    }}
    variant={isActive ? 'contained' : 'text'}
    color={isActive ? 'primary' : 'inherit'}
    onClick={() => onClick()}
  >
    {children}
  </Button>
)

const AppBar = ({ children }: AppBarProps) => {
  const tabs = useRecoilValue(store.tabs)
  const activeTab = useRecoilValue(store.activeTab)
  const setSelectedTab = store.useSetSelectedTab()
  const router = useRouter()
  const resetTabs = useResetRecoilState(store.tabs)

  if (!router.isReady) {
    return <></>
  }

  const inWindowManager = router.pathname === '/'

  return (
    <>
      <ThemeProvider theme={theme}>
        <VerticalAppBar square elevation={3}>
          <VerticalAppBarContent>
            <TopContainer>
              <TabButton
                isActive={!activeTab}
                onClick={() => {
                  setSelectedTab()
                  router.push('')
                }}
              >
                <Home />
              </TabButton>
              {tabs.map((tab, idx) => (
                <TabButton
                  key={tab.id}
                  isActive={inWindowManager && tab.id === activeTab?.id}
                  onClick={() => {
                    const state = tab.state[0]
                    setSelectedTab(tab.id)
                    router.push(encodeWindowSearch(state))
                  }}
                >
                  <Typography>{idx + 1}</Typography>
                </TabButton>
              ))}
              {tabs.length > 0 && (
                <IconButton
                  onClick={() => {
                    router.push('')
                    resetTabs()
                  }}
                >
                  <DeleteSweep />
                </IconButton>
              )}
            </TopContainer>
            <WalletButton active={!inWindowManager} />
          </VerticalAppBarContent>
        </VerticalAppBar>
      </ThemeProvider>
      <ChildrenContainer>
        <ChildrenRelativeContainer>{children}</ChildrenRelativeContainer>
      </ChildrenContainer>
      <Notifications />
    </>
  )
}

export default AppBar
