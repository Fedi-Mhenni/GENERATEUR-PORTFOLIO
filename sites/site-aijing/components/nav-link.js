import BrowserLink from "../vanilla-engine/src/router/link.js";
import validateProps from "../vanilla-engine/src/validation/validate-props.js";

const schema = {
  href: { type: "string", required: true },
  label: { type: "string", required: true },
  current: { type: "boolean", required: false, default: false },
};

export default function NavLink(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("NavLink: props invalides —", errors.join(", "));
    return {
      type: "span",
      attributes: [["class", ["nav-link", "nav-link--invalid"]]],
      children: [finalProps.label ?? "Lien indisponible"],
    };
  }

  const link = BrowserLink(finalProps.href, finalProps.label);
  link.attributes.push([
    "class",
    ["nav-link", ...(finalProps.current ? ["nav-link--current"] : [])],
  ]);

  if (finalProps.current) {
    link.attributes.push(["aria-current", "page"]);
  }

  return link;
}
