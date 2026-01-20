import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Board Game API',
            version: '1.0.0',
            description: 'API documentation for Board Game Project',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        servers: [
            {
                url: 'https://web-boardgame.onrender.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Bearer "your token"',
                },
                apiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                    description: 'Enter this API key (web-client-key)',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                        username: { type: 'string', example: 'johndoe' },
                        first_name: { type: 'string', example: 'John' },
                        last_name: { type: 'string', example: 'Doe' },
                        role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
                        state: { type: 'string', enum: ['active', 'blocked'], example: 'active' },
                        avatar_url: { type: 'string', nullable: true, example: null },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                Game: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Tic Tac Toe' },
                        slug: { type: 'string', example: 'tic-tac-toe' },
                        description: { type: 'string', example: 'Classic game of X and O' },
                        image_url: { type: 'string', nullable: true },
                        enabled: { type: 'boolean', example: true },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                Achievement: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'First Victory' },
                        description: { type: 'string', example: 'Win your first game' },
                        icon_url: { type: 'string', nullable: true },
                        game_slug: { type: 'string', nullable: true, example: 'tic-tac-toe' },
                        earned: { type: 'boolean', example: true },
                        earned_at: { type: 'string', format: 'date-time', nullable: true },
                    },
                },
                GameStats: {
                    type: 'object',
                    properties: {
                        total_wins: { type: 'integer', example: 10 },
                        total_plays: { type: 'integer', example: 25 },
                        best_score: { type: 'integer', example: 500 },
                        total_score: { type: 'integer', example: 2500 },
                        best_time_seconds: { type: 'integer', nullable: true, example: 120 },
                    },
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        total: { type: 'integer', example: 100 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        totalPages: { type: 'integer', example: 10 },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Error message description' },
                    },
                },
                SuccessMessage: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Operation successful' },
                    },
                },
            },
        },
    },
    apis: ['./src/docs/*.js', './src/app.js'], // Files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
