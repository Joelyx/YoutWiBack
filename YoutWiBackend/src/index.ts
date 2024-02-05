import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import bodyParser from 'body-parser';
import userRoutes from "./infrastructure/adapters/primary/rest/userRoutes";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import AuthRoutes from "./infrastructure/adapters/primary/rest/AuthRoutes";
import passport from "passport";
import session from "express-session";






const app = express();
const PORT = 3000;


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de ejemplo con Swagger',
      version: '1.0.0',
      description: 'Una API de ejemplo para demostrar Swagger en Express con TypeScript',
    },
  },
  apis: ['./src/infrastructure/adapters/primary/rest/*.ts'], // Rutas a los archivos donde Swagger JSDoc buscará comentarios para generar la documentación
};

const swaggerSpec = swaggerJsdoc(options);


app.use(session({
  secret: 'moiseshijodelagranputa', // Una clave secreta para firmar la cookie de sesión
  resave: false, // No guarda la sesión si no se modificó
  saveUninitialized: false, // No crea una sesión hasta que algo se almacena
  cookie: { secure: false } // True para https. Si estás desarrollando localmente, probablemente quieras false
}));



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(bodyParser.json());


app.use("/api", userRoutes);
app.use('/api/auth', AuthRoutes());
app.use(passport.initialize());
app.use(passport.session());



app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});