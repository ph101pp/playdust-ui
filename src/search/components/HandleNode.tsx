import { Typography } from '@mui/material'
import { Handle, NodeProps, Position } from 'react-flow-renderer'

const HandleNode = ({ data }: NodeProps) => {
  return (
    <>
      <Typography fontSize={10}>{data.label || ''}</Typography>
      <Handle type="target" id="target" position={Position.Top} />
      <Handle type="source" id="source" position={Position.Top} />
    </>
  )
}

export default HandleNode