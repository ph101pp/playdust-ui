import { selectorFamily } from 'recoil';
import type OpenSearchCollectionSourceType from '../../../../_types/OpenSearchCollectionSourceType';
import api from '../../_helpers/frontendApi';

const collectionByIdAtom = selectorFamily({
  key: 'collectionByIdAtom',
  get: (id) => async () => {
    const { data } = await api.post<OpenSearchCollectionSourceType[]>(
      '/collections',
      [id]
    );

    return data[0];
  },
});

export default collectionByIdAtom;