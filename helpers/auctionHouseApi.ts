import axios, { AxiosInstance } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: `/playdust-api`,
})

export const makeNFTBid = async (
  wallet: string,
  mint: string,
  buyPrice: number,
  auctionHouse: string
): Promise<Buffer> => {
  const prefix = `/auction-house/${auctionHouse}`
  const { data } = await instance.post(`${prefix}/bid`, {
    wallet,
    mint,
    buyPrice,
    tokenSize: 1,
  })

  return data
}

export const makeNFTListing = async (
  wallet: string,
  mint: string,
  buyPrice: number,
  auctionHouse: string
): Promise<Buffer> => {
  const prefix = `/auction-house/${auctionHouse}`
  const { data } = await instance.post(`${prefix}/ask`, {
    wallet,
    mint,
    buyPrice,
    tokenSize: 1,
  })

  return data
}

export const executeNFTSale = async (
  wallet: string,
  mint: string,
  buyPrice: number,
  buyerWallet: string,
  auctionHouse: string
): Promise<Buffer> => {
  const prefix = `/auction-house/${auctionHouse}`
  const { data } = await instance.post(`${prefix}/execute-sale`, {
    wallet,
    sellerWallet: wallet,
    buyerWallet,
    mint,
    buyPrice,
    tokenSize: 1,
  })

  return data
}

export const ListPaymentTokens = async () => {
  const { data } = await instance.get(`/trading/markets`)

  return data
}

export const GetAllOrders = async (mint: string) => {
  const { data } = await instance.get(`/trading/${mint}/orders`)

  return data
}

export const GetNonce = async (wallet: string): Promise<string> => {
  const { data } = await instance.post('/authentication/nonce', {
    wallet,
  })

  return data.nonce
}

export const GetAuthToken = async (
  wallet: string,
  signature: string,
  nonce: string
) => {
  const { data } = await instance.post('/authentication/token', {
    wallet,
    signature,
    nonce,
  })

  return data.token
}

export const RefreshToken = async (wallet: string, nonce: string) => {
  const { data } = await instance.post('/authentication/refresh-token', {
    wallet,
    nonce,
  })

  return data.token
}

export default instance
