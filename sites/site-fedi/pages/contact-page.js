import BrowserLink from "../vanilla-engine/src/router/link.js";
import validateProps from "../vanilla-engine/src/validation/validate-props.js";
import sendEmail from "../vanilla-engine/src/email/index.js";
import config from "../config.js";

const schema = {
  nom: { type: "string", required: true },
  email: {
    type: "string",
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  objet: { type: "string", required: false },
  message: { type: "string", required: true, minLength: 10 },
};

function field(name, label, inputType) {
  const input =
    inputType === "textarea"
      ? { type: "textarea", attributes: [["name", name], ["id", name]] }
      : {
          type: "input",
          attributes: [
            ["type", inputType],
            ["name", name],
            ["id", name],
          ],
        };

  return {
    type: "div",
    children: [
      { type: "label", attributes: [["for", name]], children: [label] },
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
    objet: form.elements.objet.value,
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

export default function ContactPage() {
  return {
    type: "div",
    children: [
      BrowserLink("/", "← Retour à l'accueil"),
      { type: "h1", children: ["Contact"] },
      {
        type: "form",
        attributes: [["novalidate", "novalidate"]],
        events: [["submit", handleSubmit]],
        children: [
          field("nom", "Nom", "text"),
          field("email", "Email", "email"),
          field("objet", "Objet", "text"),
          field("message", "Message", "textarea"),
          {
            type: "button",
            attributes: [["type", "submit"]],
            children: ["Envoyer"],
          },
          {
            type: "p",
            attributes: [["class", ["form__feedback"]], ["data-feedback", "true"]],
            children: [""],
          },
        ],
      },
    ],
  };
}
