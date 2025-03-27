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
            throw new ValidationError(error.details[0].message)
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