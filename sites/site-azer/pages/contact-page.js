import Sidebar from "../components/sidebar.js";
import sendEmail from "../vanilla-engine/src/email/index.js";
import CvLink from "../components/cv-link.js";
import { getProfil } from "../services/strapi-api.js";
import config from "../config.js";

const FIELDS = [
  { id: "contact-name", name: "nom", label: "Your name", type: "text", placeholder: "e.g. Jouini Azer" },
  {
    id: "contact-email",
    name: "email",
    label: "Your email",
    type: "email",
    placeholder: "e.g. hello@example.com",
  },
  { id: "contact-subject", name: "sujet", label: "Subject", type: "text", placeholder: "e.g. Project proposal" },
  {
    id: "contact-message",
    name: "message",
    label: "Your message",
    type: "textarea",
    placeholder: "Describe your project or request...",
  },
];

function contactItems(profil) {
  return [
    {
      icon: "icon-contact",
      title: "Email",
      value: profil?.email || "azerjouini74@gmail.com",
      colorClass: "contact-info-icon-primary",
    },
    { icon: "icon-phone", title: "Phone", value: "0611773247", colorClass: "contact-info-icon-success" },
    {
      icon: "icon-linkedin",
      title: "LinkedIn",
      value: profil?.linkedin || "https://www.linkedin.com/in/azer-jouini/",
      colorClass: "contact-info-icon-primary",
    },
    {
      icon: "icon-location",
      title: "Location",
      value: profil?.localisation || "Paris, France",
      colorClass: "contact-info-icon-dark",
    },
  ];
}

function contactInfoItem(item) {
  return {
    type: "li",
    attributes: [["class", ["contact-info-item"]]],
    children: [
      {
        type: "span",
        attributes: [["class", ["contact-info-icon", item.colorClass]]],
        children: [{ type: "span", attributes: [["class", ["icon", item.icon]]] }],
      },
      {
        type: "div",
        children: [
          { type: "h3", children: [item.title] },
          { type: "p", children: [item.value] },
        ],
      },
    ],
  };
}

