import { FilterAlt } from '@mui/icons-material'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
} from '@mui/material'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { ParsedMetadata } from '../../solana/types'
import * as store from '../../store'

interface TokenCardFilter {
  metadata: ParsedMetadata
}

const TokenCardFilter = ({ metadata }: TokenCardFilter) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const filters = useRecoilValue(store.collectionFilters)
  const setFilter = store.useSetCollectionFilter()

  const attributes = metadata.offchain.attributes

  return (
    <>
      <IconButton onClick={(evt) => setAnchorEl(evt.currentTarget)}>
        <FilterAlt />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormGroup>
            {attributes.map((attribute) => (
              <FormControlLabel
                key={attribute.trait_type}
                control={
                  <Checkbox
                    checked={
                      !!filters.find(
                        (entry) =>
                          entry.trait === attribute.trait_type &&
                          entry.options.includes(attribute.value)
                      )
                    }
                    onChange={(_evt, nextValue) => {
                      setFilter(
                        attribute.trait_type,
                        attribute.value,
                        nextValue
                      )
                      setAnchorEl(null)
                    }}
                  />
                }
                label={`${attribute.trait_type}: ${attribute.value}`}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Popover>
    </>
  )
}

export default TokenCardFilter
