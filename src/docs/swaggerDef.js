const { version } = require('../../package.json');
require('dotenv').config();

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'node-express-boilerplate API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}/api/v1`,
    },
  ],
};

module.exports = swaggerDef;