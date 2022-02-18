import { AccountInfo, ParsedAccountData } from '@solana/web3.js'
import { Buffer } from 'buffer'

export function getSpace(
  account: AccountInfo<Buffer | ParsedAccountData> | null
) {
  if (!account) {
    return 0
  }
  let space: number
  if (!('parsed' in account.data)) {
    space = account.data.length
  } else {
    space = account.data.space
  }

  return space
}

export function getProgram(
  account: AccountInfo<Buffer | ParsedAccountData> | null
) {
  if (!account) {
    return ''
  }

  if ('parsed' in account.data) {
    return account?.data?.program
  } else {
    return ''
  }
}
