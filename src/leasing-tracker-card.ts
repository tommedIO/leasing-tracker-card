import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { calculateTargetKilometers } from "./mileage.js";

interface HomeAssistant {
  states: Record<string, { state: string; attributes: { unit_of_measurement?: string; friendly_name?: string } }>;
  config: { time_zone: string; unit_system: { length: string } };
  callService?: (domain: string, service: string, data?: unknown) => void;
}

export interface LeasingTrackerConfig {
  type: string;
  entity: string;
  start_date: string;
  end_date: string;
  total_km: number;
}

@customElement("leasing-tracker-card")
export class LeasingTrackerCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: LeasingTrackerConfig;
  private refreshTimer?: number;

  public static getConfigElement(): HTMLElement {
    return document.createElement("leasing-tracker-card-editor");
  }

  public static getStubConfig(): LeasingTrackerConfig {
    return {
      type: "custom:leasing-tracker-card",
      entity: "sensor.example_odometer",
      start_date: "2025-01-01",
      end_date: "2026-01-01",
      total_km: 10_000,
    };
  }

  public static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: "sensor" } } },
        { name: "start_date", required: true, selector: { text: { type: "date" } } },
        { name: "end_date", required: true, selector: { text: { type: "date" } } },
        { name: "total_km", required: true, selector: { number: { min: 0, step: 1, mode: "box" } } },
      ],
    };
  }

  public setConfig(config: Partial<LeasingTrackerConfig>): void {
    if (!config.entity || !config.start_date || !config.end_date || config.total_km === undefined) {
      throw new Error("Leasing Tracker Card benötigt Entität, Startdatum, Enddatum und Freikilometer.");
    }
    this.config = {
      type: "custom:leasing-tracker-card",
      entity: config.entity,
      start_date: config.start_date,
      end_date: config.end_date,
      total_km: Number(config.total_km),
    };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.refreshTimer = window.setInterval(() => this.requestUpdate(), 60_000);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.refreshTimer !== undefined) window.clearInterval(this.refreshTimer);
  }

  protected render() {
    if (!this.hass || !this.config) return html``;
    const entity = this.hass.states[this.config.entity];
    const current = Number(entity?.state);
    const target = calculateTargetKilometers(
      Date.now(),
      this.config.start_date,
      this.config.end_date,
      this.config.total_km,
      this.hass.config.time_zone,
    );
    const unit = entity?.attributes.unit_of_measurement || (this.hass.config.unit_system.length === "km" ? "km" : "mi");
    const name = entity?.attributes.friendly_name || this.config.entity;

    return html`
      <ha-card header="Leasing Tracker">
        <div class="content">
          <div class="label">${name}</div>
          <div class="value">${Number.isFinite(current) ? current.toLocaleString() : "Nicht verfügbar"} <span>${unit}</span></div>
          <div class="target">
            <span>Sollkilometerstand</span>
            <strong>${target === null ? "Ungültige Daten" : `${target.toLocaleString()} ${unit}`}</strong>
          </div>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host { display: block; }
    .content { padding: 16px; }
    .label { color: var(--secondary-text-color); font-size: 14px; }
    .value { color: var(--primary-text-color); font-size: 32px; font-weight: 600; margin: 8px 0 16px; }
    .value span { font-size: 16px; font-weight: 400; }
    .target { border-top: 1px solid var(--divider-color); display: flex; justify-content: space-between; gap: 16px; padding-top: 12px; }
    .target span { color: var(--secondary-text-color); }
    .target strong { color: var(--primary-text-color); }
  `;
}

@customElement("leasing-tracker-card-editor")
export class LeasingTrackerCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: Partial<LeasingTrackerConfig> = {};

  public setConfig(config: Partial<LeasingTrackerConfig>): void {
    this.config = { type: "custom:leasing-tracker-card", ...config };
  }

  private update(key: keyof LeasingTrackerConfig, value: string | number): void {
    this.config = { type: "custom:leasing-tracker-card", ...this.config, [key]: value };
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config }, bubbles: true, composed: true }));
  }

  protected render() {
    const entities = Object.entries(this.hass?.states ?? {}).filter(([id]) => id.startsWith("sensor."));
    return html`
      <div class="form">
        <label>Entität aktueller Kilometerstand
          <input list="odometer-entities" .value=${this.config.entity ?? ""} @change=${(event: Event) => this.update("entity", (event.target as HTMLInputElement).value)} placeholder="sensor.fahrzeug_kilometerstand" />
          <datalist id="odometer-entities">${entities.map(([id, state]) => html`<option value=${id}>${state.attributes.friendly_name ?? id}</option>`)}</datalist>
        </label>
        <label>Leasing-Startdatum
          <input type="date" .value=${this.config.start_date ?? ""} @change=${(event: Event) => this.update("start_date", (event.target as HTMLInputElement).value)} />
        </label>
        <label>Leasing-Enddatum
          <input type="date" .value=${this.config.end_date ?? ""} @change=${(event: Event) => this.update("end_date", (event.target as HTMLInputElement).value)} />
        </label>
        <label>Freikilometer gesamt
          <input type="number" min="0" step="1" .value=${String(this.config.total_km ?? "")} @change=${(event: Event) => this.update("total_km", Number((event.target as HTMLInputElement).value))} />
        </label>
      </div>
    `;
  }

  static styles = css`
    .form { display: grid; gap: 16px; }
    label { color: var(--primary-text-color); display: grid; font-size: 14px; gap: 6px; }
    input { background: var(--secondary-background-color); border: 1px solid var(--divider-color); border-radius: 4px; box-sizing: border-box; color: var(--primary-text-color); font: inherit; min-height: 40px; padding: 8px; width: 100%; }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "leasing-tracker-card": LeasingTrackerCard;
    "leasing-tracker-card-editor": LeasingTrackerCardEditor;
  }
}

const cardWindow = window as unknown as { customCards?: Array<Record<string, unknown>> };
cardWindow.customCards = cardWindow.customCards ?? [];
cardWindow.customCards.push({
  type: "leasing-tracker-card",
  name: "Leasing Tracker Card",
  description: "Zeigt aktuellen und zeitbasierten Sollkilometerstand.",
  preview: false,
});
