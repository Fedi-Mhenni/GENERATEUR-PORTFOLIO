// Données temporaires relevées dans le frame Figma « Desktop / Projects »
// (33:139). Elles seront remplacées par l'adaptation explicite de Strapi.
export const projectsTemporaryData = [
  {
    slug: "delivery-application",
    category: "WEB · SCHOOL PROJECT",
    title: "Delivery Application",
    description:
      "Designing the backend for a delivery application inspired by Uber Eats.",
    technologies: "JAVA · SPRING BOOT · JPA/HIBERNATE · H2",
  },
  {
    slug: "building-access-control",
    category: "IOT · SCHOOL PROJECT",
    title: "Building Access Control",
    description:
      "An Arduino-based secure access-control system with a Flask interface.",
    technologies: "ARDUINO · C · FLASK · IOT · PYTHON",
  },
];

export const projectsArchiveCopy = {
  eyebrow: "01 / ARCHIVE",
  title: "Projects",
  introduction:
    "A selection of school projects across web development and connected systems.",
};

// Fallback visuel si la requête profil Strapi échoue. Les destinations réelles
// sont adaptées depuis profil.linkedin, profil.github et profil.email.
export const footerContactTemporaryData = {
  title: "Contact",
  introduction:
    "Have a project, a question, or a thought to share? Send me a message.",
  formLabel: "Contact form",
  nameLabel: "Name",
  namePlaceholder: "Your name",
  emailLabel: "Email",
  emailPlaceholder: "name@example.com",
  messageLabel: "Message",
  messagePlaceholder: "Write your message…",
  consentLabel:
    "I agree that the information entered will be used to contact me back.",
  submitLabel: "Send message",
  illustrationSrc: "/assets/images/send_message.png",
  illustrationWidth: 861,
  illustrationHeight: 663,
  socialLinks: [
    {
      label: "LinkedIn",
      iconSrc: "/assets/images/linkedin_logo.png",
    },
    {
      label: "GitHub",
      iconSrc: "/assets/images/github_logo.png",
    },
    {
      label: "Mail",
      iconSrc: "/assets/images/mail_logo.avif",
    },
  ],
};
