import BrowserLink from "../vanilla-engine/src/router/link.js";
import validateProps from "../vanilla-engine/src/validation/validate-props.js";

const schema = {
  previousHref: { type: "string", required: false, default: "" },
  nextHref: { type: "string", required: false, default: "" },
  previousLabel: { type: "string", required: false, default: "← Previous project" },
  nextLabel: { type: "string", required: false, default: "Next project →" },
};

function navigationLink(href, label) {
  if (!href) {
    return {
      type: "span",
      attributes: [
        ["class", ["button", "project-detail-pagination__link", "project-detail-pagination__link--disabled"]],
        ["aria-disabled", "true"],
      ],
      children: [label],
    };
  }

  const link = BrowserLink(href, label);
  link.attributes.push([
    "class",
    ["button", "project-detail-pagination__link"],
  ]);
  return link;
}

export default function ProjectDetailPagination(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("ProjectDetailPagination: props invalides —", errors.join(", "));
  }

  return {
    type: "nav",
    attributes: [
      ["class", ["project-detail-pagination"]],
      ["aria-label", "Project navigation"],
    ],
    children: [
      navigationLink(
        finalProps.previousHref ?? "",
        finalProps.previousLabel ?? "← Previous project",
      ),
      navigationLink(
        finalProps.nextHref ?? "",
        finalProps.nextLabel ?? "Next project →",
      ),
    ],
  };
}
