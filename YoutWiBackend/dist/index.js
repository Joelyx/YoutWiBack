"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = require("http");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const merge_1 = require("@graphql-tools/merge");
const socket_io_1 = require("socket.io");
// Tus rutas de REST API
const AuthRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/AuthRoutes"));
const VideoRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/VideoRoutes"));
const ChannelRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/ChannelRoutes"));
const BroadcasterRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/BroadcasterRoutes"));
const PostRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/PostRoutes"));
const UserV2Routes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/UserV2Routes"));
const SupportMessageRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/SupportMessageRoutes"));
// GraphQL typeDefs y resolvers
const userTypeDefs_1 = require("./infrastructure/adapters/primary/graphql/schemas/userTypeDefs");
const userResolvers_1 = __importDefault(require("./infrastructure/adapters/primary/graphql/resolvers/userResolvers"));
const postTypeDefs_1 = require("./infrastructure/adapters/primary/graphql/schemas/postTypeDefs");
const postResolvers_1 = __importDefault(require("./infrastructure/adapters/primary/graphql/resolvers/postResolvers"));
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8088;
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'secret_session_value',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/public/images', express_1.default.static('public/images'));
// REST API routes
app.use('/api/auth', (0, AuthRoutes_1.default)());
app.use('/api/v2/videos', (0, VideoRoutes_1.default)());
app.use('/api/v2/channels', (0, ChannelRoutes_1.default)());
app.use('/api/v2/broadcasters', (0, BroadcasterRoutes_1.default)());
app.use('/api/v2/posts', (0, PostRoutes_1.default)());
app.use('/api/v2/users', (0, UserV2Routes_1.default)());
app.use('/api/v2/support', (0, SupportMessageRoutes_1.default)());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Combining GraphQL schemas and resolvers
const combinedTypeDefs = (0, merge_1.mergeTypeDefs)([userTypeDefs_1.userTypeDefs, postTypeDefs_1.postTypeDefs]);
const combinedResolvers = (0, merge_1.mergeResolvers)([userResolvers_1.default, postResolvers_1.default]);
function startApolloServer(typeDefs, resolvers) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new server_1.ApolloServer({
            typeDefs,
            resolvers,
        });
        yield server.start();
        app.use('/graphql', (0, express4_1.expressMiddleware)(server, {
            context: (_a) => __awaiter(this, [_a], void 0, function* ({ req }) {
                return ({
                // Context setup here
                });
            }),
        }));
    });
}
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {});
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
// Starting Apollo Server with combined typeDefs and resolvers
startApolloServer(combinedTypeDefs, combinedResolvers).catch(error => {
    console.error("Failed to start the Apollo Server", error);
});
