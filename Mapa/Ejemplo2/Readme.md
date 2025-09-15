

# Google Maps TypeScript Project Setup

Este proyecto es una configuración básica para trabajar con Google Maps en TypeScript usando Webpack.

## Pasos de Instalación

1. Crear el directorio del proyecto y navegar a él:
```bash
mkdir Ejemplo1
cd Ejemplo1
```

2. Inicializar el proyecto NPM:
```bash
npm init -y
```

3. Instalar las dependencias de desarrollo:
```bash
npm install --save-dev typescript ts-loader webpack webpack-cli webpack-dev-server html-webpack-plugin
```

4. Instalar las dependencias de Google Maps:
```bash
npm install @googlemaps/js-api-loader --save
npm install @types/google.maps --save-dev
```

5. Crear archivo tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "moduleResolution": "node"
  }
}
```

6. Crear archivo webpack.config.js:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  optimization: {
    minimize: true,
    nodeEnv: 'production'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 8080,
    historyApiFallback: true,
    proxy: [{
      context: ['/api'],
      target: 'https://maps.googleapis.com',
      pathRewrite: { '^/api': '' },
      secure: false,
      changeOrigin: true
    }]
  }
};
```

7. Crear la estructura de archivos del proyecto:
```
src/
  ├── index.html
  └── index.ts
```

8. Crear src/index.html:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Maps Example</title>
    <style>
        #map {
            height: 400px;
            width: 100%;
        }
    </style>
</head>
<body>
    <div id="map"></div>
</body>
</html>
```

9. Agregar scripts al package.json:
```json
{
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "start": "webpack-dev-server --config webpack.config.js --open"
  }
}
```

## Comandos disponibles

- Para construir el proyecto:
```bash
npm run build
```

- Para iniciar el servidor de desarrollo:
```bash
npm run start
```

## Requisitos

- Node.js y npm instalados
- Una clave de API de Google Maps

## Notas

- Asegúrate de tener una clave de API válida de Google Maps
- El servidor de desarrollo se ejecutará en http://localhost:8080
- El bundle generado estará en modo producción y minificado