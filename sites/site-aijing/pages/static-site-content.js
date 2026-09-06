// Content owned by the frontend, its values are stable. Keep this separate from back

export const projectsArchiveCopy = {
  eyebrow: "01 / ARCHIVE",
  title: "Projects",
  introduction: "A selection of school projects and personal projects.",
};

export const homeCopy = {
  heroEyebrow: "01 /",
  heroTitle: "Aijing Li",
  heroIntroduction:
    "Creative developer and UI designer exploring thoughtful digital experiences.",
  heroCta: "ABOUT ME",
  latestProjectsEyebrow: "02 / SELECTED WORK",
  latestProjectsTitle: "Latest Projects",
  projectDetailLabel: "View project detail",
  projectsCta: "View all projects",
};

export const footerSocialLinkDefinitions = [
  {
    field: "linkedin",
    label: "LinkedIn",
    iconSrc: "/assets/images/linkedin_logo.png",
    newTab: true,
  },
  {
    field: "github",
    label: "GitHub",
    iconSrc: "/assets/images/github_logo.png",
    newTab: true,
  },
  {
    field: "email",
    label: "Mail",
    iconSrc: "/assets/images/mail_logo.avif",
    newTab: false,
  },
];

export const footerContactCopy = {
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
  socialLinks: footerSocialLinkDefinitions.map((definition) => ({
    label: definition.label,
    iconSrc: definition.iconSrc,
    newTab: definition.newTab,
  })),
};
