# SKILLS.md

Competencias tecnicas requeridas para desarrollar y evolucionar CashIn Frontend con calidad empresarial.

## 1) Core

### 1.1 React Native Web
- Construccion de UI universal reutilizable entre web, iOS y Android.
- Manejo de diferencias de interaccion (hover/focus en web, touch en movil).
- Dominio de componentes base de React Native con enfoque multiplataforma.

### 1.2 Expo SDK 52+
- Flujo de desarrollo con Expo CLI, Expo Go y development builds.
- Uso correcto de modulos Expo (document picker, image picker, camera, notifications, secure store).
- Configuracion de app.json y variables EXPO_PUBLIC_ para runtime seguro.

### 1.3 TypeScript avanzado
- Modelado de dominio fuerte (Contratos, Cuentas, Actividades, Evidencias, Pagos).
- Tipado de API con DTOs y transformacion a modelos internos.
- Narrowing de unknown, utility types, discriminated unions para estados async.

## 2) Enrutamiento

### 2.1 Expo Router v4+
- Aplicacion estricta de file-based routing en src/app.
- Uso correcto de _layout.tsx raiz y anidados.
- Definicion de grupos de rutas (auth, tabs, admin, supervisor).
- Implementacion de rutas dinamicas y deep links universales.

### 2.2 Proteccion y autorizacion
- Protected routes por sesion en layouts.
- Role guards por dominio funcional (admin/supervisor/contratista).
- Redireccion segura en sesiones expiradas o roles insuficientes.

## 3) Estado y Fetching

### 3.1 Zustand
- Stores modulares por bounded context.
- Acciones puras, selectores estables y minimizacion de rerenders.
- Persistencia selectiva para sesion y wizard de cuenta de cobro.

### 3.2 Axios
- Cliente API centralizado con interceptors.
- Inyeccion de JWT en requests.
- Refresh token robusto, anti-loop y estrategia de logout seguro.
- Normalizacion de errores para feedback uniforme en UI.

## 4) Autenticación

### 4.1 AWS Cognito con amazon-cognito-identity-js
- Registro, verificacion, login y refresco de sesion.
- Manejo de estados de autenticacion asincronos en arranque de app.
- Proteccion de credenciales y datos de sesion (secure storage en movil).

### 4.2 Integracion con backend FastAPI
- Sincronizacion de tokens Cognito con API propia.
- Manejo de errores de autorizacion y expiracion de sesiones.

## 5) UI/UX

### 5.1 Diseño atómico
- Construccion de biblioteca UI reusable (Button, Input, Card, Badge, Modal, Toast, Skeleton, EmptyState).
- Composicion por capas: atomos, moleculas, organismos y pantallas.

### 5.2 Tema centralizado
- Tokens unificados de color, tipografia y spacing.
- Consistencia visual en todos los flujos administrativos.
- Formato local es-CO (moneda COP, fechas, periodos).

### 5.3 Animacion e interaccion
- Animaciones fluidas y performantes con Reanimated.
- Gestos con Gesture Handler cuando aporten valor funcional.
- Feedback visual explicito en acciones criticas (wizard, aprobacion, pago, upload).

## 6) Formularios y validación
- React Hook Form para performance y escalabilidad.
- Zod como fuente unica de verdad para reglas de negocio de entrada.
- Mensajeria de validacion contextual y accionable para usuarios administrativos.

## 7) Performance operacional
- Optimizacion de FlatList y renderizado incremental.
- Estrategias de memoizacion en listas y componentes costosos.
- Control de cargas asicronas simultaneas en pantallas de dashboard.

## 8) Calidad y mantenibilidad
- Arquitectura limpia orientada a dominio.
- Convenciones de nombres consistentes.
- Manejo de errores estandarizado y observable.
- Preparacion para crecimiento del producto sin deuda tecnica acelerada.
