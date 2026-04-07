# INSTRUCTIONS.md

Guía operativa oficial para el desarrollo de CashIn Frontend.

Base normativa de arquitectura y routing:
- Expo Router (file-based routing, layouts, protected routes): https://docs.expo.dev/router/
- Core concepts (src/app, _layout, URL por pantalla): https://docs.expo.dev/router/basics/core-concepts/
- Authentication y protected routes (SDK 53+): https://docs.expo.dev/router/advanced/authentication/
- Linking y deep links universales: https://docs.expo.dev/linking/overview/

## 1) Reglas de Arquitectura

### 1.1 Estructura por capas
- src/app: solo rutas y pantallas. Ningun componente reutilizable o helper debe vivir aqui.
- src/components: componentes presentacionales y bloques reutilizables.
- src/services: acceso a API, mapeo de DTOs y errores de red.
- src/store: estado global y persistencia con Zustand.
- src/hooks: logica de orquestacion entre UI, store y servicios.
- src/types: contratos de tipos compartidos, modelos de dominio y tipos de rutas.
- src/utils: funciones puras (formatos COP, validadores, helpers).
- src/theme: tokens de diseno, tipografia, espaciado, colores.

### 1.2 Principios de modularidad
- Cada feature debe tener:
  - Pantalla/ruta (src/app/...)
  - Servicios (src/services/...)
  - Estado minimo necesario (src/store/...)
  - Componentes locales/reutilizables (src/components/...)
- Evitar componentes “god component”. Extraer subcomponentes cuando una pantalla crezca en complejidad.
- Evitar dependencia circular entre store, hooks y services.

### 1.3 Convencion por responsabilidad
- Screens: composicion + orquestacion de hooks.
- Hooks: logica de negocio de UI y sincronizacion.
- Services: IO externo (HTTP, storage externo), sin estado visual.
- Store: estado compartido, mutaciones predecibles, acciones puras y nombradas.

## 2) Directrices de Expo Router

### 2.1 Reglas file-based obligatorias
- Toda pantalla enrutable debe existir dentro de src/app con default export.
- src/app/_layout.tsx es la raiz de providers globales (auth, theme, splash, query/cache).
- Rutas en grupos entre parentesis (ejemplo: (auth), (tabs)) no agregan segmento de URL.
- Usar index.tsx para rutas por defecto en cada nivel.

### 2.2 Layouts anidados
- src/app/_layout.tsx:
  - Debe declarar Stack raiz y protecciones globales.
  - Debe mantener el splash visible hasta resolver sesion inicial.
- src/app/(auth)/_layout.tsx:
  - Flujo de acceso sin sesion (login, registro, verify).
- src/app/(tabs)/_layout.tsx:
  - Navegacion principal post-login.
- src/app/admin/_layout.tsx y src/app/supervisor/_layout.tsx:
  - Layouts de zonas protegidas por rol.

### 2.3 Proteccion de rutas y roles
- Implementar proteccion en layout con Stack.Protected cuando aplique.
- Regla minima:
  - Sin sesion: solo rutas de (auth).
  - Con sesion: rutas privadas disponibles.
