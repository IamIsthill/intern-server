import { describe, expect, it, vi } from 'vitest'
// import { toBool } from '../../utils'

const toBool = (bool) => {
    if (bool == 'true') {
        return true
    }
    else {
        return false
    }
}

describe('toBool helper function', () => {
    it('returns false if param is undefined', () => {
        expect(toBool(undefined)).toBe(false)
    })

    it('returns false if param is empty string', () => {
        expect(toBool('')).toBe(false)
    })

    it('returns false if param is a string: false', () => {
        expect(toBool('false')).toBe(false)
    })

    it('returns false if param is a truthy', () => {
        expect(toBool('true')).toBe(true)
        expect(toBool(1)).toBe(false)
    })

    it('returns false if param is null', () => {
        expect(toBool(null)).toBe(false)
    })
    it('returns false if params is not string: true', () => {
        expect(toBool('sdfsdf')).toBe(false)

    })
})