import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'Documentation for my Express API',
  },
  servers: [
    {
      url: 'https://be-project-reactjs.vercel.app/api/v1',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routers/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec
