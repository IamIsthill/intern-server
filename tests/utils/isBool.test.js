import { describe, expect, it, vi } from 'vitest'

const isBool = (bool) => {
    if (bool) {
        if (bool === 'false') {
            return false
        }
        return true
    } else {
        return false
    }
}

describe('isBool helper function', () => {
    it('returns false if param is undefined', () => {
        expect(isBool(undefined)).toBe(false)
    })

    it('returns false if param is empty string', () => {
        expect(isBool('')).toBe(false)
    })

    it('returns false if param is a string: false', () => {
        expect(isBool('false')).toBe(false)
    })

    it('returns true if param is a truthy', () => {
        expect(isBool('true')).toBe(true)
        expect(isBool(1)).toBe(true)
    })
    it('returns true if param is actual boolean true', () => {
        expect(isBool(true)).toBe(true)
    })
    it('returns false if param is actual boolean false', () => {
        expect(isBool(false)).toBe(false)

    })
})