---
applyTo: "src/app/**/*.tsx"
description: "Use when building or editing feature screens in auth, tabs, contratos, cuenta-cobro, admin, supervisor, and pago flows."
---

# Screen Implementation Rules

- Screens orchestrate only: compose hooks, trigger actions, render UI states.
- Always implement loading, empty, error, and success states.
- Keep business text and validation feedback in Spanish, actionable, and concise.
- For long lists, use FlatList with stable keyExtractor and tuned render window settings.
- Avoid heavy inline functions in list rows; memoize item renderers/components.
- Keep destructive actions behind explicit confirmation dialogs.
- For role-sensitive views, hide actions in UI and also enforce on navigation layer.
- For web/mobile divergence, split by platform behavior only when UX requires it.
- Ensure COP and date formatting use shared formatters from utils.
- Route params must be validated before use in data calls.
