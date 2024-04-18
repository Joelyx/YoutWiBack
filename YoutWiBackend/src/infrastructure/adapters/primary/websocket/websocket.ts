import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import url from 'url';
import {SupportMessage} from "../../../../domain/models/SupportMessage";
import {verifyWebSocketToken} from "../../../../middleware/AuthMiddleware";


interface Client {
    ws: WebSocket;
    name: string;
}

const clients = new Map<WebSocket, string[]>();

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    const params = new url.URL(req.url!, `http://${req.headers.host}`).searchParams;
    const token = req.headers['authorization']?.split(' ')[1] ?? params.get('token') ?? "";
    verifyWebSocketToken(token, ws, (err, decoded) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return;
        }

        console.log('Token verified:', decoded);
        const name = decoded?.username;
        const userId = decoded?.userId;

        if (name) {
            clients.set(ws, [name, userId]);
            console.log(`Authenticated connection: ${name}`);

            const users = Array.from(clients.values());
            clients.forEach((_, clientWs) => {
                clientWs.send(JSON.stringify({ type: 'usersList', users }));
            });
        } else {
            ws.close(4003, 'Name not provided in token');
        }
    });

    ws.on('message', (message: string) => {
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

            const receiverWs = [...clients.entries()].find(
                ([_, value]) => value[0] === msg.to
            )?.[0];

            if (receiverWs && senderName) {
                const supportMessage = new SupportMessage();
                supportMessage.userId = parseInt(senderId);
                supportMessage.message = msg.content;
                supportMessage.createdAt = new Date();
                if(senderName === 'admin') {
                    supportMessage.isFromSupport = true;
                }else {
                    supportMessage.isFromSupport = false;
                }
                console.log(`Sending message from ${senderName} to ${msg.to}`);
                receiverWs.send(JSON.stringify(supportMessage));
            } else {
                console.log(`User ${msg.to} not found.`);
            }
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

export const setupWebSocket = (server: http.Server) => {
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
};
