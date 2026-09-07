import validateProps from "../vanilla-engine/src/validation/validate-props.js";

const schema = {
  active: { type: "string", required: false, default: "en" },
  onChange: { type: "function", required: false },
  ariaLabel: { type: "string", required: false, default: "Language selector" },
};

function languageButton(language, active, onChange) {
  const isActive = active === language;

  return {
    type: "button",
    attributes: [
      [
        "class",
        [
          "language-selector__option",
          ...(isActive ? ["language-selector__option--active"] : []),
        ],
      ],
      ["type", "button"],
      ["aria-pressed", String(isActive)],
    ],
    events: onChange ? [["click", () => onChange(language)]] : [],
    children: [language.toUpperCase()],
  };
}

export default function LanguageSelector(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);
  const active = finalProps.active === "fr" ? "fr" : "en";

  if (!valid || !["en", "fr"].includes(finalProps.active)) {
    console.error("LanguageSelector: props invalides —", [
      ...errors,
      ...(!["en", "fr"].includes(finalProps.active)
        ? ["active doit être en ou fr"]
        : []),
    ].join(", "));
  }

  return {
    type: "div",
    attributes: [
      ["class", ["language-selector"]],
      ["role", "group"],
      ["aria-label", finalProps.ariaLabel ?? "Language selector"],
    ],
    children: [
      languageButton("en", active, finalProps.onChange),
      { type: "span", attributes: [["class", ["language-selector__separator"]], ["aria-hidden", "true"]], children: ["/"] },
      languageButton("fr", active, finalProps.onChange),
    ],
  };
}
