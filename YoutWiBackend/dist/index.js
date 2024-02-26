"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const UserRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/UserRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const VideoRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/VideoRoutes"));
const ChannelRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/ChannelRoutes"));
const BroadcasterRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/BroadcasterRoutes"));
const node_path_1 = __importDefault(require("node:path"));
const AuthRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/AuthRoutes"));
const PostRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/PostRoutes"));
const UserV2Routes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/UserV2Routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 443;
const httpsOptions = {
    key: fs_1.default.readFileSync(node_path_1.default.resolve(__dirname, '../server.key')), // Ajusta la ruta
    cert: fs_1.default.readFileSync(node_path_1.default.resolve(__dirname, '../server.cert')), // Ajusta la ruta
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
app.use((0, express_session_1.default)({
    secret: 'moiseshijodelagranputa', // Una clave secreta para firmar la cookie de sesión
    resave: false, // No guarda la sesión si no se modificó
    saveUninitialized: false, // No crea una sesión hasta que algo se almacena
    cookie: { secure: false } // True para https. Si estás desarrollando localmente, probablemente quieras false
}));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use(express_1.default.json({ limit: '50mb' })); // Aumenta el límite a 50MB, ajusta según tus necesidades
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/public/images', express_1.default.static('public/images'));
app.use(body_parser_1.default.json());
app.use("/api", UserRoutes_1.default);
app.use('/api/auth', (0, AuthRoutes_1.default)());
app.use('/api/v2/videos', (0, VideoRoutes_1.default)());
app.use('/api/v2/channels', (0, ChannelRoutes_1.default)());
app.use('/api/v2/broadcasters', (0, BroadcasterRoutes_1.default)());
app.use('/api/v2/posts', (0, PostRoutes_1.default)());
app.use('/api/v2/users', (0, UserV2Routes_1.default)());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
https_1.default.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
