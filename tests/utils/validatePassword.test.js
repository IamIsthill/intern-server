import { describe, it, expect, vi } from "vitest";
import { validatePassword } from "../../utils/validatePassword.js";

describe('validate password util tests', () => {
    it('throws an error if an empty password was passed', () => {
        expect(() => validatePassword('')).toThrow('Password must not be empty')
    })
    it('throws an error if an password was less than 8', () => {
        expect(() => validatePassword('1234567')).toThrow('Password must have a minimum of 8 characters')
    })
    it('throws an error if password is does not contain lowercase', () => {
        expect(() => validatePassword('12345678')).toThrow('Password must have atleast one lowercase letter')
    })
    it('throws an error if password is does not contain uppercase', () => {
        expect(() => validatePassword('nouppercase')).toThrow('Password must have atleast one uppercase letter')
    })
    it('throws an error if password is does not contain digits', () => {
        expect(() => validatePassword('no digits But has uppercase')).toThrow('Password must have atleast one number')
    })
    it('no error if password is valid', () => {
        expect(() => validatePassword('aValidpasword1234')).not.toThrow()
    })
})