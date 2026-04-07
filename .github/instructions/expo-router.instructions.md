---
applyTo: "src/app/**/*.tsx"
description: "Use when implementing routes, layouts, guards, deep links, tabs, and Expo Router navigation logic."
---

# Expo Router Rules

- Treat src/app as route-only space. Do not place reusable non-route components in this tree.
- Keep root providers and global navigation setup in src/app/\_layout.tsx.
- Use nested \_layout.tsx files for auth flow, tabs, admin, and supervisor route groups.
- Keep route groups in parentheses for URL cleanliness: (auth), (tabs), etc.
- Prefer typed route helpers for dynamic paths and deep-link generation.
- Enforce auth and role protection in layouts first, then UI guards as defense in depth.
- Redirect unauthorized users to safe anchors (home or login based on session state).
- Preserve deep-link behavior for key business routes: contrato, cuenta-cobro, supervisor/revisar, pago.
- Keep navigation transitions deterministic: avoid side effects in render.
- Follow Expo Router docs for protected routes and authentication patterns.
