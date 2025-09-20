# Google Maps TypeScript con UMD Bundle

Este proyecto demuestra cómo crear una biblioteca JavaScript modular para Google Maps usando TypeScript y Webpack, siguiendo el patrón UMD (Universal Module Definition) similar a bibliotecas como Quill.js.

## Características

- Wrapper de Google Maps con TypeScript
- Bundling con Webpack en formato UMD
- Geocodificación de direcciones
- Selector de localidades
- Búsqueda por calle y número
- Manejo de coordenadas y eventos del marcador
- Estilo similar a Quill.js para su uso

## Prerequisitos

- Node.js (versión 14 o superior)
- NPM (versión 6 o superior)
- API Key de Google Maps

## Instalación Paso a Paso

1. Crear el directorio del proyecto:
```bash
mkdir ejemplo4
cd ejemplo4
```

2. Inicializar el proyecto NPM:
```bash
npm init -y
```

3. Instalar las dependencias:
```bash
# Dependencias de producción
npm install @googlemaps/js-api-loader

# Dependencias de desarrollo
npm install --save-dev typescript webpack webpack-cli ts-loader
npm install --save-dev @types/google.maps html-webpack-plugin dotenv-webpack
```

4. Crear la estructura de archivos:
```
ejemplo4/
├── src/
│   ├── index.html
│   └── index.ts
├── .env
├── package.json
├── tsconfig.json
└── webpack.config.js
```

5. Configurar TypeScript (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "es6",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "moduleResolution": "node",
    "declaration": true,
    "lib": ["es6", "dom"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

6. Configurar Webpack (`webpack.config.js`):
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
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
      template: './src/index.html'
    }),
    new Dotenv()
  ]
};
```

7. Configurar scripts en `package.json`:
```json
{
  "scripts": {
    "build": "webpack --mode production",
    "start": "webpack serve --mode development --open"
  }
}
```

## Uso

### Instalación en tu proyecto

1. Copiar el archivo `googlemaps.min.js` generado a tu proyecto
2. Incluir el script en tu HTML:
```html
<script src="googlemaps.min.js"></script>
```

### Inicialización Básica

```html
<div id="map"></div>
<script>
    const maps = new GoogleMapsService('map', {
        apiKey: 'TU_API_KEY_AQUI',
        zoom: 13
    });
</script>
```

### API Disponible

```javascript
// Inicialización con opciones
const maps = new GoogleMapsService('map', {
    apiKey: 'TU_API_KEY',
    zoom: 13,
    center: { lat: -34.6037, lng: -58.3816 }
});

// Geocodificar dirección
maps.geocodeAddress('Av. 9 de Julio 1000, Buenos Aires');

// Obtener coordenadas actuales
const position = maps.getCurrentPosition();
console.log(position.lat, position.lng);

// Escuchar cambios de posición
maps.onPositionChanged((lat, lng) => {
    console.log('Nueva posición:', lat, lng);
});
```

## Desarrollo

### Servidor de desarrollo

```bash
npm start
```
Se abrirá automáticamente en http://localhost:8080

### Construir para producción

```bash
npm run build
```
Generará los archivos en la carpeta `dist/`

## Estructura del Código

- `src/index.ts`: Clase principal GoogleMapsService
- `src/index.html`: Template de ejemplo
- `webpack.config.js`: Configuración de build
- `tsconfig.json`: Configuración de TypeScript

## Notas Importantes

1. Seguridad del API Key:
   - No incluir el API Key en el código fuente
   - Usar variables de entorno o inyección en runtime
   - Configurar restricciones de dominio en Google Cloud Console

2. Compatibilidad:
   - El bundle generado es compatible con ES5
   - Funciona en navegadores modernos
   - Soporta diferentes formas de importación (UMD)

## Solución de Problemas

1. Error "API Key is required":
   - Verificar que se pasa el apiKey en las opciones de inicialización
   - Comprobar que el API Key es válido

2. Mapa no se muestra:
   - Verificar que el contenedor tiene dimensiones definidas
   - Comprobar la consola del navegador por errores
   - Verificar que el API Key tiene los servicios necesarios habilitados

## Contribuir

1. Fork el repositorio
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Crear un Pull Request
