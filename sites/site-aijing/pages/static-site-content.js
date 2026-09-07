import { getTranslations } from "../i18n/index.js";

// Content owned by the frontend remains separate from the Strapi data model.
export function getStaticSiteContent(locale) {
  const dictionary = getTranslations(locale);

  return {
    projectsArchiveCopy: {
      eyebrow: dictionary.projects.eyebrow,
      title: dictionary.projects.title,
      introduction: dictionary.projects.introduction,
    },
    homeCopy: dictionary.home,
    footerContactCopy: {
      ...dictionary.contact,
      consentLabel: dictionary.contact.acknowledgement,
      submitLabel: dictionary.contact.submit,
      illustrationSrc: "/assets/images/send_message.png",
      illustrationWidth: 861,
      illustrationHeight: 663,
    },
    footerSocialLinkDefinitions: [
      { field: "linkedin", label: dictionary.social.linkedin, iconSrc: "/assets/images/linkedin_logo.png", newTab: true },
      { field: "github", label: dictionary.social.github, iconSrc: "/assets/images/github_logo.png", newTab: true },
      { field: "email", label: dictionary.social.email, iconSrc: "/assets/images/mail_logo.avif", newTab: false },
    ],
  };
}
