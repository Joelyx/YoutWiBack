"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const userRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/userRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const AuthRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/AuthRoutes"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
app.use((0, express_session_1.default)({
    secret: 'moiseshijodelagranputa', // Una clave secreta para firmar la cookie de sesión
    resave: false, // No guarda la sesión si no se modificó
    saveUninitialized: false, // No crea una sesión hasta que algo se almacena
    cookie: { secure: false } // True para https. Si estás desarrollando localmente, probablemente quieras false
}));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use(body_parser_1.default.json());
app.use("/api", userRoutes_1.default);
app.use('/api/auth', (0, AuthRoutes_1.default)());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
