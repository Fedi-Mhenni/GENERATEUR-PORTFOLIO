import validateProps from "../vanilla-engine/src/validation/validate-props.js";

const schema = {
  label: { type: "string", required: true },
  type: { type: "string", required: false, default: "button" },
  disabled: { type: "boolean", required: false, default: false },
  onClick: { type: "function", required: false },
};

export default function Button(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("Button: props invalides —", errors.join(", "));
  }

  const attributes = [
    ["class", ["button"]],
    ["type", finalProps.type ?? "button"],
  ];

  if (finalProps.disabled) {
    attributes.push(["disabled", ""]);
  }

  return {
    type: "button",
    attributes,
    events: finalProps.onClick ? [["click", finalProps.onClick]] : [],
    children: [finalProps.label ?? "Action"],
  };
}
