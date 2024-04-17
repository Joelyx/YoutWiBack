"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = void 0;
const ws_1 = require("ws");
const url_1 = __importDefault(require("url"));
const SupportMessage_1 = require("../../../../domain/models/SupportMessage");
const AuthMiddleware_1 = require("../../../../middleware/AuthMiddleware");
const clients = new Map();
const wss = new ws_1.WebSocketServer({ noServer: true });
wss.on('connection', (ws, req) => {
    var _a;
    const params = new url_1.default.URL(req.url, `http://${req.headers.host}`).searchParams;
    const token = (_a = params.get('token')) !== null && _a !== void 0 ? _a : "";
    (0, AuthMiddleware_1.verifyWebSocketToken)(token, ws, (err, decoded) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return; // El WebSocket se cierra en verifyWebSocketToken si hay un error
        }
        const name = decoded === null || decoded === void 0 ? void 0 : decoded.name; // Asumiendo que el nombre del usuario está incluido en el token
        if (name) {
            clients.set(ws, name);
            console.log(`Authenticated connection: ${name}`);
            // Enviar lista de usuarios a todos los clientes
            const users = Array.from(clients.values());
            clients.forEach((_, clientWs) => {
                clientWs.send(JSON.stringify({ type: 'usersList', users }));
            });
        }
        else {
            ws.close(4003, 'Name not provided in token');
        }
    });
    ws.on('message', (message) => {
        var _a;
        console.log(`Message received: ${message}`);
        const msg = JSON.parse(message);
        if (msg && msg.type === "directMessage" && msg.to && msg.content) {
            const senderName = clients.get(ws);
            const receiverWs = (_a = [...clients.entries()].find(([_, name]) => name === msg.to)) === null || _a === void 0 ? void 0 : _a[0];
            if (receiverWs && senderName) {
                const supportMessage = new SupportMessage_1.SupportMessage();
                supportMessage.userId = parseInt(senderName); // Asumiendo que senderName es el ID del usuario
                supportMessage.message = msg.content;
                supportMessage.createdAt = new Date();
                supportMessage.isFromSupport = false; // Cambiar según la lógica necesaria
                console.log(`Sending message from ${senderName} to ${msg.to}`);
                receiverWs.send(JSON.stringify(supportMessage));
            }
            else {
                console.log(`User ${msg.to} not found.`);
            }
        }
    });
    ws.on('close', () => {
        clients.delete(ws);
        console.log(`${name} has disconnected`);
    });
});
const setupWebSocket = (server) => {
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
};
exports.setupWebSocket = setupWebSocket;
