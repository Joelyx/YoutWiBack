import 'reflect-metadata';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import url from 'url';
import WebSocket, { WebSocketServer } from 'ws';
dotenv.config();

import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import passport from 'passport';
import session from 'express-session';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { setupWebSocket } from './infrastructure/adapters/primary/websocket/websocket';
import cors from 'cors';



import AuthRoutes from './infrastructure/adapters/primary/rest/routes/AuthRoutes';
import VideoRoutes from './infrastructure/adapters/primary/rest/routes/VideoRoutes';
import ChannelRoutes from './infrastructure/adapters/primary/rest/routes/ChannelRoutes';
import BroadcasterRoutes from './infrastructure/adapters/primary/rest/routes/BroadcasterRoutes';
import PostRoutes from './infrastructure/adapters/primary/rest/routes/PostRoutes';
import UserV2Routes from './infrastructure/adapters/primary/rest/routes/UserV2Routes';
import SupportRoutes from './infrastructure/adapters/primary/rest/routes/SupportMessageRoutes';
import SupportV3Routes from './infrastructure/adapters/primary/rest/routes/SupportMessageV3Routes';


import { userTypeDefs } from './infrastructure/adapters/primary/graphql/schemas/userTypeDefs';
import { postTypeDefs } from './infrastructure/adapters/primary/graphql/schemas/postTypeDefs';
import { videoTypeDefs } from './infrastructure/adapters/primary/graphql/schemas/videoTypeDefs';

import userResolvers from './infrastructure/adapters/primary/graphql/resolvers/userResolvers';
import postResolvers from './infrastructure/adapters/primary/graphql/resolvers/postResolvers';
import videoResolvers from './infrastructure/adapters/primary/graphql/resolvers/videoResolvers';
import {verifyAdminToken} from "./middleware/AuthMiddleware";
import {swaggerSpec} from "./config/swagger/swagger";


const app: Application = express();
const PORT: number | string = process.env.PORT || 8080;
const httpServer = http.createServer(app);

// Configuración de WebSocket
interface Client {
  ws: WebSocket;
  name: string;
}
const clients = new Map<WebSocket, string>();


setupWebSocket(httpServer);





app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_session_value',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/public/images', express.static('public/images'));

app.use('/api/auth', AuthRoutes());
app.use('/api/v2/videos', VideoRoutes());
app.use('/api/v2/channels', ChannelRoutes());
app.use('/api/v2/broadcasters', BroadcasterRoutes());
app.use('/api/v2/posts', PostRoutes());
app.use('/api/v2/users', UserV2Routes());
app.use('/api/v2/support', SupportRoutes());
app.use('/api/v3/support', SupportV3Routes());

app.use(passport.initialize());
app.use(passport.session());

const combinedTypeDefs = mergeTypeDefs([userTypeDefs, postTypeDefs, videoTypeDefs]);
const combinedResolvers = mergeResolvers([userResolvers, postResolvers, videoResolvers]);



async function startApolloServer(typeDefs: any, resolvers: any) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
      '/graphql',
      verifyAdminToken,
      expressMiddleware(server, {
        context: async ({ req }) => ({
          // Context setup here
        }),
      }),
  );
}


startApolloServer(combinedTypeDefs, combinedResolvers).then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}).catch(error => {
  console.error("Failed to start the Apollo Server", error);
});