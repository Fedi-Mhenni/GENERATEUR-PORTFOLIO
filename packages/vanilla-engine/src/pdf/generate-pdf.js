import validateProps from "../validation/validate-props.js";

const schema = {
  filename: { type: "string", required: false, default: "document.pdf" },
};

export default async function generatePdf(element, options) {
  const { valid, errors, props } = validateProps(options, schema);

  if (!valid) {
    return { success: false, errors };
  }

  if (typeof globalThis.html2pdf !== "function") {
    return { success: false, errors: ["html2pdf.js n'est pas chargé (globalThis.html2pdf est absent)"] };
  }

  try {
    await globalThis.html2pdf(element, { filename: props.filename });
    return { success: true, errors: [] };
  } catch (error) {
    return { success: false, errors: [error.message] };
  }
}
