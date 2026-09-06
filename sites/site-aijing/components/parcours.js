import validateProps from "../vanilla-engine/src/validation/validate-props.js";

const schema = {
  mediaPosition: { type: "string", required: false, default: "photo-left" },
  periodStart: { type: "string", required: true },
  periodEnd: { type: "string", required: true },
  title: { type: "string", required: true },
  company: { type: "string", required: false, default: "" },
  description: { type: "string", required: false, default: "" },
  mediaIndex: { type: "string", required: false, default: "" },
  mediaLabel: { type: "string", required: false, default: "" },
  imageUrl: { type: "string", required: false, default: "" },
  imageAlt: { type: "string", required: false, default: "" },
  imageWidth: { type: "number", required: false },
  imageHeight: { type: "number", required: false },
};

function image(props) {
  if (!props.imageUrl) {
    return null;
  }

  const attributes = [
    ["class", ["parcours__image"]],
    ["src", props.imageUrl],
    ["alt", props.imageAlt],
  ];

  if (props.imageWidth) {
    attributes.push(["width", props.imageWidth]);
  }

  if (props.imageHeight) {
    attributes.push(["height", props.imageHeight]);
  }

  return { type: "img", attributes };
}

export default function Parcours(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);
  const mediaPosition = finalProps.mediaPosition === "photo-right"
    ? "photo-right"
    : "photo-left";

  if (!valid || !["photo-left", "photo-right"].includes(finalProps.mediaPosition)) {
    console.error("Parcours: props invalides —", [
      ...errors,
      ...(!["photo-left", "photo-right"].includes(finalProps.mediaPosition)
        ? ["mediaPosition doit être photo-left ou photo-right"]
        : []),
    ].join(", "));
  }

  const mediaImage = image(finalProps);

  return {
    type: "article",
    attributes: [["class", ["parcours", `parcours--${mediaPosition}`]]],
    children: [
      {
        type: "div",
        attributes: [["class", ["parcours__story"]]],
        children: [
          {
            type: "div",
            attributes: [
              ["class", ["parcours__media"]],
              ...(!mediaImage ? [["aria-hidden", "true"]] : []),
            ],
            children: mediaImage
              ? [mediaImage]
              : [
                  {
                    type: "span",
                    attributes: [["class", ["parcours__media-index", "type-label"]]],
                    children: [finalProps.mediaIndex ?? ""],
                  },
                  {
                    type: "span",
                    attributes: [["class", ["parcours__media-label", "type-label"]]],
                    children: [finalProps.mediaLabel ?? ""],
                  },
                ],
          },
          {
            type: "div",
            attributes: [["class", ["parcours__content"]]],
            children: [
              {
                type: "h3",
                attributes: [["class", ["parcours__title", "type-heading-secondary"]]],
                children: [finalProps.title ?? "Parcours"],
              },
              ...(finalProps.company
                ? [{
                    type: "p",
                    attributes: [["class", ["parcours__company"]]],
                    children: [finalProps.company],
                  }]
                : []),
              ...(finalProps.description
                ? [{
                    type: "p",
                    attributes: [["class", ["parcours__description"]]],
                    children: [finalProps.description],
                  }]
                : []),
            ],
          },
        ],
      },
      {
        type: "p",
        attributes: [["class", ["parcours__period"]]],
        children: [
          finalProps.periodStart ?? "",
          ...(finalProps.periodEnd ? ["\n–\n", finalProps.periodEnd] : []),
        ],
      },
    ],
  };
}
