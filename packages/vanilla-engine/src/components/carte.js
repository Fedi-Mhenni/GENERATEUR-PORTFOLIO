import validateProps from "../validation/validate-props.js";
import { BrowserLink } from "../router/browser-router.js";

const schema = {
  titre: { type: "string", required: true },
  soustitre: { type: "string", required: false, default: "" },
  image: { type: "string", required: false, default: "" },
  description: { type: "string", required: false, default: "" },
  lien: { type: "string", required: true },
};

export default function Carte(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("Carte: props invalides —", errors.join(", "));
  }

  const titre = finalProps.titre ?? "";
  const soustitre = finalProps.soustitre ?? "";
  const image = finalProps.image ?? "";
  const description = finalProps.description ?? "";
  const lien = finalProps.lien ?? "";

  return {
    type: "div",
    attributes: [["class", ["carte-projet"]]],
    children: [
      {
        type: "img",
        attributes: [
          ["src", image],
          ["alt", titre],
        ],
      },
      {
        type: "h2",
        children: [titre],
      },
      {
        type: "p",
        attributes: [["class", ["soustitre"]]],
        children: [soustitre],
      },
      {
        type: "p",
        children: [description],
      },
      BrowserLink(lien, "Voir le projet"),
    ],
  };
}
