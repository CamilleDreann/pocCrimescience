import { createPortal } from 'react-dom'
import { getSnapBounds } from '../../hooks/useDrag'
import styles from './SnapPreview.module.css'

export default function SnapPreview({ snapZone }) {
  if (!snapZone) return null

  const bounds = getSnapBounds(snapZone)
  if (!bounds) return null

  const { position, size } = bounds

  return createPortal(
    <div
      className={styles.preview}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    />,
    document.body
  )
}
