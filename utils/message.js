export function sendMessage(connection, success = true, message = "Success") {
    const data = new Message(success, message).json()
    connection.send(data)
}

class Message {
    constructor(success = true, message = "Success") {
        this.success = success
        this.message = message
    }

    json() {
        const data = {
            success: this.success,
            message: this.message
        }

        return JSON.stringify(data)
    }
}