var webpack = require('webpack');
var envIsDev = process.env && process.env.NODE_ENV == 'development';
var path = require('path');
var src = path.join(__dirname, 'src');

var getEntry = function() {
  var entry = [];
  // if ( envIsDev ) {
  //   entry.push(
  //     'webpack-dev-server/client?http://localhost:3000',
  //     'webpack/hot/only-dev-server'
  //   );
  // }
  entry.push(path.join(src, 'index.jsx'));
  return entry;
};

module.exports = {

  entry: getEntry(),

  output: {
    path: path.join(__dirname, envIsDev ? 'lib' : 'dist'),
    publicPath: '/',
    filename: 'rui.js',
  },

  devServer: {
    contentBase: envIsDev ? './lib' : './dist',
    hot: true,
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: envIsDev ? 'babel' : 'react-hot!babel',
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader',
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'file-loader?name=images/[name].[ext]',
      },
    ],
  },

  resolve: {
    root: src,
    extensions: ['', '.js', '.jsx'],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

};
