const snakecasejs = require('./plugin.js');

module.exports = {
    plugins: {
      snakecasejs: snakecasejs,
    },
    rules: {
      'snakecasejs/snakecasejs': 'error',
    },
  };