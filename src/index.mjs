import { effect } from '@preact/signals-core'

export default function linkSignals (...inputs) {
  inputs = inputs.flat()
  let prev
  const effects = []
  while (inputs.length >= 2) {
    const [$sig, onChange] = inputs.splice(0, 2)
    prev = $sig.value
    effects.push(() => {
      if ($sig.value !== prev) {
        prev = $sig.value
        onChange(prev)
      }
    })
  }
  const disposes = effects.map(e => effect(e))
  return () => disposes.map(d => d())
}
