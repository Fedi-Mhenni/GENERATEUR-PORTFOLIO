import validateProps from "../validation/validate-props.js";

const schema = {
  nom: { type: "string", required: true },
  email: { type: "string", required: true },
  message: { type: "string", required: true },
};

export default async function sendEmail(formData, config) {
  const { valid, errors, props } = validateProps(formData, schema);

  if (!valid) {
    return { success: false, errors };
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: config.templateId,
      user_id: config.publicKey,
      template_params: props,
    }),
  });

  if (!response.ok) {
    return { success: false, errors: [`Envoi échoué (${response.status})`] };
  }

  return { success: true, errors: [] };
}
