import Link from 'next/link'
import ellipsisify from '../../../App/_helpers/ellipsisify'
import encodeWindowHash from '../../../App/_helpers/encodeWindowHash'
import WindowUnion from '../../../App/_types/WindowUnionType'
import { CopyButton } from './CopyButton'


export interface ExplorerLinkProps {
  url?: string
  to: string | number
  label?: string
  allowCopy?: boolean
  ellipsis?: any
  type?: WindowUnion
}

export function ExplorerLink({
  to,
  label,
  allowCopy,
  ellipsis,
  type,
}: ExplorerLinkProps) {
  const display =
    label || (ellipsis ? ellipsisify(`${  to}`, ellipsis[0], ellipsis[1]) : to)

  const href = type ? encodeWindowHash({ type, state: String(to) }) : '#'
  return (
    <>
      {allowCopy && <CopyButton value={to} />}
      <Link href={href}>
        <pre style={{ display: 'inline' }}>{display}</pre>
      </Link>
    </>
  )
}

export function AccountLink(props: ExplorerLinkProps) {
  return <ExplorerLink type="address" {...props} />
}

export function SlotLink(props: ExplorerLinkProps) {
  return <ExplorerLink type="block" {...props} />
}

export function ProgramLink(props: ExplorerLinkProps) {
  return <ExplorerLink url="?program" {...props} />
}

export function TxLink(props: ExplorerLinkProps) {
  return <ExplorerLink type="tx" {...props} />
}

export function EpochLink(props: ExplorerLinkProps) {
  return <ExplorerLink type="epoch" {...props} />
}
