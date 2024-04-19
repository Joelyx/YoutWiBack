import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import url from 'url';
import {SupportMessage} from "../../../../domain/models/SupportMessage";
import {verifyWebSocketToken} from "../../../../middleware/AuthMiddleware";
import {SupportMessageDomainService} from "../../../../domain/services/SupportMessageDomainService";
import {myContainer} from "../../../config/inversify.config";
import {Types} from "../../../config/Types";


interface Client {
    ws: WebSocket;
    name: string;
}

const clients = new Map<WebSocket, string[]>();

const wss = new WebSocketServer({ noServer: true });

const supportMessageService = myContainer.get<SupportMessageDomainService>(Types.ISupportMessageDomainService);


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

    ws.on('message', async (message: string) => {
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
                if (senderName === 'admin') {
                    supportMessage.isFromSupport = true;
                } else {
                    supportMessage.isFromSupport = false;
                }
                try {
                    await supportMessageService.save(supportMessage);
                    console.log(`Message saved and sending from ${senderName} to ${msg.to}`);
                    receiverWs.send(JSON.stringify(supportMessage));
                } catch (error) {
                    console.error('Failed to save message:', error);
                }
            } else if (msg.to === 'admin') {
                const supportMessage = new SupportMessage();
                supportMessage.userId = parseInt(senderId);
                supportMessage.message = msg.content;
                supportMessage.createdAt = new Date();
                if (senderName === 'admin') {
                    supportMessage.isFromSupport = true;
                } else {
                    supportMessage.isFromSupport = false;
                }
                try {
                    await supportMessageService.save(supportMessage);
                } catch (error) {
                    console.error('Failed to save message:', error);
                }
            } else if (senderName === 'admin'){
                const supportMessage = new SupportMessage();
                supportMessage.userId = parseInt(senderId);
                supportMessage.message = msg.content;
                supportMessage.createdAt = new Date();
                supportMessage.isFromSupport = true;
                try {
                    await supportMessageService.save(supportMessage);
                } catch (error) {
                    console.error('Failed to save message:', error);
                }
            }else {
                console.log(`User ${msg.to} not found.`);
            }
        }
    });


    HAY QUE HACER QUE LOS MENSAJES SE GUARDEN EN LA BASE DE DATOS A PESAR DE QUE EL ADMIN NO ESTE ONLINE. AL IGUAL QUE OCN EL USUARIO

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
