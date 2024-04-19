"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = void 0;
const ws_1 = require("ws");
const url_1 = __importDefault(require("url"));
const SupportMessage_1 = require("../../../../domain/models/SupportMessage");
const AuthMiddleware_1 = require("../../../../middleware/AuthMiddleware");
const inversify_config_1 = require("../../../config/inversify.config");
const Types_1 = require("../../../config/Types");
const clients = new Map();
const wss = new ws_1.WebSocketServer({ noServer: true });
const supportMessageService = inversify_config_1.myContainer.get(Types_1.Types.ISupportMessageDomainService);
wss.on('connection', (ws, req) => {
    var _a, _b, _c;
    const params = new url_1.default.URL(req.url, `http://${req.headers.host}`).searchParams;
    const token = (_c = (_b = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) !== null && _b !== void 0 ? _b : params.get('token')) !== null && _c !== void 0 ? _c : "";
    (0, AuthMiddleware_1.verifyWebSocketToken)(token, ws, (err, decoded) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return;
        }
        console.log('Token verified:', decoded);
        const name = decoded === null || decoded === void 0 ? void 0 : decoded.username;
        const userId = decoded === null || decoded === void 0 ? void 0 : decoded.userId;
        if (name) {
            clients.set(ws, [name, userId]);
            console.log(`Authenticated connection: ${name}`);
            const users = Array.from(clients.values());
            clients.forEach((_, clientWs) => {
                clientWs.send(JSON.stringify({ type: 'usersList', users }));
            });
        }
        else {
            ws.close(4003, 'Name not provided in token');
        }
    });
    ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        console.log(`Message received: ${message}`);
        const msg = JSON.parse(message);
        if (msg && msg.type === "directMessage" && msg.to && msg.content) {
            const senderInfo = clients.get(ws);
            if (!senderInfo) {
                console.log("Sender not registered.");
                return;
            }
            console.log(`Sender info: ${senderInfo}`);
            console.log(`Message to: ${msg.to}`);
            console.log(`Message content: ${msg.content}`);
            const senderName = senderInfo[0];
            const senderId = senderInfo[1];
            const receiverWs = (_d = [...clients.entries()].find(([_, value]) => value[0] === msg.to)) === null || _d === void 0 ? void 0 : _d[0];
            if (receiverWs && senderName) {
                const supportMessage = new SupportMessage_1.SupportMessage();
                supportMessage.userId = parseInt(senderId);
                supportMessage.message = msg.content;
                supportMessage.createdAt = new Date();
                if (senderName === 'admin') {
                    supportMessage.isFromSupport = true;
                }
                else {
                    supportMessage.isFromSupport = false;
                }
                try {
                    yield supportMessageService.save(supportMessage);
                    console.log(`Message saved and sending from ${senderName} to ${msg.to}`);
                    receiverWs.send(JSON.stringify(supportMessage));
                }
                catch (error) {
                    console.error('Failed to save message:', error);
                }
            }
            else if (msg.to === 'admin') {
                const supportMessage = new SupportMessage_1.SupportMessage();
                supportMessage.userId = parseInt(senderId);
                supportMessage.message = msg.content;
                supportMessage.createdAt = new Date();
                if (senderName === 'admin') {
                    supportMessage.isFromSupport = true;
                }
                else {
                    supportMessage.isFromSupport = false;
                }
                try {
                    yield supportMessageService.save(supportMessage);
                }
                catch (error) {
                    console.error('Failed to save message:', error);
                }
            }
            else if (senderName === 'admin') {
                const supportMessage = new SupportMessage_1.SupportMessage();
                supportMessage.userId = parseInt(senderId);
                supportMessage.message = msg.content;
                supportMessage.createdAt = new Date();
                supportMessage.isFromSupport = true;
                try {
                    yield supportMessageService.save(supportMessage);
                }
                catch (error) {
                    console.error('Failed to save message:', error);
                }
            }
            else {
                console.log(`User ${msg.to} not found.`);
            }
        }
    }));
    ws.on('close', () => {
        clients.delete(ws);
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
