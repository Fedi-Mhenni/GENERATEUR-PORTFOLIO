import config from "../config.js";
import sendEmail from "../vanilla-engine/src/email/index.js";

function fieldValue(formData, name) {
  const value = formData?.get?.(name);
  return typeof value === "string" ? value.trim() : "";
}

export default async function sendContactEmail(formData) {
  const result = await sendEmail(
    {
      nom: fieldValue(formData, "name"),
      email: fieldValue(formData, "email"),
      message: fieldValue(formData, "message"),
    },
    {
      serviceId: config.EMAILJS_SERVICE_ID,
      templateId: config.EMAILJS_TEMPLATE_ID,
      publicKey: config.EMAILJS_PUBLIC_KEY,
    },
  );

  if (!result.success) {
    console.error("EmailJS contact form request failed.", result.errors);
  }

  return result;
}
