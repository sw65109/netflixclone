'use client'

import Modal from '../../components/Modal'
import { useUiStore } from '../../stores/uiStore'

export default function GlobalModal() {
  const showModal = useUiStore((s) => s.showModal)
  return showModal ? <Modal /> : null
}