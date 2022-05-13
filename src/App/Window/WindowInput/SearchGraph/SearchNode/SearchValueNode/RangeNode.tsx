import styled from '@emotion/styled';
import React from 'react';
import { useRecoilValue } from 'recoil';
import type RangeQueryNodeType from '../../../../../../_types/RangeQueryNodeType';
import useUpdateRangeQueryNode from '../../../../_hooks/useUpdateRangeQueryNode';
import RangeInput from '../../../../_sharedComponents/RangeInput';
import searchQueryChild from '../_atoms/searchQueryChildAtom';

const RootContainer = styled.div`
  margin-top: 16px;
`;

interface RangeNodeProps {
  id: string;
}

function RangeNode(props: RangeNodeProps) {
  const data = useRecoilValue(searchQueryChild(props.id)) as RangeQueryNodeType;
  const updateRangeQueryNode = useUpdateRangeQueryNode('memory');

  return (
    <RootContainer>
      <RangeInput
        value={data.value}
        min={data.min}
        max={data.max}
        onApply={(update) => updateRangeQueryNode({ id: data.id, update })}
      />
    </RootContainer>
  );
}

export default RangeNode;