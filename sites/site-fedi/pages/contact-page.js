import { getProfil } from "../services/strapi-api.js";
import validateProps from "../vanilla-engine/src/validation/validate-props.js";
import sendEmail from "../vanilla-engine/src/email/index.js";
import config from "../config.js";
import Navbar from "../components/navbar.js";
import Footer from "../components/footer.js";
import ExportPdfButton from "../components/export-pdf-button.js";

// Maquette Figma (node 223:760) : 3 champs (Name, Email, Message) — pas de
// champ "Objet", retiré ici pour rester fidèle (il existait avant, purement
// optionnel, mais absent du design).
const schema = {
  nom: { type: "string", required: true },
  email: {
    type: "string",
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  message: { type: "string", required: true, minLength: 10 },
};

function field(name, label, inputType) {
  const input =
    inputType === "textarea"
      ? {
          type: "textarea",
          attributes: [["class", ["contact__input", "contact__input--textarea"]], ["name", name], ["id", name]],
        }
      : {
          type: "input",
          attributes: [
            ["class", ["contact__input"]],
            ["type", inputType],
            ["name", name],
            ["id", name],
          ],
        };

  return {
    type: "div",
    attributes: [["class", ["contact__field"]]],
    children: [
      { type: "label", attributes: [["class", ["contact__label"]], ["for", name]], children: [label] },
      input,
      {
        type: "p",
        attributes: [["class", ["erreur-champ"]], ["data-champ", name]],
        children: [""],
      },
    ],
  };
}

// Réinitialise le message de résultat (texte + classe d'état) avant un
// nouvel envoi ou pour afficher un nouveau résultat.
function setFeedback(feedback, texte, etat) {
  feedback.textContent = texte;
  feedback.className = "form__feedback" + (etat ? ` form__feedback--${etat}` : "");
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const feedback = form.querySelector("[data-feedback]");

  const values = {
    nom: form.elements.nom.value,
    email: form.elements.email.value,
    message: form.elements.message.value,
  };

  const { valid, errors } = validateProps(values, schema);

  // Réinitialise les messages d'un éventuel envoi précédent avant de réafficher.
  form.querySelectorAll("[data-champ]").forEach((element) => {
    element.textContent = "";
  });
  setFeedback(feedback, "");

  if (!valid) {
    for (const champ of Object.keys(schema)) {
      const erreur = errors.find((error) => error.startsWith(`${champ} `));
      if (erreur) {
        form.querySelector(`[data-champ="${champ}"]`).textContent = erreur;
      }
    }
    return;
  }

  setFeedback(feedback, "Envoi en cours…");

  const { success, errors: sendErrors } = await sendEmail(values, config.EMAILJS);

  if (success) {
    setFeedback(feedback, "Message envoyé avec succès !", "success");
    form.reset();
  } else {
    setFeedback(feedback, sendErrors?.[0] ?? "Échec de l'envoi, réessaie plus tard.", "error");
  }
}

export default async function ContactPage() {
  const profilData = await getProfil();
  const profil = profilData?.attributes ?? profilData;
  const footer = await Footer();

  return {
    type: "div",
    attributes: [["class", ["page"]]],
    children: [
      Navbar(),
      ExportPdfButton(),
      {
        type: "main",
        attributes: [["class", ["container", "contact", "page__content"]]],
        children: [
          {
            type: "section",
            attributes: [["class", ["contact__intro"]]],
            children: [
              { type: "h1", attributes: [["class", ["contact__title"]]], children: ["Let's build something together"] },
              {
                type: "p",
                attributes: [["class", ["contact__tagline"]]],
                children: ["Got a project in mind, or just want to say hi? My inbox is open."],
              },
              {
                type: "div",
                attributes: [["class", ["contact__meta"]]],
                children: [
                  ...(profil?.email
                    ? [
                        {
                          type: "span",
                          attributes: [["class", ["contact__meta-item"]]],
                          children: [
                            { type: "span", attributes: [["class", ["contact__meta-icon"]]], children: ["✉"] },
                            profil.email,
                          ],
                        },
                      ]
                    : []),
                  ...(profil?.localisation
                    ? [
                        {
                          type: "span",
                          attributes: [["class", ["contact__meta-item"]]],
                          children: [
                            { type: "span", attributes: [["class", ["contact__meta-icon"]]], children: ["⌂"] },
                            profil.localisation,
                          ],
                        },
                      ]
                    : []),
                ],
              },
            ],
          },
          {
            type: "form",
            attributes: [["class", ["contact__form"]], ["novalidate", "novalidate"]],
            events: [["submit", handleSubmit]],
            children: [
              field("nom", "Name", "text"),
              field("email", "Email", "email"),
              field("message", "Message", "textarea"),
              {
                type: "button",
                attributes: [["type", "submit"], ["class", ["btn", "btn--primary", "btn--large", "contact__submit"]]],
                children: ["Send message"],
              },
              {
                type: "p",
                attributes: [["class", ["form__feedback"]], ["data-feedback", "true"]],
                children: [""],
              },
            ],
          },
        ],
      },
      footer,
    ],
  };
}
