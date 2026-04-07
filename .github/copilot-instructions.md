# Copilot Workspace Instructions

Estas instrucciones aseguran que GitHub Copilot use la documentacion de este proyecto como fuente primaria de decisiones de implementacion.

## Prioridad de referencia obligatoria

1. .github/INSTRUCTIONS.md
2. .github/SKILLS.md
3. .github/TOOLS.md
4. docs/plan-frontend.md

## Reglas para cualquier tarea de desarrollo

- Antes de proponer o escribir codigo, alinear arquitectura, routing y estado con .github/INSTRUCTIONS.md.
- En tareas de implementacion, aplicar competencias tecnicas descritas en .github/SKILLS.md.
- Para setup, debugging y operaciones, usar comandos y stack definidos en .github/TOOLS.md.
- No introducir librerias o patrones que contradigan la arquitectura oficial salvo solicitud explicita del usuario.

## Reglas de Expo Router

- Respetar file-based routing en src/app y layouts anidados.
- Implementar protecciones de ruta por autenticacion y rol en layout + guardas de UI.
- Mantener rutas deep-linkables para entidades clave (contratos, cuentas, revision, pagos).

## Reglas de estado y formularios

- Formularios con react-hook-form + zod como estandar.
- Estado global con Zustand por dominio y persistencia selectiva.
- Flujo de refresh token centralizado en interceptores de Axios.

## Reglas de UX multiplataforma

- Web y movil deben tener experiencia equivalente en objetivos de negocio.
- Diferenciar interacciones por plataforma cuando sea necesario (drag and drop en web, camara/galeria en movil).
- Priorizar feedback claro, estados de carga y manejo de errores accionable.

## Entregables esperados de Copilot

- Codigo tipado estrictamente en TypeScript.
- Archivos y modulos ubicados segun estructura del plan.
- Cambios pequenos, trazables y orientados a dominio.
