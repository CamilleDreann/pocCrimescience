import { atom } from 'nanostores'
import initialMessages from '../data/messages.json'

export const $messages = atom(initialMessages)

export function addMessage(message) {
  $messages.set([message, ...$messages.get()])
}

export function markAsRead(id) {
  $messages.set(
    $messages.get().map(m => m.id === id ? { ...m, readed: true } : m)
  )
}

export function setRender(id, render) {
  $messages.set(
    $messages.get().map(m => m.id === id ? { ...m, render } : m)
  )
}
