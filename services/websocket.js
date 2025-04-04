import { WebSocketServer as Ws } from "ws";

export class WebSocketServer {
    constructor({ server }) {
        this.websocket = new Ws({ server: server })
        this.supervisors = {}
        this.supervisorConnections = {}
        this.internConnections = {}
        this.interns = {}
    }
}
