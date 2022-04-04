import { atom } from 'recoil'
import Status from '../../../types/Status'

export const collectionStatus = atom<Status>({
  key: 'collectionStatus',
  default: 0,
})
