import validateProps from "../vanilla-engine/src/validation/validate-props.js";

const schema = {
  src: { type: "string", required: true },
  width: { type: "number", required: true },
  height: { type: "number", required: true },
};

export default function AmbientBlur(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("AmbientBlur: props invalides —", errors.join(", "));
    return {
      type: "div",
      attributes: [["class", ["ambient-blur"]], ["aria-hidden", "true"]],
    };
  }

  return {
    type: "img",
    attributes: [
      ["class", ["ambient-blur"]],
      ["src", finalProps.src],
      ["alt", ""],
      ["aria-hidden", "true"],
      ["width", finalProps.width],
      ["height", finalProps.height],
    ],
  };
}
