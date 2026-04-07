---
applyTo: "src/services/**/*.ts"
description: "Use when implementing API clients, Axios interceptors, auth refresh flow, and domain service calls."
---

# Services and API Rules

- Keep a single Axios base client in src/services/api.ts.
- Request interceptor must attach bearer token when available.
- Response interceptor must handle 401 with controlled refresh and single replay.
- Prevent infinite refresh loops by marking retried requests.
- On refresh failure: clear session and trigger auth reset path.
- Normalize backend errors into a stable app error shape for UI consistency.
- Services should return typed domain-safe payloads, not raw unknown responses.
- Keep network concerns in services; never embed HTTP details in screens.
- Avoid side effects unrelated to transport in service modules.
- Log technical metadata without leaking secrets/tokens.
