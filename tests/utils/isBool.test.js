import { describe, expect, it, vi } from 'vitest'
import { toBool } from '../../utils'

describe('isBool helper function', () => {
    it('returns false if param is undefined', () => {
        expect(toBool(undefined)).toBe(false)
    })

    it('returns false if param is empty string', () => {
        expect(toBool('')).toBe(false)
    })

    it('returns false if param is a string: false', () => {
        expect(toBool('false')).toBe(false)
    })

    it('returns true if param is a truthy', () => {
        expect(toBool('true')).toBe(true)
        expect(toBool(1)).toBe(true)
    })
    it('returns true if param is actual boolean true', () => {
        expect(toBool(true)).toBe(true)
    })
    it('returns false if param is actual boolean false', () => {
        expect(toBool(false)).toBe(false)
    })
    it('returns false if param is null', () => {
        expect(toBool(null)).toBe(false)
    })
})