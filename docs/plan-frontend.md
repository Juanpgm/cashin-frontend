# CashIn Frontend — Plan de Implementación

> **Stack**: Expo (React Native Web) + React Navigation + Zustand + TypeScript
> **Plataformas**: Web (PWA) + iOS + Android desde un solo código
> **Auth**: AWS Cognito (amazon-cognito-identity-js)
> **API**: REST via Axios/fetch hacia FastAPI backend

---

## Estructura del Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── _layout.tsx                  # Layout raíz (Expo Router)
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── verify.tsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx              # Tab navigator
│   │   │   ├── index.tsx                # Home / Dashboard contratista
│   │   │   ├── contratos.tsx            # Lista de contratos
│   │   │   ├── cuentas.tsx              # Lista de cuentas de cobro
│   │   │   └── perfil.tsx               # Mi perfil
│   │   ├── contrato/
│   │   │   ├── [id].tsx                 # Detalle contrato
│   │   │   ├── nuevo.tsx                # Crear contrato
│   │   │   └── editar/[id].tsx          # Editar contrato
│   │   ├── cuenta-cobro/
│   │   │   ├── [id].tsx                 # Detalle cuenta de cobro
│   │   │   └── wizard/
│   │   │       ├── _layout.tsx          # Wizard layout (steps)
│   │   │       ├── paso1-contrato.tsx   # Seleccionar contrato y período
│   │   │       ├── paso2-actividades.tsx # Registrar actividades
│   │   │       ├── paso3-evidencias.tsx  # Subir evidencias
│   │   │       ├── paso4-preview.tsx    # Vista previa
│   │   │       └── paso5-confirmar.tsx  # Confirmar y generar
│   │   ├── admin/
│   │   │   ├── _layout.tsx
│   │   │   ├── dashboard.tsx            # Panel métricas
│   │   │   ├── contratistas.tsx         # Gestión usuarios
│   │   │   ├── cuentas.tsx              # Todas las cuentas
│   │   │   └── exportar.tsx             # Exportación reportes
│   │   ├── supervisor/
│   │   │   ├── _layout.tsx
│   │   │   ├── pendientes.tsx           # Cuentas por revisar
│   │   │   └── revisar/[id].tsx         # Revisar y aprobar/rechazar
│   │   └── pago/
│   │       ├── [cuentaId].tsx           # Pantalla de pago
│   │       └── resultado.tsx            # Resultado del pago
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── forms/
│   │   │   ├── ContratoForm.tsx
│   │   │   ├── ObligacionForm.tsx
│   │   │   ├── ActividadForm.tsx
│   │   │   └── FormField.tsx
│   │   ├── contrato/
│   │   │   ├── ContratoCard.tsx
│   │   │   ├── ContratoList.tsx
│   │   │   └── ObligacionItem.tsx
│   │   ├── cuenta-cobro/
│   │   │   ├── CuentaCobroCard.tsx
│   │   │   ├── CuentaCobroList.tsx
│   │   │   ├── ActividadItem.tsx
│   │   │   ├── WizardProgress.tsx       # Indicador de pasos
│   │   │   └── EstadoBadge.tsx          # Badge de estado con color
│   │   ├── evidencia/
│   │   │   ├── EvidenciaUploader.tsx    # Drag&drop (web) + cámara (móvil)
│   │   │   ├── EvidenciaGallery.tsx     # Grid de evidencias
│   │   │   ├── EvidenciaPreview.tsx     # Preview imagen/PDF
│   │   │   └── EvidenciaItem.tsx
│   │   ├── admin/
│   │   │   ├── MetricCard.tsx
│   │   │   ├── ChartCuentasPorEstado.tsx
│   │   │   └── IngresosChart.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── TabBar.tsx
│   │       └── RoleGuard.tsx            # Protección por rol
│   ├── services/
│   │   ├── api.ts                       # Axios instance con interceptors
│   │   ├── auth.service.ts              # Login, register, refresh, me
│   │   ├── contrato.service.ts          # CRUD contratos
│   │   ├── obligacion.service.ts        # CRUD obligaciones
│   │   ├── cuenta-cobro.service.ts      # CRUD cuentas de cobro
│   │   ├── actividad.service.ts         # CRUD actividades
│   │   ├── evidencia.service.ts         # Upload, listar, eliminar
│   │   ├── pago.service.ts              # Intención de pago, estado
│   │   └── admin.service.ts             # Dashboard, exportar, gestión
│   ├── store/
│   │   ├── auth.store.ts               # Estado de autenticación (Zustand)
│   │   ├── contrato.store.ts           # Contratos cacheados
│   │   ├── cuenta-cobro.store.ts       # Cuentas y wizard state
│   │   └── ui.store.ts                 # Toast, loading, modals
│   ├── hooks/
│   │   ├── useAuth.ts                  # Hook de autenticación
│   │   ├── useContratos.ts             # Fetch + cache contratos
│   │   ├── useCuentasCobro.ts          # Fetch + cache cuentas
│   │   ├── useUpload.ts                # Lógica de upload a S3
│   │   └── usePermissions.ts           # Verificar rol/permisos
│   ├── types/
│   │   ├── api.types.ts                # Types generados del backend
│   │   ├── navigation.types.ts         # Tipos de rutas
│   │   └── models.ts                   # Interfaces de entidades
│   ├── utils/
│   │   ├── formatters.ts               # Formato moneda COP, fechas
│   │   ├── validators.ts               # Validaciones de formulario
│   │   └── constants.ts                # API_URL, estados, etc.
│   └── theme/
│       ├── colors.ts
│       ├── spacing.ts
│       ├── typography.ts
│       └── index.ts
├── assets/
│   ├── images/
│   │   ├── logo.png
│   │   └── empty-state.png
│   └── fonts/
├── app.json
├── package.json
├── tsconfig.json
├── babel.config.js
└── .env.example
```

---

## FASE 1: Cimientos (Semanas 1-3)

### 1.1 Inicialización del Proyecto
- [ ] Crear proyecto Expo con TypeScript:
  ```bash
  npx create-expo-app@latest frontend --template tabs
  cd frontend
  ```
- [ ] Instalar dependencias core:
  ```bash
  npx expo install expo-router expo-linking expo-constants
  npm install zustand axios
  npm install amazon-cognito-identity-js
  npm install react-hook-form @hookform/resolvers zod
  npm install -D @types/react @types/react-native
  ```
- [ ] Configurar Expo Router (file-based routing)
- [ ] Configurar `.env.example`:
  ```env
  EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
  EXPO_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
  EXPO_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
  ```

### 1.2 Tema y Design System
- [ ] `src/theme/colors.ts`:
  ```typescript
  export const colors = {
    primary: '#1B5E20',     // Verde institucional (Cali)
    primaryLight: '#4CAF50',
    secondary: '#FF6F00',   // Naranja acento
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#F57C00',
    info: '#1976D2',
    border: '#E0E0E0',
    disabled: '#BDBDBD',
  }
  ```
- [ ] `src/theme/typography.ts`: escalas de texto (h1..body..caption)
- [ ] `src/theme/spacing.ts`: 4, 8, 12, 16, 24, 32, 48
- [ ] Componentes base UI: Button, Input, Card, Modal, Badge, Toast, Skeleton, EmptyState

### 1.3 Autenticación
- [ ] `src/services/api.ts`:
  ```typescript
  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
  });

  api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Intentar refresh token
        // Si falla → logout
      }
      return Promise.reject(error);
    }
  );
  ```
- [ ] `src/store/auth.store.ts` (Zustand):
  ```typescript
  interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    refreshSession: () => Promise<void>;
  }
  ```
- [ ] `src/services/auth.service.ts`: llamadas al backend
- [ ] `src/hooks/useAuth.ts`: hook que expone auth state y acciones

### 1.4 Pantallas de Auth
- [ ] `src/app/(auth)/login.tsx`:
  - Formulario: email + contraseña
  - Botón "Iniciar sesión"
  - Link a registro
  - Validación con zod + react-hook-form
  - Loading state y manejo de errores
- [ ] `src/app/(auth)/register.tsx`:
  - Formulario: nombre, cédula, email, teléfono, contraseña, confirmar contraseña
  - Validación de cédula colombiana (formato)
  - Términos y condiciones checkbox
  - Después de registro exitoso → pantalla de verificación
- [ ] `src/app/(auth)/verify.tsx`:
  - Input de código de 6 dígitos
  - Botón "Reenviar código"
  - Después de verificación → redirige a login

### 1.5 Navegación
- [ ] `src/app/_layout.tsx`: Layout raíz con auth check
  ```typescript
  // Si no autenticado → (auth) stack
  // Si autenticado → (tabs) navigator
  // Si rol admin → mostrar tabs de admin
  // Si rol supervisor → mostrar tabs de supervisor
  ```
- [ ] `src/app/(tabs)/_layout.tsx`: Tab navigator
  - Tab 1: Inicio (dashboard personal)
  - Tab 2: Contratos
  - Tab 3: Cuentas de Cobro (botón principal destacado)
  - Tab 4: Perfil
- [ ] `src/components/layout/RoleGuard.tsx`:
  ```typescript
  // Protege rutas admin/supervisor
  // Redirige a home si no tiene permisos
  ```

### 1.6 Pantalla Home (Contratista)
- [ ] `src/app/(tabs)/index.tsx`:
  - Saludo: "Hola, {nombre}"
  - Resumen rápido:
    - Contratos activos: N
    - Cuentas pendientes este mes: N
    - Última cuenta generada: fecha + estado
  - Botón destacado: "Generar cuenta de cobro" → wizard
  - Notificaciones recientes (cuentas aprobadas/rechazadas)

### Verificación Fase 1
- [ ] App abre en web (localhost:19006) y en Expo Go (móvil)
- [ ] Registro → verificación → login fluye correctamente
- [ ] Token se almacena y se envía en requests
- [ ] Tab navigator muestra las 4 pestañas
- [ ] Home muestra datos mock del usuario
- [ ] Refresh token renueva sesión automáticamente

---

## FASE 2: Contratos y Obligaciones (Semanas 4-5)

### 2.1 Servicios y Types
- [ ] `src/types/models.ts`:
  ```typescript
  interface Contrato {
    id: string;
    numero_contrato: string;
    objeto: string;
    valor_total: number;
    valor_mensual: number;
    fecha_inicio: string;
    fecha_fin: string;
    supervisor_nombre: string;
    dependencia: string;
    activo: boolean;
    obligaciones: Obligacion[];
  }

  interface Obligacion {
    id: string;
    descripcion: string;
    tipo: 'general' | 'especifica';
    orden: number;
  }
  ```
- [ ] `src/services/contrato.service.ts`: CRUD con paginación
- [ ] `src/hooks/useContratos.ts`: fetch, cache, refresh

### 2.2 Pantallas de Contratos
- [ ] `src/app/(tabs)/contratos.tsx` — Lista:
  - Barra de búsqueda (por número o nombre)
  - Filtro: activos / vencidos / todos
  - Lista con ContratoCard: número, objeto (truncado), fechas, badge de estado
  - FAB "+" para crear nuevo
  - Pull-to-refresh
  - Paginación infinita (FlatList con onEndReached)
  - Empty state si no tiene contratos

- [ ] `src/app/contrato/nuevo.tsx` — Crear:
  - Formulario multi-step o scroll largo:
    - Datos del contrato: número, objeto, valor total, valor mensual, fechas, supervisor, dependencia
    - Obligaciones: lista dinámica, agregar/eliminar/reordenar
  - Cada obligación: tipo (general/específica) + descripción textarea
  - Validación en tiempo real con zod
  - Preview antes de guardar
  - Loading + toast de confirmación

- [ ] `src/app/contrato/[id].tsx` — Detalle:
  - Header: número de contrato + badge estado
  - Datos del contrato en cards organizadas
  - Lista de obligaciones con numeración
  - Sección: "Cuentas de cobro de este contrato" — mini lista
  - Acciones: Editar, Eliminar (con confirmación)
  - Si tiene cuentas enviadas → mostrar aviso "No editable"

- [ ] `src/app/contrato/editar/[id].tsx` — Editar:
  - Mismo formulario que crear, pre-populated
  - Campos bloqueados si hay cuentas no-borrador

### 2.3 Componentes
- [ ] `src/components/contrato/ContratoCard.tsx`:
  - Pressable → navega a detalle
  - Muestra: número, objeto (2 líneas max), fechas, valor mensual formateado
  - Indicador de vigencia (verde/rojo/amarillo)
- [ ] `src/components/forms/ContratoForm.tsx`:
  - Formulario reutilizable (crear + editar)
  - react-hook-form + zod resolver
- [ ] `src/components/forms/ObligacionForm.tsx`:
  - Lista dinámica de obligaciones
  - Botón agregar, eliminar (swipe o botón X), reordenar (drag o flechas)

### 2.4 Importación Masiva (Admin/Power User)
- [ ] Botón "Importar contratos" en lista de contratos
- [ ] Seleccionar archivo Excel/CSV (expo-document-picker)
- [ ] Enviar al backend
- [ ] Mostrar resultado: exitosos / fallidos con detalle de errores
- [ ] Link para descargar template Excel

### Verificación Fase 2
- [ ] Crear contrato con 3 obligaciones → aparece en lista
- [ ] Buscar contrato por número → lo encuentra
- [ ] Detalle muestra obligaciones correctamente
- [ ] Editar contrato → cambios se reflejan
- [ ] Eliminar contrato → desaparece de lista (con confirmación)
- [ ] Funciona en web y móvil sin glitches de layout

---

## FASE 3: Motor de Cuentas de Cobro — Wizard (Semanas 6-8)

### 3.1 Servicios
- [ ] `src/services/cuenta-cobro.service.ts`:
  - `crear(contrato_id, mes, anio)`
  - `listar(filtros)`
  - `obtener(id)` — con actividades y evidencias
  - `enviar(id)`
  - `eliminar(id)`
  - `obtenerPdf(id)` — presigned URL
  - `estadoPdf(id)` — polling
- [ ] `src/services/actividad.service.ts`:
  - `agregar(cuenta_cobro_id, data)`
  - `actualizar(id, data)`
  - `eliminar(id)`
- [ ] `src/store/cuenta-cobro.store.ts`:
  - Estado del wizard (paso actual, datos parciales)
  - Persistencia local (AsyncStorage) para no perder progreso

### 3.2 Lista de Cuentas de Cobro
- [ ] `src/app/(tabs)/cuentas.tsx`:
  - Filtros: por estado, por mes/año
  - Lista con CuentaCobroCard:
    - Contrato (número)
    - Período (Marzo 2026)
    - Estado con badge de color
    - Valor formateado en COP
  - FAB "+" → ir al wizard
  - Búsqueda por contrato

### 3.3 Wizard de Generación (Corazón del Frontend)

#### Paso 1: Seleccionar Contrato y Período
- [ ] `src/app/cuenta-cobro/wizard/paso1-contrato.tsx`:
  - Dropdown/selector de contratos activos del usuario
  - Selector de mes y año (solo períodos válidos dentro de la vigencia del contrato)
  - Validación: no repetir período para el mismo contrato
  - Preview de datos del contrato seleccionado
  - Botón "Siguiente" → guarda en store

#### Paso 2: Registrar Actividades por Obligación
- [ ] `src/app/cuenta-cobro/wizard/paso2-actividades.tsx`:
  - **Diseño**: lista de obligaciones como "acordeón" expandible
  - Cada obligación muestra:
    - Título: "Obligación #{orden}: {descripción truncada}"
    - Badge: "0 actividades" (rojo) → "3 actividades" (verde)
    - Al expandir: lista de actividades + botón "Agregar actividad"
  - Formulario de actividad (inline o modal):
    - Descripción (textarea, placeholder contextual según la obligación)
    - Fecha de realización (date picker)
  - **Indicador de progreso**: "5/8 obligaciones con actividades"
  - Barra de progreso visual
  - Validación: todas las obligaciones deben tener al menos 1 actividad para continuar
  - Auto-save: guardar actividades al backend conforme se agregan

#### Paso 3: Subir Evidencias
- [ ] `src/app/cuenta-cobro/wizard/paso3-evidencias.tsx`:
  - Lista de actividades con sus evidencias actuales
  - Por cada actividad:
    - Thumbnails de evidencias ya subidas
    - Botón "Agregar evidencia"
  - Componente de upload (detalle en Fase 4, placeholder aquí)
  - Indicador: "12 evidencias subidas"
  - Este paso es **opcional** — se puede saltar

#### Paso 4: Vista Previa
- [ ] `src/app/cuenta-cobro/wizard/paso4-preview.tsx`:
  - Renderizar una preview del informe (no el PDF, sino datos formateados):
    - Datos del contratista
    - Datos del contrato
    - Tabla: Obligación | Actividades realizadas | # Evidencias
    - Total valor
  - Botón "Editar" por sección → regresa al paso correspondiente
  - Checkbox: "Declaro que la información es veraz..."

#### Paso 5: Confirmar y Generar
- [ ] `src/app/cuenta-cobro/wizard/paso5-confirmar.tsx`:
  - Resumen final compacto
  - Botón "Generar Cuenta de Cobro" → llama al API
  - Estado de generación:
    - Spinner: "Generando PDF..."
    - Polling cada 3s al endpoint de pdf-status
    - Al completar: "¡Listo! Tu cuenta de cobro ha sido generada"
  - Acciones post-generación:
    - "Descargar PDF"
    - "Enviar para revisión" (cambia estado a enviada)
    - "Volver al inicio"
  - Confetti animation al completar (react-native-confetti)

### 3.4 Componente WizardProgress
- [ ] `src/components/cuenta-cobro/WizardProgress.tsx`:
  - Indicador visual de 5 pasos (stepper horizontal)
  - Paso activo resaltado, pasos completados con check
  - Tap en paso completado → permite regresar
  - Responsive: horizontal en web, compacto en móvil

### 3.5 Detalle de Cuenta de Cobro
- [ ] `src/app/cuenta-cobro/[id].tsx`:
  - Header: estado + período + contrato
  - Timeline de estados (borrador → enviada → aprobada → pagada)
  - Lista de actividades agrupadas por obligación
  - Evidencias en galería
  - Si rechazada: mostrar observaciones del supervisor destacadas
  - Acciones según estado:
    - Borrador: "Editar" | "Enviar" | "Eliminar"
    - Enviada: "En espera de revisión" (readonly)
    - Aprobada: "Pagar" | "Descargar PDF"
    - Pagada: "Descargar PDF"

### 3.6 EstadoBadge Component
- [ ] `src/components/cuenta-cobro/EstadoBadge.tsx`:
  ```typescript
  const estadoConfig = {
    borrador: { color: colors.textSecondary, icon: 'edit', label: 'Borrador' },
    enviada: { color: colors.info, icon: 'send', label: 'Enviada' },
    en_revision: { color: colors.warning, icon: 'eye', label: 'En revisión' },
    aprobada: { color: colors.success, icon: 'check-circle', label: 'Aprobada' },
    rechazada: { color: colors.error, icon: 'x-circle', label: 'Rechazada' },
    pagada: { color: colors.primary, icon: 'dollar-sign', label: 'Pagada' },
  }
  ```

### Verificación Fase 3
- [ ] Wizard completo: seleccionar contrato → actividades → preview → generar PDF
- [ ] No permite continuar si obligaciones sin actividades
- [ ] PDF se genera y se puede descargar
- [ ] Estado cambia correctamente en cada transición
- [ ] Wizard guarda progreso (cerrar y reabrir no pierde datos)
- [ ] Funciona fluido en web y móvil
- [ ] Performance: lista de 50+ cuentas no se traba

---

## FASE 4: Gestión de Evidencias (Semanas 9-10)

### 4.1 Hook de Upload
- [ ] `src/hooks/useUpload.ts`:
  ```typescript
  function useUpload(actividadId: string) {
    // 1. Pedir presigned URL al backend
    // 2. Subir archivo directo a S3 con fetch/XMLHttpRequest
    // 3. Mostrar progreso (%)
    // 4. Confirmar upload al backend
    // 5. Refrescar lista de evidencias
    return { upload, progress, isUploading, error };
  }
  ```

### 4.2 Componente EvidenciaUploader
- [ ] `src/components/evidencia/EvidenciaUploader.tsx`:
  - **Web**:
    - Zona de drag & drop
    - Click para seleccionar archivo
    - Preview antes de subir
    - Barra de progreso por archivo
  - **Móvil**:
    - Botón "Tomar foto" → expo-camera
    - Botón "Seleccionar archivo" → expo-document-picker
    - Botón "Galería" → expo-image-picker
    - Preview thumbnail
      - Barra de progreso
  - Validaciones visuales:
    - Tipo no permitido → mensaje de error
    - Archivo muy grande → mensaje con límite
    - Máximo 10 por actividad → deshabilitar botón

### 4.3 Galería de Evidencias
- [ ] `src/components/evidencia/EvidenciaGallery.tsx`:
  - Grid 3 columnas (móvil) / 4-6 columnas (web)
  - Thumbnail para imágenes, icono para PDFs/docs
  - Tap → preview fullscreen
  - Long press / hover → opciones: descargar, eliminar
- [ ] `src/components/evidencia/EvidenciaPreview.tsx`:
  - Modal fullscreen
  - Imágenes: zoom + pan
  - PDFs: abrir en navegador/viewer externo
  - Botón descargar, botón eliminar

### 4.4 Integración con Wizard Paso 3
- [ ] Actualizar `paso3-evidencias.tsx` con componentes reales
- [ ] Por cada actividad mostrar galería + uploader
- [ ] Indicador total de evidencias subidas
- [ ] Spinner mientras sube cada archivo

### 4.5 Dependencias adicionales
```bash
npx expo install expo-document-picker expo-image-picker expo-camera expo-file-system
```

### Verificación Fase 4
- [ ] Web: drag & drop un JPG → sube con progreso → aparece en galería
- [ ] Móvil: tomar foto → sube → aparece en galería
- [ ] Preview fullscreen funciona para imágenes
- [ ] Eliminar evidencia → desaparece (con confirmación)
- [ ] Subir archivo .exe → error "Tipo no permitido"
- [ ] Subir archivo > 10MB → error "Archivo muy grande"
- [ ] Progreso de upload visible y preciso

---

## FASE 5: Dashboard Administrativo (Semanas 11-12)

### 5.1 Navegación Admin/Supervisor
- [ ] Mostrar tabs de admin/supervisor según rol del usuario:
  ```typescript
  // En (tabs)/_layout.tsx
  const { user } = useAuth();
  // Si admin → Tab extra "Admin"
  // Si supervisor → Tab extra "Revisiones"
  ```
- [ ] `src/components/layout/RoleGuard.tsx`: redirige si no tiene rol

### 5.2 Dashboard Admin
- [ ] `src/app/admin/dashboard.tsx`:
  - **Métricas en cards** (grid 2x2 en móvil, 4 en fila en web):
    - Contratistas activos: número grande + trend
    - Cuentas este mes: número + distribución por estado
    - Tasa cumplimiento: porcentaje + circular progress
    - Ingresos mes: valor COP formateado
  - **Gráfico de barras**: Cuentas por estado (borrador/enviada/aprobada/pagada)
    - Librería: `react-native-chart-kit` o `victory-native`
  - **Gráfico de línea**: Ingresos últimos 6 meses
  - **Tabla/Lista**: últimas 10 cuentas de cobro con acciones rápidas

- [ ] `src/app/admin/contratistas.tsx`:
  - Lista paginada con búsqueda (nombre, cédula, email)
  - Filtros: rol, activo/inactivo
  - Tap → ver detalle del contratista + sus contratos
  - Acciones: cambiar rol, activar/desactivar

- [ ] `src/app/admin/cuentas.tsx`:
  - Todas las cuentas de cobro del sistema
  - Filtros: estado, período, dependencia, supervisor
  - Búsqueda por contratista o número de contrato
  - Tap → ver detalle completo

- [ ] `src/app/admin/exportar.tsx`:
  - Selector de rango de fechas
  - Filtros: estado, dependencia
  - Botón "Exportar Excel" → descarga
  - Botón "Exportar CSV" → descarga

### 5.3 Vista Supervisor
- [ ] `src/app/supervisor/pendientes.tsx`:
  - Lista de cuentas en estado "enviada" de su dependencia
  - Ordenadas por fecha de envío (más antigua primero)
  - Badge con cantidad de pendientes en el tab
  - Card muestra: contratista, contrato, período, fecha envío

- [ ] `src/app/supervisor/revisar/[id].tsx`:
  - Vista detallada de la cuenta de cobro (readonly):
    - Datos del contratista y contrato
    - Tabla de obligaciones ↔ actividades
    - Galería de evidencias (tap para ver)
    - PDF preview si está generado
  - **Acciones**:
    - Botón verde "Aprobar" → confirmación → llamada API
    - Botón rojo "Rechazar" → modal con textarea para observaciones (requerido)
  - Después de acción → toast + redirige a lista pendientes

### 5.4 Notificaciones
- [ ] Indicador de notificaciones no leídas (badge en header)
- [ ] Lista de notificaciones (drawer o pantalla):
  - "Tu cuenta de Marzo 2026 fue aprobada"
  - "Tu cuenta de Febrero 2026 fue rechazada: ver observaciones"
  - "Recuerda generar tu cuenta de cobro antes del 28"
- [ ] Push notifications en móvil (expo-notifications)

### 5.5 Componentes Admin
- [ ] `MetricCard.tsx`: número grande + label + icono + color + trend arrow
- [ ] `ChartCuentasPorEstado.tsx`: bar chart con colores por estado
- [ ] `IngresosChart.tsx`: line chart con tooltips

### Verificación Fase 5
- [ ] Admin ve dashboard con todas las métricas
- [ ] Contratista NO ve pestaña Admin → redirige
- [ ] Supervisor ve lista de pendientes con badge contador
- [ ] Supervisor aprueba → estado cambia + contratista ve notificación
- [ ] Supervisor rechaza con observaciones → contratista ve observaciones
- [ ] Exportar Excel → se descarga archivo correcto
- [ ] Dashboard responsivo: web (grid) y móvil (stack)

---

## FASE 6: Pagos (Semanas 13-15)

### 6.1 Flujo de Pago
- [ ] `src/services/pago.service.ts`:
  - `crearIntencion(cuentaCobroId)` → retorna datos para Wompi widget
  - `consultarEstado(pagoId)` → polling
  - `historial()` → lista de pagos

### 6.2 Pantalla de Pago
- [ ] `src/app/pago/[cuentaId].tsx`:
  - Resumen de lo que se va a pagar:
    - Contrato #XXX
    - Período: Marzo 2026
    - Valor del servicio: $12,000 COP
  - **Pricing tier** si aplica (básico/estándar/premium)
  - Integración Wompi checkout widget:
    - Web: embed Wompi.js widget
    - Móvil: WebView con Wompi checkout
  - Métodos de pago: PSE, tarjeta, Nequi
  - Indicador de seguridad: "Pago seguro procesado por Wompi"

- [ ] `src/app/pago/resultado.tsx`:
  - **Aprobado**: confetti + "¡Pago exitoso!" + botón "Descargar PDF"
  - **Rechazado**: "El pago no pudo procesarse" + botón "Reintentar"
  - **Pendiente** (PSE): "Estamos verificando tu pago..." + auto-refresh

### 6.3 Freemium
- [ ] Mostrar en pantalla de pago si tiene cuentas gratis disponibles:
  - "Tienes 2 cuentas gratis restantes. ¡Esta es gratis!"
  - Botón "Generar gratis" en lugar de widget de pago
- [ ] Contador visible en home: "Te quedan N cuentas gratis"

### 6.4 Historial de Pagos
- [ ] Sección en perfil o tab dedicado:
  - Lista de pagos: fecha, monto, método, estado, cuenta asociada
  - Filtros por fecha y estado
  - Tap → detalle con referencia de transacción

### 6.5 Bloqueo de PDF
- [ ] Si cuenta_cobro.estado != "pagada" y cuentas_gratis == 0:
  - Botón "Descargar PDF" → redirige a pantalla de pago
  - Mostrar overlay: "Paga para desbloquear tu cuenta de cobro"
- [ ] Si pagada o gratis:
  - Descarga directa del PDF

### Verificación Fase 6
- [ ] Tap "Pagar" → widget Wompi se muestra correctamente
- [ ] Pago sandbox con tarjeta de prueba → resultado exitoso
- [ ] PDF se desbloquea inmediatamente tras pago
- [ ] Sin pago → PDF no descargable (muestra pantalla de pago)
- [ ] Primeras 3 cuentas gratis funcionan sin pedir pago
- [ ] Historial de pagos muestra registros correctos
- [ ] Funciona en web y móvil

---

## Dependencias Completas (package.json)

```json
{
  "dependencies": {
    "expo": "~52.*",
    "expo-router": "~4.*",
    "expo-constants": "~17.*",
    "expo-linking": "~7.*",
    "expo-status-bar": "~2.*",
    "expo-document-picker": "~13.*",
    "expo-image-picker": "~16.*",
    "expo-camera": "~16.*",
    "expo-file-system": "~18.*",
    "expo-notifications": "~0.29.*",
    "expo-secure-store": "~14.*",
    "react": "18.3.*",
    "react-native": "0.76.*",
    "react-native-web": "~0.19.*",
    "react-native-safe-area-context": "~5.*",
    "react-native-screens": "~4.*",
    "react-native-gesture-handler": "~2.20.*",
    "react-native-reanimated": "~3.16.*",
    "@react-navigation/native": "^7.*",
    "amazon-cognito-identity-js": "^6.*",
    "axios": "^1.7.*",
    "zustand": "^5.*",
    "react-hook-form": "^7.*",
    "@hookform/resolvers": "^3.*",
    "zod": "^3.*",
    "date-fns": "^4.*",
    "react-native-chart-kit": "^6.*"
  },
  "devDependencies": {
    "@types/react": "~18.*",
    "typescript": "~5.3.*"
  }
}
```

---

## Utilidades Clave

### Formateadores (`src/utils/formatters.ts`)
```typescript
// Formato moneda colombiana
export const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

// Formato fecha
export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));

// Período legible
export const formatPeriodo = (mes: number, anio: number) => {
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  return `${meses[mes - 1]} ${anio}`;
};

// Truncar texto
export const truncate = (text: string, max: number) =>
  text.length > max ? text.slice(0, max) + '...' : text;
```

### Variables de Entorno (.env.example)
```env
EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
EXPO_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
EXPO_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxx
```
