'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var webpack = require('webpack');
var path = require('path');

var config = {
  devtool: 'sourcemap',
  entry: {
    index: './src/index.jsx',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'rui.js',
    sourceMapFilename: 'rui.map',
    library: 'RUI',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)/,
      loader: 'babel',
    }],
  },
  plugins: [],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  },
};

module.exports = config;
