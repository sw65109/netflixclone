import ReactPlayerLazy from 'react-player/lazy'
import type { ComponentType } from 'react'

type PlayerProps = {
  url: string
  width?: string | number
  height?: string | number
  style?: React.CSSProperties
  playing?: boolean
  muted?: boolean
}

const ReactPlayer = ReactPlayerLazy as unknown as ComponentType<PlayerProps>