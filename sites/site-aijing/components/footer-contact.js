import validateProps from "../vanilla-engine/src/validation/validate-props.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import Button from "./button.js";
import FormField from "./form-field.js";
import SocialLink from "./social-link.js";

const schema = {
  title: { type: "string", required: true },
  introduction: { type: "string", required: false, default: "" },
  formLabel: { type: "string", required: true },
  nameLabel: { type: "string", required: true },
  namePlaceholder: { type: "string", required: false, default: "" },
  emailLabel: { type: "string", required: true },
  emailPlaceholder: { type: "string", required: false, default: "" },
  messageLabel: { type: "string", required: true },
  messagePlaceholder: { type: "string", required: false, default: "" },
  consentLabel: { type: "string", required: true },
  submitLabel: { type: "string", required: true },
  idPrefix: { type: "string", required: false, default: "contact" },
  illustrationSrc: { type: "string", required: false, default: "" },
  illustrationAlt: { type: "string", required: false, default: "" },
  illustrationWidth: { type: "number", required: false },
  illustrationHeight: { type: "number", required: false },
  socialLinks: { type: "array", required: false, default: [] },
  onSubmit: { type: "function", required: false },
};

function contactIllustration(props) {
  if (!props.illustrationSrc) {
    return null;
  }

  const attributes = [
    ["class", ["footer-contact__illustration"]],
    ["src", props.illustrationSrc],
    ["alt", props.illustrationAlt],
  ];

  if (props.illustrationWidth) {
    attributes.push(["width", props.illustrationWidth]);
  }

  if (props.illustrationHeight) {
    attributes.push(["height", props.illustrationHeight]);
  }

  return {
    type: "img",
    attributes,
  };
}

function formStatus(form, message, type = "") {
  const status = form.querySelector(".footer-contact__form-status");

  if (!status) {
    return;
  }

  status.textContent = message;
  status.className = [
    "footer-contact__form-status",
    ...(type ? [`footer-contact__form-status--${type}`] : []),
  ].join(" ");
}

async function submitContactForm(event, onSubmit) {
  event.preventDefault();

  if (!onSubmit) {
    return;
  }

  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');

  form.setAttribute("aria-busy", "true");
  submitButton?.setAttribute("disabled", "");
  formStatus(form, "Sending message…");

  try {
    const result = await onSubmit(new FormData(form));

    if (result?.success) {
      form.reset();
      formStatus(form, "Message sent. Thank you!", "success");
      return;
    }

    formStatus(form, "Message could not be sent. Please try again.", "error");
  } catch (error) {
    console.error("Impossible d'envoyer le message.", error);
    formStatus(form, "Message could not be sent. Please try again.", "error");
  } finally {
    form.removeAttribute("aria-busy");
    submitButton?.removeAttribute("disabled");
  }
}

export default function FooterContact(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("FooterContact: props invalides —", errors.join(", "));
  }

  const prefix = finalProps.idPrefix ?? "contact";
  const illustration = contactIllustration(finalProps);
  const socialLinks = (finalProps.socialLinks ?? []).map((link) =>
    SocialLink(link),
  );

  return {
    type: "footer",
    attributes: [["class", ["footer-contact"]]],
    children: [
      {
        type: "section",
        attributes: [
          ["class", ["footer-contact__section", "container"]],
          ["id", "contact"],
          ["aria-labelledby", `${prefix}-title`],
        ],
        children: [
          {
            type: "div",
            attributes: [["class", ["footer-contact__introduction"]]],
            children: [
              {
                type: "h2",
                attributes: [
                  ["class", ["footer-contact__title"]],
                  ["id", `${prefix}-title`],
                ],
                children: [finalProps.title ?? "Contact"],
              },
              illustration,
              {
                type: "div",
                attributes: [["class", ["footer-contact__copy"]]],
                children: [
                  finalProps.introduction
                    ? {
                        type: "p",
                        attributes: [["class", ["footer-contact__introduction-copy"]]],
                        children: [finalProps.introduction],
                      }
                    : null,
                  socialLinks.length
                    ? {
                        type: "ul",
                        attributes: [["class", ["footer-contact__social-links"]]],
                        children: socialLinks.map((link) => ({
                          type: "li",
                          children: [link],
                        })),
                      }
                    : null,
                ].filter(Boolean),
              },
            ].filter(Boolean),
          },
          {
            type: "form",
            attributes: [
              ["class", ["footer-contact__form"]],
              ["aria-label", finalProps.formLabel ?? "Formulaire de contact"],
            ],
            events: [
              [
                "submit",
                (event) => submitContactForm(event, finalProps.onSubmit),
              ],
            ],
            children: [
              FormField({
                id: `${prefix}-name`,
                name: "name",
                label: finalProps.nameLabel ?? "Nom",
                placeholder: finalProps.namePlaceholder ?? "",
                autocomplete: "name",
                required: true,
              }),
              FormField({
                id: `${prefix}-email`,
                name: "email",
                label: finalProps.emailLabel ?? "E-mail",
                placeholder: finalProps.emailPlaceholder ?? "",
                type: "email",
                autocomplete: "email",
                required: true,
              }),
              FormField({
                id: `${prefix}-message`,
                name: "message",
                label: finalProps.messageLabel ?? "Message",
                placeholder: finalProps.messagePlaceholder ?? "",
                multiline: true,
                required: true,
              }),
              FormField({
                id: `${prefix}-consent`,
                name: "consent",
                label: "Privacy Policy acknowledgement",
                labelChildren: [
                  finalProps.consentLabel ?? "I have read and understood the",
                  " ",
                  BrowserLink("/privacy-page", "Privacy Policy"),
                  ".",
                ],
                type: "checkbox",
                required: true,
              }),
              Button({
                label: finalProps.submitLabel ?? "Envoyer",
                type: "submit",
              }),
              {
                type: "p",
                attributes: [
                  ["class", ["footer-contact__form-status"]],
                  ["role", "status"],
                  ["aria-live", "polite"],
                ],
                children: [],
              },
            ],
          },
        ],
      },
    ],
  };
}
