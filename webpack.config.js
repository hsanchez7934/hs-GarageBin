const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.(s*)css$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.js$/,
      include: [path.resolve(__dirname, 'src')],
      exclude: [path.resolve(__dirname, '/node_modules/')],
      loader: 'babel-loader'
    }]
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    extensions: ['.js', '.json', '.jsx', '.css']
  },
  watch: true
};
