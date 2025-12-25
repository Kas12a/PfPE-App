import { useCallback } from "react";
import { useProfile } from "./useProfile";

export type Locale = "en" | "es";

type Dictionary = Record<string, string>;

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    "actions.title": "Log today’s eco-actions",
    "actions.subtitle": "Quickly capture what you’ve done",
    "actions.cycle": "Active commute",
    "actions.cycle_desc": "+10 pts",
    "actions.plastic": "Refuse plastic",
    "actions.plastic_desc": "+5 pts",
    "actions.recycle": "Recycle",
    "actions.recycle_desc": "+5 pts",
    "actions.energy": "Save energy",
    "actions.energy_desc": "+8 pts",
    "actions.tree": "Planting",
    "actions.tree_desc": "+25 pts",
    "actions.streak": "Day streak",
    "actions.today": "Points today",
    "actions.recent_title": "Recent activity",
    "actions.recent_subtitle": "Offline-safe history",
    "actions.loading": "Loading your offline log…",
    "actions.synced": "Synced",
    "actions.pending_sync": "Pending sync",
    "actions.empty": "No actions logged yet",
    "actions.empty_subtitle": "Use the quick actions above to start a streak.",
    "actions.log_first": "Log an action",
    "actions.logged_toast": "Action logged!",
  },
  es: {
    "actions.title": "Registra tus ecoacciones",
    "actions.subtitle": "Captura rápidamente lo que hiciste",
    "actions.cycle": "Transporte activo",
    "actions.cycle_desc": "+10 pts",
    "actions.plastic": "Sin plástico",
    "actions.plastic_desc": "+5 pts",
    "actions.recycle": "Reciclar",
    "actions.recycle_desc": "+5 pts",
    "actions.energy": "Ahorrar energía",
    "actions.energy_desc": "+8 pts",
    "actions.tree": "Reforestación",
    "actions.tree_desc": "+25 pts",
    "actions.streak": "Racha de días",
    "actions.today": "Puntos de hoy",
    "actions.recent_title": "Actividad reciente",
    "actions.recent_subtitle": "Historial disponible sin conexión",
    "actions.loading": "Cargando tu registro…",
    "actions.synced": "Sincronizado",
    "actions.pending_sync": "Pendiente",
    "actions.empty": "Aún no registras acciones",
    "actions.empty_subtitle": "Usa las acciones rápidas para iniciar una racha.",
    "actions.log_first": "Registrar acción",
    "actions.logged_toast": "¡Acción registrada!",
  },
};

export const supportedLanguages: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

function translate(key: string, locale: Locale, fallback?: string) {
  return dictionaries[locale]?.[key] ?? dictionaries.en[key] ?? fallback ?? key;
}

export function useTranslation() {
  const { profile, save } = useProfile();
  const locale = (profile.language as Locale) ?? "en";
  const t = useCallback((key: string, fallback?: string) => translate(key, locale, fallback), [locale]);
  const setLanguage = useCallback((code: Locale) => save({ language: code }), [save]);
  return { t, locale, setLanguage };
}
