# Leasing Tracker Card

A HACS-compatible Home Assistant Lovelace custom card that compares a vehicle's current odometer reading with its time-based target mileage.

## Installation with HACS

1. Open HACS and add `tommedIO/leasing-tracker-card` as a custom repository of type **Dashboard**.
2. Install **Leasing Tracker Card**.
3. Add the installed card as a Lovelace resource. In HACS, use **Add to Lovelace resources** if that action is available. Otherwise open **Settings > Dashboards > Resources > Add resource** and enter:

	- URL: `/hacsfiles/leasing-tracker-card/leasing-tracker-card.js`
	- Type: **JavaScript module**

	This resource entry is required once so Home Assistant can load and discover the card. It is not a YAML card configuration.
4. Reload the browser, then add the card through the dashboard card picker. The visual editor configures all card fields.

## Configuration

The editor provides:

- The sensor entity containing the current odometer value
- Leasing start date
- Leasing end date
- Total free kilometers for the complete lease

The target is calculated in Home Assistant's configured time zone using:

```text
round(((now - start_date) / (end_date - start_date)) * total_km)
```

The card currently displays the entity's current value and the calculated target value. Dates outside the lease can intentionally produce values below zero or above the total, matching the formula.

## Development

```sh
npm install
npm run build
npm test
```

The build output is `leasing-tracker-card.js` in the repository root, ready for HACS.
