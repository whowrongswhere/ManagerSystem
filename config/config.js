var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'managersystem'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/managerDbDev'
  },

  test: {
    root: rootPath,
    app: {
      name: 'managersystem'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/managerDbTest'
  },

  production: {
    root: rootPath,
    app: {
      name: 'managersystem'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/managerDbPro'
  }
};

module.exports = config[env];
