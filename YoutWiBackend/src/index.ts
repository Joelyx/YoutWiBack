import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';

dotenv.config();

import bodyParser from 'body-parser';
import userRoutes from "./infrastructure/adapters/primary/rest/routes/UserRoutes";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import AuthRoutes from "./infrastructure/adapters/primary/rest/routes/AuthRoutes";
import passport from "passport";
import session from "express-session";
import VideoRoutes from "./infrastructure/adapters/primary/rest/routes/VideoRoutes";
import ChannelRoutes from "./infrastructure/adapters/primary/rest/routes/ChannelRoutes";
import BroadcasterRoutes from "./infrastructure/adapters/primary/rest/routes/BroadcasterRoutes";
import PostRoutes from "./infrastructure/adapters/primary/rest/routes/PostRoutes";
import path from "node:path";





const app = express();
const PORT = process.env.PORT || 443;

const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '../server.key')), // Ajusta la ruta
  cert: fs.readFileSync(path.resolve(__dirname, '../server.cert')), // Ajusta la ruta
  // Puedes necesitar también especificar la CA intermedia, dependiendo de tu certificado
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de ejemplo con Swagger',
      version: '1.0.0',
      description: 'Una API de ejemplo para demostrar Swagger en Express con TypeScript',
    },
  },
  apis: ['./src/infrastructure/adapters/primary/rest/swagger/**.ts'], // Rutas a los archivos donde Swagger JSDoc buscará comentarios para generar la documentación
};

const swaggerSpec = swaggerJsdoc(options);


app.use(session({
  secret: 'moiseshijodelagranputa', // Una clave secreta para firmar la cookie de sesión
  resave: false, // No guarda la sesión si no se modificó
  saveUninitialized: false, // No crea una sesión hasta que algo se almacena
  cookie: { secure: false } // True para https. Si estás desarrollando localmente, probablemente quieras false
}));



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json({ limit: '50mb' })); // Aumenta el límite a 50MB, ajusta según tus necesidades
app.use(express.urlencoded({ extended: true }));


app.use(bodyParser.json());


app.use("/api", userRoutes);
app.use('/api/auth', AuthRoutes());
app.use('/api/v2/videos', VideoRoutes());
app.use('/api/v2/channels', ChannelRoutes());
app.use('/api/v2/broadcasters', BroadcasterRoutes());
app.use('/api/v2/posts', PostRoutes());



app.use(passport.initialize());
app.use(passport.session());




https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});