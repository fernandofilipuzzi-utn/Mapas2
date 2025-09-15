# Guía para Crear un Proyecto Similar a Quill

Esta guía te ayudará a crear un proyecto con una estructura similar a Quill, utilizando TypeScript, Webpack y una arquitectura modular.

## Estructura del Proyecto

```
my-project/
├── package.json
├── tsconfig.json
├── webpack.config.js
├── packages/
│   └── my-library/
│       ├── package.json
│       ├── tsconfig.json
│       ├── webpack.config.js
│       ├── src/
│       │   ├── core/
│       │   │   ├── editor.ts
│       │   │   ├── emitter.ts
│       │   │   └── selection.ts
│       │   ├── modules/
│       │   │   └── your-modules.ts
│       │   ├── themes/
│       │   │   └── default.ts
│       │   └── index.ts
│       └── test/
│           ├── unit/
│           └── e2e/
```

## Pasos para Crear el Proyecto

1. **Inicializar el proyecto principal**
```bash
mkdir my-project
cd my-project
npm init -y

# Instalar dependencias principales
npm install --save-dev typescript webpack webpack-cli @babel/core @babel/preset-typescript
```

2. **Configurar TypeScript (tsconfig.json)**
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "declaration": true,
    "outDir": "./dist"
  }
}
```

3. **Crear la estructura de carpetas**
```bash
mkdir -p packages/my-library/src/{core,modules,themes}
mkdir -p packages/my-library/test/{unit,e2e}
```

4. **Configurar el package.json de la biblioteca**
```json
{
  "name": "my-library",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch",
    "test": "vitest run"
  },
  "dependencies": {
    "eventemitter3": "^5.0.1",
    "lodash-es": "^4.17.21"
  },
  "devDependencies": {
    "@types/lodash-es": "^4.17.12",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "eslint": "^8.57.0",
    "vitest": "^3.2.4",
    "webpack": "^5.89.0"
  }
}
```

5. **Configurar Webpack (webpack.config.js)**
```javascript
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import TerserPlugin from 'terser-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'dist'),
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  optimization: {
    minimizer: [new TerserPlugin()]
  }
};
```

6. **Crear la clase base del Emitter (src/core/emitter.ts)**
```typescript
import { EventEmitter } from 'eventemitter3';

export type EmitterSource = 'user' | 'api' | 'silent';

class Emitter extends EventEmitter<string> {
  static events = {
    TEXT_CHANGE: 'text-change',
    SELECTION_CHANGE: 'selection-change',
    EDITOR_CHANGE: 'editor-change'
  } as const;

  static sources = {
    USER: 'user',
    API: 'api',
    SILENT: 'silent'
  } as const;
}

export default Emitter;
```

7. **Crear la clase principal (src/index.ts)**
```typescript
import Emitter, { EmitterSource } from './core/emitter';

class MyLibrary {
  static events = Emitter.events;
  static sources = Emitter.sources;
  static version = '1.0.0';

  private emitter: Emitter;

  constructor(container: HTMLElement, options = {}) {
    this.emitter = new Emitter();
    // Inicialización
  }

  on(event: string, handler: Function): Emitter {
    return this.emitter.on(event, handler);
  }

  off(event: string, handler: Function): Emitter {
    return this.emitter.off(event, handler);
  }
}

export default MyLibrary;
```

## Configuración de Pruebas

1. **Configurar Vitest (test/unit/vitest.config.ts)**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
```

2. **Ejemplo de prueba unitaria (test/unit/core/emitter.spec.ts)**
```typescript
import { describe, it, expect } from 'vitest';
import Emitter from '../../../src/core/emitter';

describe('Emitter', () => {
  it('should emit events', () => {
    const emitter = new Emitter();
    let called = false;
    
    emitter.on('test', () => {
      called = true;
    });
    
    emitter.emit('test');
    expect(called).toBe(true);
  });
});
```

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Construir el proyecto
npm run build

# Ejecutar pruebas
npm test

# Desarrollo con recarga automática
npm run dev
```

## Recomendaciones

1. **Organización del Código**
   - Mantén las responsabilidades separadas en módulos
   - Usa interfaces TypeScript para definir contratos claros
   - Documenta las APIs públicas

2. **Control de Versiones**
   - Usa semantic versioning (semver)
   - Mantén un CHANGELOG.md actualizado
   - Documenta los breaking changes

3. **Pruebas**
   - Escribe pruebas unitarias para cada módulo
   - Incluye pruebas e2e para flujos críticos
   - Mantén una buena cobertura de código

4. **Documentación**
   - Documenta la API pública
   - Incluye ejemplos de uso
   - Mantén un README actualizado

## Extensiones Recomendadas para VS Code

- ESLint
- Prettier
- TypeScript + JavaScript
- Jest Runner
- Git Lens
