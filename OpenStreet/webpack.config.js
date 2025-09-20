const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'openstreet.min.js',
    library: {
      name: 'OpenStreetService',
      type: 'umd',
      export: 'default'
    },
    clean: true
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
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
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
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 8080,
    historyApiFallback: true,
    open: true
  }
};
