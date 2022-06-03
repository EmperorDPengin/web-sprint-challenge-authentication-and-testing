
module.exports = {

    JWT_SECRET: process.env.JWT_SECRET || 'shh',
    HASH: process.env.HASH || 8,
    PORT: process.env.PORT || 9000,
    NODE_ENV: process.env.NODE_ENV || 'development'
  }