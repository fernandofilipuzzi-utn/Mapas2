

# Google Maps TypeScript Example con Geocoding

Este proyecto es una implementación avanzada de Google Maps con TypeScript, que incluye funcionalidades de geocodificación y búsqueda de direcciones. Utiliza webpack para el bundling y maneja las variables de entorno de forma segura.

## Prerequisitos

- Node.js (versión 14 o superior)
- Una API key de Google Maps (obtener en [Google Cloud Console](https://console.cloud.google.com))

## Guía de Instalación Paso a Paso

1. Crear el directorio del proyecto y navegar a él:
```bash
mkdir Ejemplo2
cd Ejemplo2
```

2. Inicializar el proyecto NPM:
```bash
npm init -y
```

3. Instalar las dependencias necesarias:
```bash
# Dependencias de desarrollo
npm install --save-dev typescript ts-loader webpack webpack-cli webpack-dev-server html-webpack-plugin @types/google.maps copy-webpack-plugin dotenv-webpack

# Dependencias de producción
npm install @googlemaps/js-api-loader
```

4. Crear archivo `.env.example` y `.env`:
```bash
# Crear .env.example
echo "GOOGLE_MAPS_API_KEY=your_api_key_here" > .env.example

# Crear .env (reemplazar con tu API key real)
echo "GOOGLE_MAPS_API_KEY=your_actual_api_key" > .env
```

5. Crear archivo `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "es6",
    "lib": ["es6", "dom"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "moduleResolution": "node"
  }
}
```

6. Crear archivo `webpack.config.js`:
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: ['./src/index.ts', './src/page.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: ''
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
      template: './src/index.html'
    }),
    new Dotenv()
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

7. Crear la estructura de directorios y archivos del proyecto:
```bash
mkdir src
touch src/index.html src/index.ts src/page.js
```

8. Crear `src/index.html` básico:
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

9. Actualizar `package.json` con los scripts:
```json
{
  "scripts": {
    "build": "webpack --mode production",
    "start": "webpack serve --mode development --open",
    "dev": "webpack serve --mode development --open"
  }
}
```

## Estructura del Proyecto
```
.
├── .env                    # Variables de entorno (no subir a git)
├── .env.example           # Ejemplo de variables de entorno necesarias
├── .gitignore            # Configuración de archivos ignorados por git
├── package.json          # Configuración de npm y dependencias
├── tsconfig.json        # Configuración de TypeScript
├── webpack.config.js    # Configuración de webpack
└── src/
    ├── index.html      # Plantilla HTML
    ├── index.ts       # Código TypeScript principal
    └── page.js       # Código JavaScript adicional
```

## Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start
# o
npm run dev

# Construir para producción
npm run build
```

## Desarrollo

Para desarrollo local:
```bash
npm start
```
El servidor de desarrollo se iniciará en `http://localhost:8080`

## Producción

Para construir la versión de producción:
```bash
npm run build
```
Los archivos generados se encontrarán en la carpeta `dist/`

## Solución de Problemas Comunes

1. Error "process is not defined":
   - Verifica que el archivo `.env` existe
   - Asegúrate de que la clave `GOOGLE_MAPS_API_KEY` está definida
   - Reconstruye el proyecto con `npm run build`

2. Error al cargar el mapa:
   - Verifica que tu API key de Google Maps es válida
   - Asegúrate de que la API de Maps JavaScript está habilitada en tu proyecto de Google Cloud

## Notas Importantes

- Asegúrate de incluir `.env` en tu `.gitignore` para no exponer tu API key
- El servidor de desarrollo incluye un proxy para las solicitudes a la API de Google Maps
- La configuración está optimizada para producción con minificación de código
- Se incluye soporte para TypeScript y JavaScript en el mismo proyecto