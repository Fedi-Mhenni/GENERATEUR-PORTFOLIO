import validateProps from "../vanilla-engine/src/validation/validate-props.js";

const schema = {
  href: { type: "string", required: false, default: "" },
  label: { type: "string", required: true },
  iconSrc: { type: "string", required: true },
  newTab: { type: "boolean", required: false, default: true },
};

export default function SocialLink(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("SocialLink: props invalides —", errors.join(", "));
    return {
      type: "span",
      attributes: [["class", ["social-link", "social-link--invalid"]]],
      children: [finalProps.label ?? "Lien indisponible"],
    };
  }

  const icon = {
    type: "img",
    attributes: [
      ["class", ["social-link__icon"]],
      ["src", finalProps.iconSrc],
      ["alt", ""],
      ["width", 16],
      ["height", 16],
    ],
  };

  // Figma defines visual states for these items, but no external URL.
  // Do not present an invented destination as a working link.
  if (!finalProps.href) {
    return {
      type: "span",
      attributes: [
        ["class", ["social-link", "social-link--unavailable"]],
        ["aria-disabled", "true"],
      ],
      children: [icon, finalProps.label],
    };
  }

  const attributes = [
    ["class", ["social-link"]],
    ["href", finalProps.href],
  ];

  if (finalProps.newTab) {
    attributes.push(["target", "_blank"]);
    attributes.push(["rel", "noopener noreferrer"]);
  }

  return {
    type: "a",
    attributes,
    children: [
      icon,
      finalProps.label,
    ],
  };
}
