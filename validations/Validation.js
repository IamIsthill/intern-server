export class Validation {
    constructor(joi, unvalidatedData) {
        this.joi = joi
        this.unvalidatedData = unvalidatedData
    }

    validate() {
        const { error, value } = this.joi.validate(this.unvalidatedData)

        this._checkError(error)

        return value
    }

    _checkError(error) {
        if (error) {
            const messages = error.details.map(detail => detail.message)
            throw new ValidationError(messages.join('\n'))
        }
    }

}

class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = "ValidationError"
        this.statusCode = 400
    }

    setStatusCode(statusCode) {
        this.statusCode = statusCode
    }
}