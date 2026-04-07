---
applyTo: "src/store/**/*.ts"
description: "Use when creating or editing Zustand stores, actions, selectors, and persisted state."
---

# Zustand Rules

- Split stores by domain: auth, contrato, cuenta-cobro, ui.
- Keep actions explicit, named, and side-effect aware.
- Persist only what is required for continuity (session, wizard progress).
- Do not persist ephemeral visual state unless recovery is a business requirement.
- Reset domain stores on logout or terminal workflow completion.
- Use selectors to minimize rerenders in consuming components.
- Avoid cross-store circular dependencies.
- Keep derived values in selectors/helpers, not duplicated in state.
- Wizard state must support recovery after app close/crash.
- Prefer immutable updates and predictable transitions.
