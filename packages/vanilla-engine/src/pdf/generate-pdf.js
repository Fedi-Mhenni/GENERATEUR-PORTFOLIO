import validateProps from "../validation/validate-props.js";

const schema = {
  filename: { type: "string", required: false, default: "document.pdf" },
};

export default function generatePdf(element, options) {
  const { valid, errors, props } = validateProps(options, schema);

  if (!valid) {
    return Promise.resolve({ success: false, errors });
  }

  return globalThis.html2pdf(element, { filename: props.filename }).then(() => ({
    success: true,
    errors: [],
  }));
}
