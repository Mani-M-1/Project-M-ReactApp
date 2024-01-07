const env = process.env.REACT_APP_NODE_ENV || 'development';
console.log(process.env.REACT_APP_NODE_ENV);

let config;
switch (env) {
  case 'production':
    config = require('./config.prod');
    break;
  case 'staging':
    config = require('./config.staging');
    break;
  default:
    config = require('./config.dev');
}

console.log('Config:', config);

export default config;
