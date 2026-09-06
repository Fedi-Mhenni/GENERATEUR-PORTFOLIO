import validateProps from "../vanilla-engine/src/validation/validate-props.js";

const schema = {
  title: { type: "string", required: true },
  items: { type: "string", required: true },
};

export default function SkillGroup(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("SkillGroup: props invalides —", errors.join(", "));
  }

  return {
    type: "section",
    attributes: [["class", ["skill-group"]]],
    children: [
      {
        type: "h3",
        attributes: [["class", ["skill-group__title", "type-heading-secondary"]]],
        children: [finalProps.title ?? "Skills"],
      },
      {
        type: "p",
        attributes: [["class", ["skill-group__items"]]],
        children: [finalProps.items ?? ""],
      },
    ],
  };
}
