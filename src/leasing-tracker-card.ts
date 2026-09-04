import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { calculateExtraMileageCost, calculateMileagePercent, calculateTargetKilometers } from "./mileage.js";

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
  extra_km_cost_cents: number;
  show_values: boolean;
  show_graph: boolean;
  show_extra_cost: boolean;
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
      extra_km_cost_cents: 10,
      show_values: true,
      show_graph: true,
      show_extra_cost: true,
    };
  }

  public static getConfigLabel(name: string): string | undefined {
    return {
      entity: "Entität für aktuellen Kilometerstand des Fahrzeugs",
      start_date: "Datum Start des Leasingzeitraums",
      end_date: "Datum Ende des Leasingzeitraums",
      total_km: "Erlaubte Kilometer während der Gesamtleasingzeit",
      extra_km_cost_cents: "Kosten Mehrkilometer (ct/km)",
      show_values: "Zahlenwerte anzeigen",
      show_graph: "Grafische Darstellung anzeigen",
      show_extra_cost: "Mehrkosten anzeigen",
    }[name];
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement("leasing-tracker-card-editor");
  }

  public setConfig(config: Partial<LeasingTrackerConfig>): void {
    const normalizedConfig = {
      extra_km_cost_cents: 0,
      show_values: true,
      show_graph: true,
      show_extra_cost: true,
      ...config,
    };

    if (
      !normalizedConfig.entity ||
      !normalizedConfig.start_date ||
      !normalizedConfig.end_date ||
      normalizedConfig.total_km === undefined ||
      !Number.isFinite(normalizedConfig.total_km) ||
      normalizedConfig.total_km < 0 ||
      !Number.isFinite(normalizedConfig.extra_km_cost_cents) ||
      normalizedConfig.extra_km_cost_cents < 0
    ) {
      throw new Error("Leasing Tracker Card benötigt Entität, Startdatum, Enddatum, Freikilometer und Kosten Mehrkilometer.");
    }

    this.config = {
      type: "custom:leasing-tracker-card",
      ...normalizedConfig,
    };
  }

  public getCardSize(): number {
    return 4;
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
    const extraCost = target === null || !Number.isFinite(current) || this.config.extra_km_cost_cents === undefined
      ? null
      : calculateExtraMileageCost(current, target, this.config.extra_km_cost_cents);
    const currentClass = target !== null && current > target ? "value value--over" : "value value--under";
    const currentPercent = calculateMileagePercent(current, this.config.total_km);
    const targetPercent = target === null ? null : calculateMileagePercent(target, this.config.total_km);
    return html`
      <ha-card>
        <div class="content">
          ${this.config.show_values !== false ? html`<div class="mileage-grid">
            <div class="metric">
              <div class="label">aktueller Kilometerstand</div>
              <div class="${currentClass}">${Number.isFinite(current) ? current.toLocaleString() : "Nicht verfügbar"} <span>${unit}</span></div>
            </div>
            <div class="metric">
              <div class="label">Sollkilometerstand</div>
              <div class="value">${target === null ? "Ungültige Daten" : `${target.toLocaleString()} ${unit}`}</div>
            </div>
          </div>` : nothing}
          ${this.config.show_graph !== false ? (currentPercent === null || targetPercent === null ? nothing : html`
            <div class="mileage-bar" role="img" aria-label="Kilometerfortschritt">
              <div class="mileage-bar__fill ${currentClass.includes("over") ? "mileage-bar__fill--over" : "mileage-bar__fill--under"}" style="width: ${currentPercent}%"></div>
              <div class="mileage-bar__target" style="left: ${targetPercent}%"></div>
            </div>
          `) : nothing}
          ${this.config.show_extra_cost !== false ? html`
            <div class="cost">
              <span>Mehrkosten</span>
              <strong>${extraCost === null ? "Nicht verfügbar" : `${extraCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}</strong>
            </div>
          ` : nothing}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host { display: block; }
    .content { padding: 16px; }
    .label { color: var(--secondary-text-color); font-size: 14px; }
    .mileage-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
    .metric { min-width: 0; }
    .value { color: var(--primary-text-color); font-size: 32px; font-weight: 600; margin-top: 8px; }
    .value span { font-size: 16px; font-weight: 400; }
    .value--over { color: var(--error-color, #db4437); }
    .value--under { color: var(--success-color, #43a047); }
    .mileage-bar { background: var(--divider-color); border-radius: 3px; height: 12px; margin-top: 24px; overflow: visible; position: relative; }
    .mileage-bar__fill { border-radius: 3px; height: 100%; min-width: 0; }
    .mileage-bar__fill--under { background: var(--success-color, #43a047); }
    .mileage-bar__fill--over { background: var(--error-color, #db4437); }
    .mileage-bar__target { background: var(--primary-text-color); height: 20px; position: absolute; top: -4px; transform: translateX(-1px); width: 2px; }
    .cost { border-top: 1px solid var(--divider-color); display: flex; justify-content: space-between; gap: 16px; margin-top: 20px; padding-top: 12px; }
    .cost span { color: var(--secondary-text-color); }
    .cost strong { color: var(--primary-text-color); }
  `;
}

@customElement("leasing-tracker-card-editor")
export class LeasingTrackerCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: Partial<LeasingTrackerConfig> = {};

  public setConfig(config: Partial<LeasingTrackerConfig>): void {
    this.config = {
      type: "custom:leasing-tracker-card",
      extra_km_cost_cents: 0,
      show_values: true,
      show_graph: true,
      show_extra_cost: true,
      ...config,
    };
  }

  private readonly schema = [
    { name: "entity", required: true, selector: { entity: { domain: "sensor" } } },
    { name: "start_date", required: true, selector: { date: {} } },
    { name: "end_date", required: true, selector: { date: {} } },
    { name: "total_km", required: true, selector: { number: { min: 0, step: 1, mode: "box" } } },
    { name: "extra_km_cost_cents", required: true, selector: { number: { min: 0, step: 0.01, mode: "box" } } },
    { name: "show_values", selector: { boolean: {} } },
    { name: "show_graph", selector: { boolean: {} } },
    { name: "show_extra_cost", selector: { boolean: {} } },
  ];

  private valueChanged(event: CustomEvent): void {
    this.config = { type: "custom:leasing-tracker-card", show_values: true, show_graph: true, show_extra_cost: true, ...this.config, ...event.detail.value };
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this.config },
      bubbles: true,
      composed: true,
    }));
  }

  private get formData(): Partial<LeasingTrackerConfig> {
    return {
      type: "custom:leasing-tracker-card",
      entity: this.config.entity ?? "",
      start_date: this.config.start_date ?? "",
      end_date: this.config.end_date ?? "",
      total_km: this.config.total_km,
      extra_km_cost_cents: this.config.extra_km_cost_cents ?? 0,
      show_values: this.config.show_values !== false,
      show_graph: this.config.show_graph !== false,
      show_extra_cost: this.config.show_extra_cost !== false,
    };
  }

  protected render() {
    if (!this.hass) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this.formData}
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
  preview: true,
});
