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

const clients = new Map<string, Client>(); // Key is now userId

const wss = new WebSocketServer({ noServer: true });

const supportMessageService = myContainer.get<SupportMessageDomainService>(Types.ISupportMessageDomainService);
const userService = myContainer.get<UserDomainService>(Types.IUserDomainService);

function broadcastUserList(): void {
    const users = Array.from(clients.values()).map(client => ({ name: client.username, userId: client.userId }));
    clients.forEach(client => {
        client.ws.send(JSON.stringify({ type: 'usersList', users }));
    });
}

function sendToAdmins(message: object, excludeUserId?: string): void {
    const adminMessage = JSON.stringify(message);
    clients.forEach(client => {
        if (client.username === 'admin' && client.userId !== excludeUserId) {
            client.ws.send(adminMessage);
        }
    });
}

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    const params = new url.URL(req.url!, `http://${req.headers.host}`).searchParams;
    const token = req.headers['authorization']?.split(' ')[1] ?? params.get('token') ?? "";
    let userId: string;
    verifyWebSocketToken(token, ws, (err, decoded) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            ws.close(4001, 'Invalid token');
            return;
        }

        const username = decoded?.username;
        userId = decoded?.userId;

        if (username && userId) {
            const existingClient = clients.get(userId);
            if (existingClient) {
                console.log(`Duplicate connection attempt detected for user ${username}. Closing existing connection.`);
                existingClient.ws.close(4001, 'New connection established');
            }

            clients.set(userId, { ws, username, userId });
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
                const sender = clients.get(userId);
                if (!sender) {
                    console.log("Sender not found or not registered.");
                    return;
                }

                const isMessageToAdmin = msg.to === 'admin';
                let supportMessage = new SupportMessage();
                if(isMessageToAdmin) {
                    supportMessage.userId = parseInt(sender.userId);
                }else{
                    console.log("Message to user: "+msg.to)
                    const byUsername = await userService.findByUsername(msg.to);
                    if (byUsername) {
                        supportMessage.userId = parseInt(byUsername.getId+"");
                    }

                }

                supportMessage.message = msg.content;
                supportMessage.createdAt = new Date();
                supportMessage.isFromSupport = !isMessageToAdmin;

                await supportMessageService.save(supportMessage);

                if (isMessageToAdmin) {
                    sendToAdmins(supportMessage);
                } else {
                    const recipient = clients.get(msg.to);
                    if (recipient) {
                        recipient.ws.send(JSON.stringify({ type: 'directMessage', from: sender.username, content: msg.content }));
                    } else {
                        console.log(`Recipient ${msg.to} not found.`);
                    }
                }
            }
        } catch (error) {
            console.error('Message handling error:', error);
            ws.send(JSON.stringify({ error: 'Error processing your message.' }));
        }
    });

    ws.on('close', () => {
        clients.delete(userId);
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
