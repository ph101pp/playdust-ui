import type AttributeQueryContentType from '../../../_types/AttributeQueryContentType';
import removeQueryNode from '../_helpers/removeQueryNode';
import updateQueryNode from '../_helpers/updateQueryNode';
import makeUseQueryChange from './makeUseQueryChange';

interface UseUpdateAttributeNodeInput {
  id: string;
  update: Partial<AttributeQueryContentType>;
  clearOnEmpty?: boolean;
}

const useUpdateAttributeQueryNode =
  makeUseQueryChange<UseUpdateAttributeNodeInput>(
    (query) =>
      ({ id, update, clearOnEmpty }) => {
        if (
          clearOnEmpty &&
          update.value !== undefined &&
          update.value.length === 0
        ) {
          const next = removeQueryNode(query, id);

          return { query: next };
        }

        const next = updateQueryNode(query, id, update);

        return { query: next };
      }
  );

export default useUpdateAttributeQueryNode;
