/*
*
*/
const path                        = require('path')    ;
const webpack                     = require("webpack") ;
//
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '../lib'),
    library: 'exchange-rate-dolarhoy',
    libraryTarget: 'umd'
  },
  module:{
	   rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot|otf)([\?]?.*)$/,
        loader: 'file-loader?name=/[name].[ext]',
     },
     {
      test: /\.(jpg|jpeg|png)$/,
      use: {
       loader: 'url-loader'
      }
     }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx','.css'],
    modules: [ path.join(__dirname,'../node_modules') ]
  },
  resolveLoader: {
    modules: [ path.join(__dirname,'../node_modules') ]
  },
  plugins: [],
  target: 'node',
  node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      global: true,
      crypto: "empty",
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
  }
};
//