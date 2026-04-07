# TOOLS.md

Herramientas recomendadas para levantar, depurar y mantener CashIn Frontend.

## 1) CLI y Entorno

### 1.1 Requisitos base
- Node.js LTS (recomendado 20+)
- npm 10+
- Expo CLI via npx

### 1.2 Comandos clave de desarrollo

```bash
# instalar dependencias
npm install

# iniciar servidor de desarrollo (menu interactivo)
npx expo start

# abrir en web
npx expo start --web

# abrir en Android (requiere emulador/dispositivo)
npx expo start --android

# abrir en iOS (requiere macOS)
npx expo start --ios

# limpiar cache de metro ante errores raros
npx expo start -c

# chequeo de configuracion y salud del proyecto
npx expo-doctor

# instalar paquetes Expo manteniendo compatibilidad SDK
npx expo install <package-name>

# chequeo de tipos
npx tsc --noEmit
```

### 1.3 Comandos de calidad recomendados

```bash
# lint (si se configura eslint)
npm run lint

# formateo (si se configura prettier)
npm run format

# pruebas unitarias (si se configura jest)
npm run test
```

## 2) Dependencias Clave y Propósito

### 2.1 Plataforma y navegación
- expo: runtime y toolchain para apps universales.
- expo-router: enrutamiento file-based sobre React Navigation.
- expo-linking: deep links y universal links.
- expo-constants: lectura de metadata y configuraciones runtime.

### 2.2 UI base y runtime RN
- react, react-native, react-native-web: base universal.
- react-native-safe-area-context: soporte de safe areas.
- react-native-screens: optimizacion de navegacion nativa.
- react-native-gesture-handler: gestos avanzados confiables.
- react-native-reanimated: animaciones de alto rendimiento.

### 2.3 Estado, red y validacion
- zustand: estado global liviano y modular.
- axios: cliente HTTP con interceptores.
- react-hook-form: formularios performantes.
- zod + @hookform/resolvers: validacion declarativa robusta.

### 2.4 Auth y seguridad
- amazon-cognito-identity-js: SDK de autenticacion Cognito.
- expo-secure-store: almacenamiento seguro de credenciales en movil.

### 2.5 Evidencias y archivos
- expo-document-picker: seleccion de documentos (web/movil).
- expo-image-picker: galeria y seleccion de imagenes.
- expo-camera: captura directa desde camara.
- expo-file-system: operaciones de archivo y soporte de descargas.

### 2.6 Notificaciones y reporting
- expo-notifications: notificaciones push/locales.
- react-native-chart-kit: visualizacion de metricas en dashboard.
- date-fns: utilidades de fecha robustas.

## 3) Extensiones VS Code Recomendadas

### 3.1 Calidad de codigo
- ESLint (dbaeumer.vscode-eslint)
- Prettier - Code formatter (esbenp.prettier-vscode)
- Error Lens (usernamehw.errorlens)

### 3.2 Productividad TypeScript/React
- TypeScript Vue Plugin no aplica; usar TypeScript and JavaScript Language Features (built-in).
- React Native Tools (msjsdiag.vscode-react-native)
- Path Intellisense (christian-kohler.path-intellisense)

### 3.3 Estilos y diseño
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss) solo si se adopta NativeWind/Tailwind.
- Color Highlight (naumovs.color-highlight)

### 3.4 Expo y ecosistema
- Expo Tools (expo.vscode-expo-tools)
- GitHub Copilot (github.copilot)
- GitHub Copilot Chat (github.copilot-chat)

## 4) Configuracion recomendada de VS Code

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.eol": "\n"
}
```

## 5) Operación diaria sugerida
- Iniciar con npx expo start.
- Ejecutar typecheck antes de cada push.
- Validar flujo critico en web y al menos una plataforma movil por cambio relevante.
- Verificar estados de auth, wizard y uploads en escenarios de red inestable.
