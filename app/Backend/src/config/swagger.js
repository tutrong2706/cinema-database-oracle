import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🎬 Cinema Booking API',
      version: '1.0.0',
      description: 'API Documentation for Cinema Database Management System',
      contact: {
        name: 'Cinema Team',
        email: 'admin@cinema.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3069/api',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);
export default specs;
