import { test } from "node:test";
import assert from "node:assert/strict";
import sendEmail from "../src/email/send-email.js";

const validFormData = { nom: "Azer", email: "azer@example.com", message: "Bonjour" };
const config = { serviceId: "service_1", templateId: "template_1", publicKey: "public_1" };

test("formData invalide (champ requis manquant) -> aucun appel réseau, success: false", async () => {
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = () => {
    called = true;
    return Promise.resolve({ ok: true });
  };

  const result = await sendEmail({ nom: "Azer" }, config);

  globalThis.fetch = originalFetch;

  assert.equal(called, false);
  assert.equal(result.success, false);
  assert.ok(result.errors.length > 0);
});

test("formData valide -> appelle l'API EmailJS avec service_id, template_id, user_id et template_params", async () => {
  const originalFetch = globalThis.fetch;
  let receivedUrl;
  let receivedOptions;
  globalThis.fetch = (url, options) => {
    receivedUrl = url;
    receivedOptions = options;
    return Promise.resolve({ ok: true });
  };

  await sendEmail(validFormData, config);

  globalThis.fetch = originalFetch;

  const body = JSON.parse(receivedOptions.body);
  assert.equal(receivedUrl, "https://api.emailjs.com/api/v1.0/email/send");
  assert.equal(body.service_id, "service_1");
  assert.equal(body.template_id, "template_1");
  assert.equal(body.user_id, "public_1");
  assert.deepEqual(body.template_params, validFormData);
});

test("réponse fetch ok -> success: true, errors: []", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => Promise.resolve({ ok: true });

  const result = await sendEmail(validFormData, config);

  globalThis.fetch = originalFetch;

  assert.equal(result.success, true);
  assert.deepEqual(result.errors, []);
});

test("réponse fetch non-ok -> success: false avec une erreur explicite incluant le status", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => Promise.resolve({ ok: false, status: 400 });

  const result = await sendEmail(validFormData, config);

  globalThis.fetch = originalFetch;

  assert.equal(result.success, false);
  assert.ok(result.errors[0].includes("400"));
});
