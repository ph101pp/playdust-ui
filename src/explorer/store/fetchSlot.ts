import { Connection, EpochInfo } from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import solanaClusterAtom from '../../App/_atoms/solanaClusterAtom'

export interface SlotDetails {
  slot: number
  epochInfo: EpochInfo
}

export const fetchSlot = selectorFamily<SlotDetails, number>({
  key: 'slot',
  get:
    () =>
    async ({ get }) => {
      const commitment = 'confirmed'

      const { endpoint } = get(solanaClusterAtom)

      const connection = new Connection(endpoint)

      let slot = await connection.getSlot(commitment)
      let epochInfo = await connection.getEpochInfo(commitment)

      return {
        slot,
        epochInfo,
      }
    },
})

export const useSlot = (slot: number) => useRecoilValue(fetchSlot(slot))
