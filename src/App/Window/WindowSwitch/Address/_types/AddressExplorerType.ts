import { PublicKey } from '@solana/web3.js';

interface AddressExplorerType {
  state: string;
  type: 'address';
  pubkey: PublicKey;
  label?: string;
  hasPrivateKey: boolean;
}

export default AddressExplorerType;