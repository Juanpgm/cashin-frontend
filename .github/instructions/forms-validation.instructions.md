---
applyTo: "src/components/forms/**/*.tsx"
description: "Use when implementing react-hook-form, zod schemas, and reusable business forms."
---

# Forms and Validation Rules

- Use react-hook-form for all business forms.
- Use zod as single source of truth for validation rules.
- Surface field-level and form-level errors in Spanish with actionable text.
- Keep schema close to form feature or in shared validator modules when reused.
- Map backend validation errors to field errors whenever possible.
- Disable submit while invalid or submitting; show deterministic loading feedback.
- Keep controlled/uncontrolled strategy consistent within each form.
- Prefer reusable FormField abstractions for repeated patterns.
- For wizard forms, persist valid partial data per step.
- Never duplicate validation logic across UI, store, and service without reason.
