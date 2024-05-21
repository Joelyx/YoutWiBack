"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de YoutWi',
            version: '1.0.0',
            description: 'Una API para manejar los datos de YoutWi en Express con TypeScript',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Development server'
            },
            {
                url: 'https://back.youtwi.live',
                description: 'Production server'
            }
        ],
    },
    apis: ['./src/infrastructure/adapters/primary/rest/**/*.js'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
