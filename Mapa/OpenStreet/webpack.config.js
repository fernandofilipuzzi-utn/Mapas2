const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'googlemaps.min.js',
    library: {
      name: 'GoogleMapsService',
      type: 'umd',
      export: 'default'
    }
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/domicilio.html',
      filename: 'domicilio.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/inicializacion.html',
      filename: 'inicializacion.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/zonas.html',
      filename: 'zonas.html'
    }),
    new Dotenv()
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'docs')
    },
    compress: true,
    port: 8080,
    historyApiFallback: true,
    open: true
  }
};
