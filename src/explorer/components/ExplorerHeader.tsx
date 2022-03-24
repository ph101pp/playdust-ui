import { Grid, Stack, Typography } from '@mui/material'
import { CopyButton } from './CopyButton'
import { ExternalLinks } from './ExternalLinks'

interface ExplorerHeaderProps {
  label: string
  filter: string
  value: string
}

export const ExplorerHeader = ({
  label,
  filter,
  value,
}: ExplorerHeaderProps) => {
  return (
    <Stack spacing={2}>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {label}
          </Typography>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={12}>
          {value} <CopyButton value={value} />
        </Grid>
      </Grid>
      <ExternalLinks filter={filter} value={value} />
    </Stack>
  )
}