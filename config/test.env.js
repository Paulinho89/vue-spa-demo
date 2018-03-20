var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  API_LOCATION: '"http://example.dev/api/v1"',
});
