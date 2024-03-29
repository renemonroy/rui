'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

require('babel/polyfill');

var webpack = require('webpack');
var path = require('path');

var loaders = ['babel'];
var port = process.env.PORT || 3000;

var devtool;
var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

var entry = {
  'example0-cards': './examples/example0-cards/index.jsx',
};

if (process.env.NODE_ENV === 'development') {
  devtool = 'eval-source-map';
  loaders = ['react-hot'].concat(loaders);
  plugins = plugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ]);
  entry = Object.keys(entry).reduce( function(result, key) {
    result[key] = [
      'webpack-dev-server/client?http:0.0.0.0:' + port,
      'webpack/hot/only-dev-server',
      entry[key]
    ];
    return result;
  }, {});
} else {
  devtool = 'source-map';
  plugins = plugins.concat([
    new webpack.optimize.OccurenceOrderPlugin()
  ]);
}

module.exports = {
  devtool: devtool,
  entry: entry,
  output: {
    filename: '[name]/all.js',
    publicPath: '/examples/',
    path: __dirname + '/examples/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /build|lib|bower_components|node_modules/,
        loaders: loaders,
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      }
    ],
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        exclude: /build|lib|bower_components|node_modules/,
      }
    ],
    noParse: [
      path.join(__dirname, 'node_modules', 'babel-core', 'browser.min.js')
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: plugins,
};
