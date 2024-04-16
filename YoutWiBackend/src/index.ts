import 'reflect-metadata';
import express, { Application } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import passport from 'passport';
import session from 'express-session';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { Server } from 'socket.io';

// Tus rutas de REST API
import AuthRoutes from './infrastructure/adapters/primary/rest/routes/AuthRoutes';
import VideoRoutes from './infrastructure/adapters/primary/rest/routes/VideoRoutes';
import ChannelRoutes from './infrastructure/adapters/primary/rest/routes/ChannelRoutes';
import BroadcasterRoutes from './infrastructure/adapters/primary/rest/routes/BroadcasterRoutes';
import PostRoutes from './infrastructure/adapters/primary/rest/routes/PostRoutes';
import UserV2Routes from './infrastructure/adapters/primary/rest/routes/UserV2Routes';
import SupportRoutes from './infrastructure/adapters/primary/rest/routes/SupportMessageRoutes';

// GraphQL typeDefs y resolvers
import { userTypeDefs } from './infrastructure/adapters/primary/graphql/schemas/userTypeDefs';
import userResolvers from './infrastructure/adapters/primary/graphql/resolvers/userResolvers';
import { postTypeDefs } from './infrastructure/adapters/primary/graphql/schemas/postTypeDefs';
import postResolvers from './infrastructure/adapters/primary/graphql/resolvers/postResolvers';

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de ejemplo con Swagger',
      version: '1.0.0',
      description: 'Una API de ejemplo para demostrar Swagger en Express con TypeScript',
    },
  },
  // Asegúrate de ajustar la ruta a la real ubicación de tus archivos de Swagger
  apis: ['./src/infrastructure/adapters/primary/rest/swagger/**.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

const app: Application = express();
const PORT: number | string = process.env.PORT || 8080;

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_session_value',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public/images', express.static('public/images'));

// REST API routes
app.use('/api/auth', AuthRoutes());
app.use('/api/v2/videos', VideoRoutes());
app.use('/api/v2/channels', ChannelRoutes());
app.use('/api/v2/broadcasters', BroadcasterRoutes());
app.use('/api/v2/posts', PostRoutes());
app.use('/api/v2/users', UserV2Routes());
app.use('/api/v2/support', SupportRoutes());

app.use(passport.initialize());
app.use(passport.session());

// Combining GraphQL schemas and resolvers
const combinedTypeDefs = mergeTypeDefs([userTypeDefs, postTypeDefs]);
const combinedResolvers = mergeResolvers([userResolvers, postResolvers]);

async function startApolloServer(typeDefs: any, resolvers: any) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }) => ({
          // Context setup here
        }),
      }),
  );
}

const httpServer = createServer(app);
const io = new Server(httpServer, {});

httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Starting Apollo Server with combined typeDefs and resolvers
startApolloServer(combinedTypeDefs, combinedResolvers).catch(error => {
  console.error("Failed to start the Apollo Server", error);
});