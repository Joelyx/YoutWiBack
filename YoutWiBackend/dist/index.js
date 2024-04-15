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
const VideoRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/VideoRoutes"));
const ChannelRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/ChannelRoutes"));
const BroadcasterRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/BroadcasterRoutes"));
const AuthRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/AuthRoutes"));
const PostRoutes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/PostRoutes"));
const UserV2Routes_1 = __importDefault(require("./infrastructure/adapters/primary/rest/routes/UserV2Routes"));
const express4_1 = require("@apollo/server/express4");
const server_1 = require("@apollo/server");
const typeDefs_1 = require("./infrastructure/adapters/primary/graphql/users/typeDefs");
const resolvers_1 = require("./infrastructure/adapters/primary/graphql/users/resolvers");
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
startApolloServer(typeDefs_1.typeDefs, resolvers_1.resolvers);
app.use((0, express_session_1.default)({
    secret: 'secret_session_value',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/public/images', express_1.default.static('public/images'));
app.use(body_parser_1.default.json());
//app.use("/api", userRoutes);
app.use('/api/auth', (0, AuthRoutes_1.default)());
app.use('/api/v2/videos', (0, VideoRoutes_1.default)());
app.use('/api/v2/channels', (0, ChannelRoutes_1.default)());
app.use('/api/v2/broadcasters', (0, BroadcasterRoutes_1.default)());
app.use('/api/v2/posts', (0, PostRoutes_1.default)());
app.use('/api/v2/users', (0, UserV2Routes_1.default)());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
function startApolloServer(typeDefs, resolvers) {
    return __awaiter(this, void 0, void 0, function* () {
        // Crea una instancia de ApolloServer con tus typeDefs y resolvers
        const server = new server_1.ApolloServer({
            typeDefs,
            resolvers,
        });
        yield server.start();
        // Usar expressMiddleware para aplicar el servidor Apollo a tu aplicación Express
        app.use('/graphql', // Asegúrate de que la ruta coincide con las expectativas de tu cliente GraphQL
        (0, express4_1.expressMiddleware)(server, {
            context: (_a) => __awaiter(this, [_a], void 0, function* ({ req }) {
                return ({
                // Aquí puedes agregar datos al context que serán utilizados por tus resolvers
                });
            }),
        }));
    });
}
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
