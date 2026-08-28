import { LitElement, css, html, nothing } from "lit";
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
  @state() private config?: Partial<LeasingTrackerConfig>;
  private refreshTimer?: number;

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
        { name: "start_date", required: true, selector: { date: {} } },
        { name: "end_date", required: true, selector: { date: {} } },
        { name: "total_km", required: true, selector: { number: { min: 0, step: 1, mode: "box" } } },
      ],
      computeLabel: (schema: { name: string }) => this.getConfigLabel(schema.name),
    };
  }

  public static getConfigLabel(name: string): string | undefined {
    return {
      entity: "Entität für aktuellen Kilometerstand des Fahrzeugs",
      start_date: "Datum Start des Leasingzeitraums",
      end_date: "Datum Ende des Leasingzeitraums",
      total_km: "Erlaubte Kilometer während der Gesamtleasingzeit",
    }[name];
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement("leasing-tracker-card-editor");
  }

  public setConfig(config: Partial<LeasingTrackerConfig>): void {
    this.config = {
      type: "custom:leasing-tracker-card",
      ...config,
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
    if (!this.config.entity || !this.config.start_date || !this.config.end_date || this.config.total_km === undefined) {
      return html`<ha-card><div class="content">Bitte die Kartenkonfiguration vervollständigen.</div></ha-card>`;
    }
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
    return html`
      <ha-card>
        <div class="content">
          <div class="label">aktueller Kilometerstand</div>
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

  private readonly schema = [
    { name: "entity", required: true, selector: { entity: { domain: "sensor" } } },
    { name: "start_date", required: true, selector: { date: {} } },
    { name: "end_date", required: true, selector: { date: {} } },
    { name: "total_km", required: true, selector: { number: { min: 0, step: 1, mode: "box" } } },
  ];

  private valueChanged(event: CustomEvent): void {
    this.config = { type: "custom:leasing-tracker-card", ...event.detail.value };
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this.config },
      bubbles: true,
      composed: true,
    }));
  }

  protected render() {
    if (!this.hass) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${this.schema}
        .computeLabel=${(schema: { name: string }) => LeasingTrackerCard.getConfigLabel(schema.name)}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }
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
