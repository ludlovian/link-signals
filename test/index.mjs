import { suite, test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'

import { signal } from '@preact/signals-core'

import linkSignals from '../src/index.mjs'

suite('linkSignals', () => {
  suite('bidrectional update', () => {
    let $sig1
    let $sig2
    let fn1
    let fn2
    let dispose

    beforeEach(t => {
      $sig1 = signal(1)
      $sig2 = signal(1)
      fn1 = t.mock.fn(() => ($sig2.value = $sig1.value))
      fn2 = t.mock.fn(() => ($sig1.value = $sig2.value))
      dispose = undefined
    })

    afterEach(() => {
      dispose && dispose()
      dispose = undefined
    })

    test('from 1 to 2', () => {
      dispose = linkSignals([$sig1, fn1], [$sig2, fn2])

      $sig1.value = 2

      assert.strictEqual($sig2.value, 2)
      assert.strictEqual(fn1.mock.callCount(), 1)
      assert.strictEqual(fn2.mock.callCount(), 0)
    })

    test('from 2 to 1', () => {
      dispose = linkSignals([$sig1, fn1], [$sig2, fn2])

      $sig2.value = 2

      assert.strictEqual($sig1.value, 2)
      assert.strictEqual(fn1.mock.callCount(), 0)
      assert.strictEqual(fn2.mock.callCount(), 1)
    })

    test('no change after dispose', () => {
      dispose = linkSignals([$sig1, fn1], [$sig2, fn2])
      dispose()
      dispose = undefined

      $sig2.value = 2

      assert.strictEqual($sig1.value, 1)
      assert.strictEqual(fn1.mock.callCount(), 0)
      assert.strictEqual(fn2.mock.callCount(), 0)
    })
  })
})
