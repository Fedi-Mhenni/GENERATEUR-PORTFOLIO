import validateProps from "../vanilla-engine/src/validation/validate-props.js";
import FooterContact from "./footer-contact.js";
import Navbar from "./navbar.js";
import TopLink from "./top-link.js";

const schema = {
  currentPath: { type: "string", required: true },
  mainClassName: { type: "string", required: true },
  mainChildren: { type: "array", required: true },
  footerProps: { type: "object", required: true },
};

export default function SiteLayout(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("SiteLayout: props invalides —", errors.join(", "));
  }

  return {
    type: "div",
    attributes: [["class", ["site-layout"]]],
    children: [
      {
        type: "a",
        attributes: [["class", ["skip-link"]], ["href", "#main-content"]],
        children: ["Aller au contenu principal"],
      },
      {
        type: "div",
        attributes: [["class", ["site-layout__top-target"]], ["id", "site-top"]],
      },
      Navbar({ currentPath: finalProps.currentPath ?? "" }),
      {
        type: "main",
        attributes: [
          ["class", ["site-layout__main", finalProps.mainClassName ?? ""]],
          ["id", "main-content"],
          ["tabindex", "-1"],
        ],
        children: finalProps.mainChildren ?? [],
      },
      FooterContact(finalProps.footerProps ?? {}),
      TopLink({ label: "TOP ↑", accessibleLabel: "Retour en haut" }),
    ],
  };
}
