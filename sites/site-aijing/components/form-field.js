import validateProps from "../vanilla-engine/src/validation/validate-props.js";

const schema = {
  id: { type: "string", required: true },
  name: { type: "string", required: true },
  label: { type: "string", required: true },
  type: { type: "string", required: false, default: "text" },
  value: { type: "string", required: false, default: "" },
  placeholder: { type: "string", required: false, default: "" },
  autocomplete: { type: "string", required: false, default: "" },
  error: { type: "string", required: false, default: "" },
  required: { type: "boolean", required: false, default: false },
  disabled: { type: "boolean", required: false, default: false },
  checked: { type: "boolean", required: false, default: false },
  multiline: { type: "boolean", required: false, default: false },
  rows: { type: "number", required: false, default: 5 },
};

function controlAttributes(props, errorId) {
  const attributes = [
    ["class", ["form-field__control"]],
    ["id", props.id],
    ["name", props.name],
  ];

  if (!props.multiline && props.type !== "checkbox") {
    attributes.push(["value", props.value]);
  }

  if (props.placeholder) {
    attributes.push(["placeholder", props.placeholder]);
  }

  if (props.autocomplete) {
    attributes.push(["autocomplete", props.autocomplete]);
  }

  if (props.required) {
    attributes.push(["required", ""]);
  }

  if (props.disabled) {
    attributes.push(["disabled", ""]);
  }

  if (props.checked) {
    attributes.push(["checked", ""]);
  }

  if (props.error) {
    attributes.push(["aria-invalid", "true"]);
    attributes.push(["aria-describedby", errorId]);
  }

  return attributes;
}

export default function FormField(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("FormField: props invalides —", errors.join(", "));
  }

  const errorId = `${finalProps.id ?? "field"}-error`;
  const isCheckbox = finalProps.type === "checkbox";
  const isTextarea = finalProps.multiline && !isCheckbox;
  const attributes = controlAttributes(finalProps, errorId);

  if (!isTextarea) {
    attributes.push(["type", finalProps.type ?? "text"]);
  } else {
    attributes.push(["rows", finalProps.rows ?? 5]);
  }

  const control = {
    type: isTextarea ? "textarea" : "input",
    attributes,
    ...(isTextarea && finalProps.value ? { children: [finalProps.value] } : {}),
  };

  const label = {
    type: "label",
    attributes: [["class", ["form-field__label"]], ["for", finalProps.id ?? ""]],
    children: [finalProps.label ?? "Champ"],
  };

  const error = finalProps.error
    ? {
        type: "p",
        attributes: [["class", ["form-field__error"]], ["id", errorId]],
        children: [finalProps.error],
      }
    : null;

  return {
    type: "div",
    attributes: [
      [
        "class",
        [
          "form-field",
          ...(isCheckbox ? ["form-field--checkbox"] : []),
          ...(isTextarea ? ["form-field--textarea"] : []),
          ...(finalProps.error ? ["form-field--error"] : []),
        ],
      ],
    ],
    children: isCheckbox
      ? [control, label, ...[error].filter(Boolean)]
      : [label, control, ...[error].filter(Boolean)],
  };
}
