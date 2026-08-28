# Leasing Tracker Card

- Home Assistant Lovelace custom card built with TypeScript, Lit, and Vite.
- The distributable is `leasing-tracker-card.js` in the repository root.
- Keep the visual editor available; users should not need YAML for normal setup.
- Date-only inputs represent midnight in Home Assistant's configured time zone.
- The target mileage is `round(((now - start_date) / (end_date - start_date)) * total_km)`.
- Run `npm run build` and `npm test` before submitting changes.
