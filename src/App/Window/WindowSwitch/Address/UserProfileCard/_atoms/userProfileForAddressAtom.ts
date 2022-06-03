import { atom, selector } from 'recoil';
import profileApi from '../../../../../AppBar/WalletButton/_helpers/profileApi';
import UserProfileType from '../../../../../_types/UserProfileType';
import addressStateAtom from '../../_atoms/addressStateAtom';

const username = 'stoned_ape';
const bio = `Our mission here at the academy is simple: Take 10,000 of the smoothest brained apes, put them all in one location and let the mayhem ensue. The academy was founded on the principles of friendship making, crayon eating and absolute, unregulated, deplorable, degenerate behaviour. Welcome fellow apes, to the Degenerate Ape Academy.`;

const userProfileForAddressAtom = atom<UserProfileType>({
  key: 'userProfileForAddressAtom',
  default: selector({
    key: 'userProfileForAddress/default',
    get: async ({ get }) => {
      const addressState = get(addressStateAtom);

      if (addressState) {
        try {
          const { data } = await profileApi.get<UserProfileType>(
            '/public/read',
            {
              params: {
                walletAddress: addressState.pubkey.toString(),
              },
            }
          );

          return data;
        } catch (e) {
          console.error('Unable to fetch user profile', e);
        }
      }

      return {
        username,
        bio,
        profilePictureMintAddress: '',
        twitterUsername: '',
        discordUsername: '',
        email: '',
      };
    },
  }),
});

export default userProfileForAddressAtom;