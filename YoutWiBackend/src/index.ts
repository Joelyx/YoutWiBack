import 'reflect-metadata';
import express from 'express';
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

const app = express();

// Configuración para HTTPS
const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '../clave.key')), // Asegúrate de proporcionar la ruta correcta a tu clave privada
  cert: fs.readFileSync(path.resolve(__dirname, '../certificado.crt')), // Asegúrate de proporcionar la ruta correcta a tu certificado
};

const PORT = process.env.PORT || 443; // Cambiado para usar el puerto 443 por defecto para HTTPS

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

app.use(session({
  secret: 'secret_session_value',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true } // Cambiado a true para HTTPS
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/public/images', express.static('public/images'));

app.use(bodyParser.json());

app.use("/api", userRoutes);
app.use('/api/auth', AuthRoutes());
app.use('/api/v2/videos', VideoRoutes());
app.use('/api/v2/channels', ChannelRoutes());
app.use('/api/v2/broadcasters', BroadcasterRoutes());
app.use('/api/v2/posts', PostRoutes());
app.use('/api/v2/users', UserV2Routes());

app.use(passport.initialize());
app.use(passport.session());

// Crear el servidor HTTPS y escuchar en el puerto especificado
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Servidor escuchando en https://youtwi-live:${PORT}`);
});
