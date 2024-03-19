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
const UserRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/UserRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const VideoRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/VideoRoutes"));
const ChannelRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/ChannelRoutes"));
const BroadcasterRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/BroadcasterRoutes"));
const AuthRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/AuthRoutes"));
const PostRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/PostRoutes"));
const UserV2Routes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/UserV2Routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080; // Cambiado para usar el puerto 80 por defecto para HTTP
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
app.use((0, express_session_1.default)({
    secret: 'secret_session_value',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true } // Cambiado a true para HTTPS
}));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use(express_1.default.json({ limit: '50mb' }));
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
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
