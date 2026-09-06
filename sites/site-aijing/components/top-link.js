import validateProps from "../vanilla-engine/src/validation/validate-props.js";

const schema = {
  targetId: { type: "string", required: false, default: "site-top" },
  label: { type: "string", required: false, default: "TOP" },
  accessibleLabel: {
    type: "string",
    required: false,
    default: "Retour au haut de la page",
  },
};

function scrollToTarget(event, targetId) {
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState({}, "", `#${targetId}`);
}

export default function TopLink(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("TopLink: props invalides —", errors.join(", "));
  }

  return {
    type: "a",
    attributes: [
      ["class", ["top-link"]],
      ["href", `#${finalProps.targetId ?? "site-top"}`],
      ["aria-label", finalProps.accessibleLabel ?? "Retour au haut de la page"],
    ],
    events: [
      [
        "click",
        (event) => scrollToTarget(event, finalProps.targetId ?? "site-top"),
      ],
    ],
    children: [finalProps.label ?? "TOP"],
  };
}
