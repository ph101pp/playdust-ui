import styled from '@emotion/styled'
import {
  Box,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from '@mui/material'
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionResponse,
} from '@solana/web3.js'
import { useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { shortenPublicKey } from '../../helpers/utils'
import { fetchNftTransactionsOnchain } from '../../store'

const NoData = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 20px;
  width: 100%;
`

interface TransactionHistoryProps {
  mint: string
}

interface timeDivisions {
  amount: number
  name: Intl.RelativeTimeFormatUnit
}

const TransactionHistory = ({ mint }: TransactionHistoryProps) => {
  const [tab, setTab] = useState(0)
  const data = useRecoilValueLoadable(fetchNftTransactionsOnchain(mint))

  const formatTimeAgo = (date: number) => {
    const formatter = new Intl.RelativeTimeFormat('en-US')
    const DIVISIONS: timeDivisions[] = [
      { amount: 60, name: 'seconds' },
      { amount: 60, name: 'minutes' },
      { amount: 24, name: 'hours' },
      { amount: 7, name: 'days' },
      { amount: 4.34524, name: 'weeks' },
      { amount: 12, name: 'months' },
      { amount: Number.POSITIVE_INFINITY, name: 'years' },
    ]

    let duration = (date * 1000 - Date.now()) / 1000
    for (let i = 0; i <= DIVISIONS.length; i++) {
      const division = DIVISIONS[i]
      if (Math.abs(duration) < division.amount) {
        return formatter.format(Math.round(duration), division.name)
      }
      duration /= division.amount
    }
  }

  const processData = (data: TransactionResponse[]) => {
    return data.map((item: TransactionResponse) => {
      if (!item.transaction) {
        return null
      }

      const render_data = (
        <TableRow key={item.transaction.signatures[0]}>
          <TableCell className="text-center border border-slate-400">
            {shortenPublicKey(item.transaction.signatures[0])}
          </TableCell>
          <TableCell className="text-center border border-slate-400">
            {formatTimeAgo(item.blockTime!)}
          </TableCell>
          <TableCell className="text-center border border-slate-400">
            {shortenPublicKey(
              new PublicKey(item.transaction.message.accountKeys[0])
            )}
          </TableCell>
          <TableCell className="text-center border border-slate-400">
            {shortenPublicKey(
              new PublicKey(item.transaction.message.accountKeys[1])
            )}
          </TableCell>
          {tab === 0 ? (
            <>
              <TableCell className="text-center border border-slate-400">
                {item.meta!.fee / LAMPORTS_PER_SOL} SOL
              </TableCell>
              <TableCell className="text-center border border-slate-400">
                {item.meta?.err ? 'Error' : 'Success'}
              </TableCell>
            </>
          ) : (
            <TableCell className="text-center border border-slate-400">
              {
                item.meta?.postTokenBalances!.find(
                  (token) => token.uiTokenAmount.amount !== '0'
                )?.uiTokenAmount.uiAmountString
              }{' '}
              Tokens
            </TableCell>
          )}
        </TableRow>
      )
      if (tab === 1) {
        if (!item.meta?.err && item.meta?.postTokenBalances?.length) {
          return render_data
        }
      } else {
        return render_data
      }
    })
  }

  switch (data.state) {
    case 'hasValue':
      const transactions = data.contents

      return (
        <Box mx={1}>
          <Tabs value={tab} onChange={(e, val) => setTab(val)}>
            <Tab label="History" />
            <Tab label="Transfers" />
          </Tabs>
          <div>
            {transactions.length ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Signature</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Destination</TableCell>
                      {tab === 0 ? (
                        <>
                          <TableCell>Fee</TableCell>
                          <TableCell>Status</TableCell>
                        </>
                      ) : (
                        <TableCell>Amount</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>{processData(transactions)}</TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper elevation={3}>
                <NoData>Transaction data not found</NoData>
              </Paper>
            )}
          </div>
        </Box>
      )
    case 'loading':
      return <></>
    case 'hasError':
      return <Box mx={1}>No data for transactions</Box>
  }
}

export default TransactionHistory
