import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';
import { initialize, testConnection } from './src/config/database.js';
import { errorHandler } from './src/middleware/authMiddleware.js';
import apiRoutes from './src/routes/index.js';
// Load environment variables
dotenv.config();
process.env.NODE_ORACLEDB_THIN_MODE = 1;

const app = express();
const PORT = process.env.PORT || 3069;

/**
 * Middleware
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Swagger Documentation
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Cinema Booking API Docs'
}));

/**
 * API Routes
 */
app.use('/api', apiRoutes);

/**
 * Default route
 */
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'Cinema Booking API is running',
        version: '1.0.0',
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

/**
 * 404 handler
 */
app.use((req, res) => {
    res.status(404).json({
        code: 404,
        message: 'Endpoint not found',
        path: req.path,
        method: req.method
    });
});

/**
 * Error handler
 */
app.use(errorHandler);

/**
 * Start server
 */
async function startServer() {
    try {
        // Test database connection
        await initialize();
        await testConnection();
        console.log('✓ Database connection verified');

        // Start Express server
        app.listen(PORT, () => {
            console.log(`✓ Server running at http://localhost:${PORT}`);
            console.log(`✓ API base: http://localhost:${PORT}/api`);
            console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();

export default app;
