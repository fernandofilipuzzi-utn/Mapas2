

# Google Maps TypeScript Example

Este proyecto es un ejemplo de integración de Google Maps con TypeScript, usando webpack para el bundling y variables de entorno para manejar la API key de forma segura.

## Funcionalidades

- Muestra un mapa de Google Maps centrado en una ubicación inicial
- Permite arrastrar un marcador y obtener sus coordenadas
- Búsqueda de direcciones y localidades
- Centrado automático del mapa en la ubicación buscada

## Prerequisitos

- Node.js (versión 14 o superior)
- Una API key de Google Maps (obtener en [Google Cloud Console](https://console.cloud.google.com))

## Instalación

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

## Estructura del Proyecto
```
.
├── .env                    # Variables de entorno (no subir a git)
├── package.json           # Configuración de npm y dependencias
├── tsconfig.json         # Configuración de TypeScript
├── webpack.config.js    # Configuración de webpack
└── src/
    ├── index.html      # Plantilla HTML
    └── index.ts       # Código principal TypeScript
```

## Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Construir para producción
npm run build
```

## Configuración de webpack

El archivo `webpack.config.js` está configurado con:
- TypeScript loader (ts-loader)
- Dotenv para variables de entorno
- HTML Webpack Plugin
- Dev server con proxy para API requests

## Configuración de Variables de Entorno

1. Instalar dotenv-webpack:
```bash
npm install dotenv-webpack --save-dev
```

2. Crear archivo `.env` en la raíz del proyecto:
```
GOOGLE_MAPS_API_KEY=tu_clave_de_api_aqui
```

3. Modificar webpack.config.js para incluir Dotenv:
```javascript
const Dotenv = require('dotenv-webpack');

// En la sección de plugins:
plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html'
    }),
    new Dotenv()
]
```

## Consideraciones de Seguridad

- La API key de Google Maps debe mantenerse privada
- En producción, considerar usar un proxy server para proteger la API key
- No subir el archivo `.env` al control de versiones

## Desarrollo

Para desarrollo local:
```bash
npm start
```
El servidor de desarrollo se iniciará en `http://localhost:8080`

## Producción

Para construir para producción:
```bash
npm run build
```
Los archivos generados estarán en la carpeta `dist/`

## Requisitos

- Node.js y npm instalados
- Una clave de API de Google Maps

## Notas

- Asegúrate de tener una clave de API válida de Google Maps
- El servidor de desarrollo se ejecutará en http://localhost:8080
- El bundle generado estará en modo producción y minificado