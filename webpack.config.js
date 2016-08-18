var webpack = require('webpack');
var envIsDev = process.env && process.env.NODE_ENV == 'development';

var getEntry = function() {
  var entry = [];
  if ( envIsDev ) {
    entry.push(
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server'
    );
  }
  entry.push('./src/scripts/index.jsx');
  return entry;
};

module.exports = {

  entry : getEntry(),

  output : {
    path : __dirname + '/dist',
    publicPath : '/',
    filename : 'bundle.js'
  },

  devServer : {
    contentBase : './dist',
    hot : true
  },

  module : {
    loaders : [
      {
        test : /\.jsx?$/,
        exclude : /node_modules/,
        loader : envIsDev ? 'babel' : 'react-hot!babel'
      },
      {
        test : /\.styl$/,
        loader : 'style-loader!css-loader!stylus-loader'
      },
      {
        test : /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader : 'url-loader?limit=100000'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'file-loader?name=images/[name].[ext]'
      },
    ]
  },

  resolve : {
    extensions : ['', '.js', '.jsx']
  },

  plugins : [
    new webpack.HotModuleReplacementPlugin(),
  ],

};