- Regla por rol:
  - contratista: acceso a tabs base, contratos, cuenta-cobro, perfil, pago.
  - supervisor: acceso adicional a supervisor/*.
  - admin: acceso adicional a admin/*.
- Cualquier acceso no autorizado debe redirigir a una ruta segura (home o login segun sesion).
- RoleGuard debe ser redundante sobre el layout (defensa en profundidad).

### 2.4 Deep linking
- Toda ruta de negocio clave debe ser deep-linkable:
  - /contrato/[id]
  - /cuenta-cobro/[id]
  - /supervisor/revisar/[id]
  - /pago/[cuentaId]
- No hardcodear URLs. Centralizar builders de rutas tipadas en src/types/navigation.types.ts o util dedicado.
- Soportar apertura de links con sesion vencida y redireccion post-login.

## 3) Mejores Practicas Multiplataforma

### 3.1 UI responsive
- Diseñar mobile-first y escalar a web con breakpoints explicitos.
- En web, usar max-width para contenido administrativo largo y grillas adaptativas.
- Evitar medidas absolutas para contenedores principales; preferir flex + constraints.

### 3.2 Diferencias web vs movil
- Evidencias:
  - Web: drag and drop y seleccion de archivos.
  - Movil: camara, galeria y document picker.
- Aplicar branching por plataforma con Platform.OS o archivos platform-specific cuando la UX lo requiera.
- No degradar accesibilidad en web: foco visible, navegacion teclado, labels claros.

### 3.3 Performance y listas largas
- Para listas de 50+ items:
  - FlatList con keyExtractor estable.
  - getItemLayout cuando sea posible.
  - initialNumToRender y windowSize ajustados por caso.
  - evitar renderItem inline recreado en cada render.
- Memoizar celdas (React.memo) cuando haya payload pesado.
- Evitar recalculo de formatters por item; precomputar o memoizar.

## 4) Manejo de Formularios y Estado

### 4.1 Formularios con react-hook-form + zod
- Todo formulario de negocio debe tener schema zod dedicado.
- Resolver unico por pantalla/formulario con mensajes en espanol claros y accionables.
- Validacion en tres niveles:
  - Campo (onBlur/onChange para feedback temprano).
  - Form submit (consistencia total).
  - Reglas backend (errores de negocio del API mapeados a campo o form-level).
- No duplicar reglas de validacion fuera del schema salvo casos de UX progresiva.

### 4.2 Store con Zustand
- Separar stores por dominio:
  - auth.store
  - contrato.store
  - cuenta-cobro.store
  - ui.store
- Persistir solo estado necesario para continuidad:
  - tokens/sesion segura
  - wizard de cuenta-cobro (paso y datos parciales)
- Limpiar estado persistido tras logout o submit final exitoso del wizard.
- Evitar usar store para estado efimero hiperlocal de componentes.

### 4.3 Wizard de cuenta de cobro
- El estado del wizard debe sobrevivir cierre accidental.
- Guardado incremental por paso.
- Auto-save de actividades/evidencias con estrategia de retry y feedback de sincronizacion.
- Nunca permitir avanzar al paso 3+ si no cumple reglas minimas del paso 2.

## 5) Estándares de Código

### 5.1 TypeScript estricto
- Habilitar strict y noImplicitAny.
- Prohibido any en dominio; usar unknown + narrowing si el origen es externo.
- Tipar respuestas HTTP con DTOs y mapear a modelos de dominio.

### 5.2 Convenciones de nombres
- Componentes y pantallas: PascalCase.
- Hooks: camelCase con prefijo use.
- Stores: <dominio>.store.ts.
- Servicios: <dominio>.service.ts.
- Tipos de dominio: singular en PascalCase (Contrato, CuentaCobro).
- Enums de estado: UPPER_SNAKE_CASE para constantes exportadas.

### 5.3 Axios e interceptores
- Un unico cliente base en src/services/api.ts.
- Request interceptor:
  - Adjuntar Authorization bearer token cuando exista.
  - Inyectar metadata util (request id si aplica).
- Response interceptor:
  - Manejar 401 con flujo de refresh controlado (una sola reintento por request).
  - Evitar loops infinitos de refresh.
  - Si refresh falla: limpiar sesion y redirigir a login.
- Normalizar errores en un tipo comun de aplicacion para UI consistente.

### 5.4 Logging y errores
- Mensajes de error orientados a accion del usuario.
- No exponer detalles sensibles de backend ni tokens en logs.
- Registrar errores tecnicos con contexto (ruta, accion, request id).

## 6) UX/UI de Nivel Empresarial
- Formularios con feedback inmediato y lenguaje claro.
- Estados vacios con CTA explicito.
- Loading states en acciones largas y skeletons en cargas iniciales.
- Toasts para confirmaciones y errores no bloqueantes.
- Confirmaciones obligatorias en acciones destructivas.
- Flujos administrativos con trazabilidad visual de estado (badges, timeline, historial).

## 7) Definicion de Hecho (DoD)
- Tipado estricto y sin errores de compilacion.
- Navegacion y protecciones por rol validadas en web y movil.
- Formularios validados con zod y mensajes claros.
- Estados de carga/error/success implementados.
- Caso feliz y caso de fallo cubiertos en cada pantalla critica.
- Sin regresiones de performance en listas y wizard.
