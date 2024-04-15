import 'reflect-metadata';
import express, {Application} from 'express';

import dotenv from 'dotenv';

dotenv.config();

import bodyParser from 'body-parser';
import userRoutes from "./infrastructure/adapters/primary/rest/routes/UserRoutes";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import passport from "passport";
import session from "express-session";
import VideoRoutes from "./infrastructure/adapters/primary/rest/routes/VideoRoutes";
import ChannelRoutes from "./infrastructure/adapters/primary/rest/routes/ChannelRoutes";
import BroadcasterRoutes from "./infrastructure/adapters/primary/rest/routes/BroadcasterRoutes";
import AuthRoutes from './infrastructure/adapters/primary/rest/routes/AuthRoutes';
import PostRoutes from './infrastructure/adapters/primary/rest/routes/PostRoutes';
import UserV2Routes from './infrastructure/adapters/primary/rest/routes/UserV2Routes';
import fs from "fs";
import path from "node:path";
import * as https from "https";
import {expressMiddleware} from "@apollo/server/express4";
import {ApolloServer} from "@apollo/server";
import {typeDefs} from "./infrastructure/adapters/primary/graphql/typeDefs";
import {resolvers} from "./infrastructure/adapters/primary/graphql/resolvers";

const app: Application = express() as Application;
const PORT = process.env.PORT || 8080;


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de ejemplo con Swagger',
      version: '1.0.0',
      description: 'Una API de ejemplo para demostrar Swagger en Express con TypeScript',
    },
  },
  apis: ['./src/infrastructure/adapters/primary/rest/swagger/**.ts'],
};



const swaggerSpec = swaggerJsdoc(options);

startApolloServer(typeDefs, resolvers);


app.use(session({
  secret: 'secret_session_value',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/public/images', express.static('public/images'));

app.use(bodyParser.json());

//app.use("/api", userRoutes);
app.use('/api/auth', AuthRoutes());
app.use('/api/v2/videos', VideoRoutes());
app.use('/api/v2/channels', ChannelRoutes());
app.use('/api/v2/broadcasters', BroadcasterRoutes());
app.use('/api/v2/posts', PostRoutes());
app.use('/api/v2/users', UserV2Routes());

app.use(passport.initialize());
app.use(passport.session());





async function startApolloServer(typeDefs: any, resolvers: any) {

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Usar expressMiddleware para aplicar el servidor Apollo a la aplicación Express
  app.use(
      '/graphql', // Asegúrate de que la ruta coincide con las expectativas de tu cliente GraphQL
      expressMiddleware(server, {
        context: async ({ req }) => ({
          // Aquí puedes agregar datos al context que serán utilizados por tus resolvers
        }),
      }),
  );

}


app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});