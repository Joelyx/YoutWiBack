import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import url from 'url';
import { SupportMessage } from "../../../../domain/models/SupportMessage";
import { verifyWebSocketToken } from "../../../../middleware/AuthMiddleware";
import { SupportMessageDomainService } from "../../../../domain/services/SupportMessageDomainService";
import { myContainer } from "../../../config/inversify.config";
import { Types } from "../../../config/Types";
import { UserDomainService } from "../../../../domain/services/UserDomainService";

interface Client {
    ws: WebSocket;
    username: string;
    userId: string;
}

const clients = new Map<WebSocket, Client>();

const wss = new WebSocketServer({ noServer: true });

const supportMessageService = myContainer.get<SupportMessageDomainService>(Types.ISupportMessageDomainService);
const userService = myContainer.get<UserDomainService>(Types.IUserDomainService);

function broadcastUserList(): void {
    const users = Array.from(clients.values()).map(client => ({ name: client.username, userId: client.userId }));
    clients.forEach(client => {
        client.ws.send(JSON.stringify({ type: 'usersList', users }));
    });
}

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    const params = new url.URL(req.url!, `http://${req.headers.host}`).searchParams;
    const token = req.headers['authorization']?.split(' ')[1] ?? params.get('token') ?? "";
    verifyWebSocketToken(token, ws, (err, decoded) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            ws.close(4001, 'Invalid token');
            return;
        }

        const username = decoded?.username;
        const userId = decoded?.userId;

        if (username && userId) {
            clients.set(ws, { ws, username, userId });
            console.log(`Authenticated connection: ${username}`);
            broadcastUserList();
        } else {
            ws.close(4003, 'Invalid token data');
        }
    });

    ws.on('message', async (message: string) => {
        try {
            const msg = JSON.parse(message);
            if (msg.type === "directMessage" && msg.to && msg.content) {
                const sender = clients.get(ws);
                if (!sender) {
                    return;
                }

                const recipient = [...clients.values()].find(client => client.userId === msg.to);

                let supportMessage = new SupportMessage();
                supportMessage.userId = recipient ? parseInt(recipient.userId) : parseInt(sender.userId);
                supportMessage.message = msg.content;
                supportMessage.createdAt = new Date();
                supportMessage.isFromSupport = sender.username === 'admin';

                await supportMessageService.save(supportMessage);

                if (recipient) {
                    recipient.ws.send(JSON.stringify(supportMessage));
                } else {
                    console.log(`Recipient ${msg.to} is not online. Message saved.`);
                }
            }
        } catch (error) {
            console.error('Message handling error:', error);
            ws.send(JSON.stringify({ error: 'Error processing your message.' }));
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        broadcastUserList();
    });
});

export const setupWebSocket = (server: http.Server) => {
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
};
