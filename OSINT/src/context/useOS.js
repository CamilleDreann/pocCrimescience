import { useContext } from 'react'
import { OSContext } from './OSContext'

export function useOS() {
  const ctx = useContext(OSContext)
  if (!ctx) throw new Error('useOS must be used within OSProvider')
  return ctx
}
