// Logos de marque : couleurs officielles figées en dur (icon-brand-*),
// volontairement en dehors de la palette du design system.
const BRAND_ICON_CLASS = {
  react: "icon-brand-react",
  laravel: "icon-brand-laravel",
  mysql: "icon-brand-mysql",
  git: "icon-brand-git",
  docker: "icon-brand-docker",
  python: "icon-brand-python",
  n8n: "icon-brand-n8n",
  "node.js": "icon-brand-nodejs",
};

// Concepts génériques (pas de marque/couleur officielle) : icônes UI
// classiques, suivent currentColor comme le reste du design system.
const GENERIC_ICON_CLASS = {
  "rest api": "icon-api",
  "ci/cd": "icon-refresh",
};

export default function getTechIconClasses(techName) {
  const key = techName.trim().toLowerCase();

  if (BRAND_ICON_CLASS[key]) {
    return ["icon-brand", BRAND_ICON_CLASS[key]];
  }

  return ["icon", GENERIC_ICON_CLASS[key] ?? "icon-tag"];
}
