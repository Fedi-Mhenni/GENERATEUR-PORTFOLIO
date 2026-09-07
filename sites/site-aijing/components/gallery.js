import validateProps from "../vanilla-engine/src/validation/validate-props.js";

const schema = {
  images: { type: "array", required: true },
  label: { type: "string", required: false, default: "04 / PROJECT VIEWS" },
  title: { type: "string", required: false, default: "System fragments" },
};

function galleryImage(image, index) {
  const attributes = [
    ["class", ["gallery__image"]],
    ["src", image.url],
    ["alt", image.alt],
  ];

  if (image.width) {
    attributes.push(["width", image.width]);
  }

  if (image.height) {
    attributes.push(["height", image.height]);
  }

  return {
    type: "li",
    attributes: [["class", ["gallery__item"]]],
    children: [
      { type: "img", attributes },
      {
        type: "span",
        attributes: [["class", ["gallery__index", "type-label"]], ["aria-hidden", "true"]],
        children: [String(index + 1).padStart(2, "0")],
      },
    ],
  };
}

export default function Gallery(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);
  const images = Array.isArray(finalProps.images)
    ? finalProps.images.filter((image) => image?.url)
    : [];

  if (!valid) {
    console.error("Gallery: props invalides —", errors.join(", "));
  }

  if (!images.length) {
    return null;
  }

  return {
    type: "section",
    attributes: [["class", ["gallery"]]],
    children: [
      {
        type: "header",
        attributes: [["class", ["gallery__heading"]]],
        children: [
          {
            type: "p",
            attributes: [["class", ["gallery__label", "type-label"]]],
            children: [finalProps.label],
          },
          {
            type: "h2",
            attributes: [["class", ["gallery__title", "type-heading-secondary"]]],
            children: [finalProps.title],
          },
        ],
      },
      {
        type: "ol",
        attributes: [["class", ["gallery__strip"]]],
        children: images.map(galleryImage),
      },
    ],
  };
}
