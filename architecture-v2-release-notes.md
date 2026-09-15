# Website Architecture v2 Release Notes

This release intentionally uses an additive integration strategy. The existing `index.html` contains the live assessment application and is not replaced.

## Added public journeys
- Organizations: `/enterprise.html`
- Professionals: `/professionals.html`
- Evidence: `/science.html`
- Security & Trust: `/trust.html`

## Homepage integration design
`architecture-v2-nav.js` adds a small audience/trust navigation strip without changing assessment functions, checkout logic, Prism360 logic, or existing navigation handlers.

`architecture-v2-loader.js` is a fail-open loader: if the additive navigation cannot load, the existing site continues to operate.

## Production integration
The final homepage change should be a single script reference near the end of `index.html`:

```html
<script src="/architecture-v2-loader.js"></script>
```

This should only be merged after verifying the branch diff and existing application initialization. Rollback is removal of that one script reference.
