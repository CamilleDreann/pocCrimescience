import { atom } from 'nanostores'

export const $objectives = atom([])

// { id, label } when an objective is completed, null otherwise
export const $completionEvent = atom(null)

// true briefly to trigger badge pulse
export const $widgetPulse = atom(false)

export function setObjectives(objectives) {
  $objectives.set(objectives.map(o => ({ ...o, completed: false })))
}

export function completeObjective(id) {
  const objectives = $objectives.get()
  const objective = objectives.find(o => o.id === id)
  if (!objective || objective.completed) return
  $objectives.set(objectives.map(o => o.id === id ? { ...o, completed: true } : o))
  $completionEvent.set({ id: objective.id, label: objective.label })
}

export function addObjectives(newObjectives) {
  $objectives.set(newObjectives.map(o => ({ ...o, completed: false })))
  $widgetPulse.set(true)
  setTimeout(() => $widgetPulse.set(false), 1000)
}

export function clearObjectives() {
  $objectives.set([])
  $completionEvent.set(null)
  $widgetPulse.set(false)
}

export const $resetToMenu = atom(false)

export function triggerResetToMenu() {
  $resetToMenu.set(true)
}
