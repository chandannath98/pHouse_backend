const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Password Manager API",
      version: "1.0.0",
      description: "API documentation for the Password Manager system",
    },
    servers: [
      {
        url: "http://localhost:5000", // Change this to your production URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Scan all route files for Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
