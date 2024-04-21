import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

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
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: ['**/*.yaml'],
};

export const swaggerSpec = swaggerJsdoc(options);
