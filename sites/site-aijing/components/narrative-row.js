import validateProps from "../vanilla-engine/src/validation/validate-props.js";

const schema = {
  label: { type: "string", required: true },
  title: { type: "string", required: true },
  copy: { type: "string", required: true },
};

export default function NarrativeRow(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("NarrativeRow: props invalides —", errors.join(", "));
  }

  return {
    type: "section",
    attributes: [["class", ["narrative-row"]]],
    children: [
      {
        type: "div",
        attributes: [["class", ["narrative-row__heading"]]],
        children: [
          {
            type: "p",
            attributes: [["class", ["narrative-row__label", "type-label"]]],
            children: [finalProps.label ?? ""],
          },
          {
            type: "h2",
            attributes: [["class", ["narrative-row__title", "type-heading-secondary"]]],
            children: [finalProps.title ?? ""],
          },
        ],
      },
      {
        type: "p",
        attributes: [["class", ["narrative-row__copy"]]],
        children: [finalProps.copy ?? ""],
      },
    ],
  };
}
