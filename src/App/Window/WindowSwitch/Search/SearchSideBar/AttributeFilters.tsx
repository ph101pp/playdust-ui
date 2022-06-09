// import styled from '@emotion/styled';
// import { ChevronRight, ExpandMore } from '@mui/icons-material';
// import {
//   Button,
//   Checkbox,
//   FormControl,
//   FormControlLabel,
//   FormGroup,
// } from '@mui/material';
// import React, { useEffect, useState } from 'react';
// import { useRecoilValue } from 'recoil';
// import AttributeQueryNodeType from '../../../../../../_types/AttributeQueryNodeType';
// import safePromise from '../../../../../_helpers/safePromise';
// import searchQueryAttributesAtom from '../../../../_atoms/searchQueryAttributesAtom';
// import useAddAttributeQueryNode from '../../../../_hooks/useAddAttributeQueryNode';
// import useUpdateAttributeQueryNode from '../../../../_hooks/useUpdateAttributeQueryNode';
// import useSearchAggregations from './_hooks/useSearchAggregations';

// const RootContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: calc(100% + 16px);
//   height: 100%;
//   overflow: auto;
//   margin-left: -16px;
//   padding-left: 16px;
// `;

// const normalizeOptions = (
//   options: string[],
//   found: AttributeQueryNodeType | undefined,
//   isExpanded: boolean
// ) => {
//   const normalized = options
//     .map((option) => ({
//       option,
//       checked: !!(found && found.value.includes(option)),
//     }))
//     .sort((a, b) => {
//       if (a.option === b.option) {
//         return 0;
//       }
//       return a.option < b.option ? -1 : 1;
//     });

//   if (isExpanded) {
//     return normalized;
//   }

//   return normalized.filter((entry) => entry.checked);
// };

// function AttributeFilters() {
//   const queries = useRecoilValue(searchQueryAttributesAtom);
//   const addAttributeQueryNode = useAddAttributeQueryNode();
//   const updateAttributeNode = useUpdateAttributeQueryNode();
//   const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({});

//   const [searchAggregations, updateSearchAggregations] =
//     useSearchAggregations();

//   useEffect(() => {
//     safePromise(updateSearchAggregations());
//   }, [updateSearchAggregations]);

//   const attributes = [...searchAggregations.attributes].sort((a, b) => {
//     if (a.trait === b.trait) {
//       return 0;
//     }
//     return a.trait < b.trait ? -1 : 1;
//   });

//   return (
//     <RootContainer>
//       {attributes.map((attribute) => {
//         const isExpanded = showAll[attribute.trait] || false;
//         const found = queries.find((entry) => entry.trait === attribute.trait);
//         const options = normalizeOptions(attribute.options, found, isExpanded);

//         return (
//           <FormControl
//             sx={{ mb: 2 }}
//             component="fieldset"
//             variant="standard"
//             key={attribute.trait}
//           >
//             <Button
//               sx={{
//                 justifyContent: 'space-between',
//                 fontWeight: '700',
//                 textAlign: 'left',
//               }}
//               endIcon={isExpanded ? <ExpandMore /> : <ChevronRight />}
//               onClick={() =>
//                 setShowAll({ ...showAll, [attribute.trait]: !isExpanded })
//               }
//             >
//               {attribute.trait}
//             </Button>
//             <FormGroup>
//               {options.map(({ option, checked }) => (
//                 <FormControlLabel
//                   key={option}
//                   control={
//                     <Checkbox
//                       sx={{ ml: 2 }}
//                       size="small"
//                       checked={checked}
//                       onChange={() => {
//                         if (!found) {
//                           return addAttributeQueryNode({
//                             value: [option],
//                             trait: attribute.trait,
//                             operation: 'and',
//                           });
//                         }

//                         if (!checked) {
//                           return updateAttributeNode({
//                             id: found.id,
//                             update: {
//                               value: [...found.value, option],
//                             },
//                           });
//                         }

//                         const nextValue = found.value.filter(
//                           (entry) => entry !== option
//                         );

//                         return updateAttributeNode({
//                           id: found.id,
//                           update: {
//                             value: nextValue,
//                           },
//                           clearOnEmpty: true,
//                         });
//                       }}
//                       name={option.toString()}
//                     />
//                   }
//                   label={option}
//                 />
//               ))}
//             </FormGroup>
//           </FormControl>
//         );
//       })}
//     </RootContainer>
//   );
// }

import React from 'react';

function AttributeFilters() {
  return <span>Attribute Filters Placeholder</span>;
}

export default AttributeFilters;