export function validatePassword(pass) {
    if (!pass) throw new Error('Password must not be empty')
    if (!/.{8,}/.test(pass)) throw new Error('Password must have a minimum of 8 characters')
    if (!/.*[a-z]/.test(pass)) throw new Error('Password must have atleast one lowercase letter')
    if (!/.*[A-Z]/.test(pass)) throw new Error('Password must have atleast one uppercase letter')
    if (!/.*\d/.test(pass)) throw new Error('Password must have atleast one number')
}