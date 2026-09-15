export type SupportedLanguage = "de" | "en";

const translations = {
  de: {
    current_mileage: "aktueller Kilometerstand",
    target_mileage: "Sollkilometerstand",
    extra_cost: "Mehrkosten",
    unavailable: "Nicht verfügbar",
    invalid_data: "Ungültige Daten",
    incomplete_config: "Bitte die Kartenkonfiguration vervollständigen.",
    mileage_progress: "Kilometerfortschritt",
    entity: "Entität für aktuellen Kilometerstand des Fahrzeugs",
    start_date: "Datum Start des Leasingzeitraums",
    end_date: "Datum Ende des Leasingzeitraums",
    total_km: "Erlaubte Kilometer während der Gesamtleasingzeit",
    extra_km_cost_cents: "Kosten Mehrkilometer (ct/km)",
    show_values: "Zahlenwerte anzeigen",
    show_graph: "Grafische Darstellung anzeigen",
    show_extra_cost: "Mehrkosten anzeigen",
  },
  en: {
    current_mileage: "Current mileage",
    target_mileage: "Target mileage",
    extra_cost: "Extra mileage cost",
    unavailable: "Unavailable",
    invalid_data: "Invalid data",
    incomplete_config: "Please complete the card configuration.",
    mileage_progress: "Mileage progress",
    entity: "Vehicle current mileage entity",
    start_date: "Lease start date",
    end_date: "Lease end date",
    total_km: "Allowed kilometers for the complete lease",
    extra_km_cost_cents: "Extra mileage cost (ct/km)",
    show_values: "Show numeric values",
    show_graph: "Show graphical representation",
    show_extra_cost: "Show extra mileage cost",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getLanguage(language?: string): SupportedLanguage {
  return language?.toLowerCase().split("-")[0] === "de" ? "de" : "en";
}

export function localize(key: TranslationKey, language?: string): string {
  return translations[getLanguage(language)][key];
}
