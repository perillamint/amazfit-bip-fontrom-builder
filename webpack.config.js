const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devtool: '#inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'EntryPoint',
    filename: 'bundle.js'
  }
};
