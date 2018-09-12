const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    devtool: '#source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        library: 'entryPoint',
        filename: 'bundle.js',
    },
};