function normalizeUrl(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function socialLink(url, label, iconClass) {
  return {
    type: "a",
    attributes: [
      ["href", normalizeUrl(url)],
      ["target", "_blank"],
      ["rel", "noopener noreferrer"],
      ["class", ["contact-social-link"]],
      ["aria-label", label],
    ],
    children: [{ type: "span", attributes: [["class", ["icon", iconClass]]] }],
  };
}

function socialLinks(profil) {
  return [
    profil?.github ? socialLink(profil.github, "GitHub", "icon-github") : null,
    profil?.linkedin ? socialLink(profil.linkedin, "LinkedIn", "icon-linkedin") : null,
  ].filter(Boolean);
}

function formField(field) {
  const errorId = `${field.id}-error`;

  return {
    type: "div",
    attributes: [["class", ["contact-form-field"]]],
    children: [
      { type: "label", attributes: [["for", field.id]], children: [field.label] },
      {
        type: field.type === "textarea" ? "textarea" : "input",
        attributes: [
          ...(field.type === "textarea" ? [] : [["type", field.type]]),
          ["id", field.id],
          ["name", field.name],
          ["class", ["input"]],
          ["placeholder", field.placeholder],
          ["aria-required", "true"],
          ["aria-describedby", errorId],
        ],
      },
      {
        type: "span",
        attributes: [["class", ["contact-form-error"]], ["id", errorId], ["role", "alert"]],
        children: [],
      },
    ],
  };
}

function clearFieldErrors() {
  for (const field of FIELDS) {
    const inputEl = document.getElementById(field.id);
    const errorEl = document.getElementById(`${field.id}-error`);
    if (inputEl) inputEl.removeAttribute("aria-invalid");
    if (errorEl) errorEl.textContent = "";
  }
}

function validateFields() {
  let firstInvalid = null;
  let valid = true;

  for (const field of FIELDS) {
    const inputEl = document.getElementById(field.id);
    const errorEl = document.getElementById(`${field.id}-error`);
    const value = inputEl.value.trim();

    if (!value) {
      valid = false;
      errorEl.textContent = `${field.label} is required.`;
      inputEl.setAttribute("aria-invalid", "true");
      if (!firstInvalid) {
        firstInvalid = inputEl;
      }
    }
  }

  if (firstInvalid) {
    firstInvalid.focus();
  }

  return valid;
}

async function handleSubmit(event) {
  event.preventDefault();
  clearFieldErrors();

  const statusEl = document.getElementById("contact-form-status");
  statusEl.textContent = "";
  statusEl.className = "contact-form-status";

  if (!validateFields()) {
    return;
  }

  const formData = {};
  for (const field of FIELDS) {
    formData[field.name] = document.getElementById(field.id).value.trim();
  }

  const submitButton = document.getElementById("contact-submit");
  const submitLabel = document.getElementById("contact-submit-label");
  submitButton.disabled = true;
  submitLabel.textContent = "Sending...";

  const result = await sendEmail(formData, {
    serviceId: config.EMAILJS_SERVICE_ID,
    templateId: config.EMAILJS_TEMPLATE_ID,
    publicKey: config.EMAILJS_PUBLIC_KEY,
  });

  submitButton.disabled = false;
  submitLabel.textContent = "Send message";

  if (result.success) {
    statusEl.textContent = "Message sent — thank you! I'll get back to you soon.";
    statusEl.classList.add("contact-form-status--success");
    for (const field of FIELDS) {
      document.getElementById(field.id).value = "";
    }
  } else {
    statusEl.textContent = "Something went wrong and your message wasn't sent. Please try again.";
    statusEl.classList.add("contact-form-status--error");
  }
}

export default async function ContactPage() {
  const profil = await getProfil();

  return {
    type: "div",
    attributes: [["class", ["page-layout"]]],
    children: [
      Sidebar(profil, "/contact"),
      {
        type: "main",
        attributes: [["class", ["contact-page"]]],
        children: [
          {
            type: "header",
            attributes: [["class", ["contact-header"]]],
            children: [
              {
                type: "div",
                attributes: [["class", ["contact-header-decor"]], ["aria-hidden", "true"]],
                children: [
                  { type: "span", attributes: [["class", ["contact-header-shape-1"]]] },
                  { type: "span", attributes: [["class", ["contact-header-shape-2"]]] },
                  { type: "span", attributes: [["class", ["contact-header-shape-3"]]] },
                ],
              },
              { type: "p", attributes: [["class", ["contact-label"]]], children: ["Contact"] },
              { type: "h1", children: ["Let's talk about your next project"] },
              {
                type: "p",
                attributes: [["class", ["contact-subtitle"]]],
                children: [
                  "Have an idea, an opportunity, or a project? Feel free to reach out — I'd love to hear from you.",
                ],
              },
            ],
          },
          {
            type: "div",
            attributes: [["class", ["contact-grid"]]],
            children: [
              {
                type: "section",
                attributes: [["class", ["contact-info-card"]]],
                children: [
                  { type: "h2", children: ["Contact Information"] },
                  {
                    type: "ul",
                    attributes: [["class", ["contact-info-list"]]],
                    children: contactItems(profil).map(contactInfoItem),
                  },
                ],
              },
              {
                type: "section",
                attributes: [["class", ["contact-form-card"]]],
                children: [
                  { type: "h2", children: ["Send me a message"] },
                  {
                    type: "form",
                    attributes: [["id", "contact-form"], ["novalidate", "true"]],
                    events: [["submit", handleSubmit]],
                    children: [
                      ...FIELDS.map(formField),
                      {
                        type: "button",
                        attributes: [["type", "submit"], ["id", "contact-submit"], ["class", ["contact-submit-button"]]],
                        children: [
                          { type: "span", attributes: [["class", ["icon", "icon-send"]]] },
                          { type: "span", attributes: [["id", "contact-submit-label"]], children: ["Send message"] },
                        ],
                      },
                      {
                        type: "p",
                        attributes: [
                          ["id", "contact-form-status"],
                          ["class", ["contact-form-status"]],
                          ["role", "status"],
                          ["aria-live", "polite"],
                        ],
                        children: [],
                      },
                    ],
                  },
                  {
                    type: "p",
                    attributes: [["class", ["contact-note"]]],
                    children: [
                      { type: "span", attributes: [["class", ["icon", "icon-hand"]]] },
                      { type: "span", children: ["I usually reply within 24 hours"] },
                    ],
                  },
                  {
                    type: "div",
                    attributes: [["class", ["contact-footer-actions"]]],
                    children: [
                      CvLink(profil, ["contact-download-cv"]),
                      {
                        type: "div",
                        attributes: [["class", ["contact-social-links"]], ["aria-label", "Social links"]],
                        children: socialLinks(profil),
                      },
                    ].filter(Boolean),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}
