import { getProfil } from "../services/strapi-api.js";
import adaptProfileToFooterContact from "./adapt-profile-to-footer-contact.js";
import sendContactEmail from "../services/send-contact-email.js";
import { getStaticSiteContent } from "./static-site-content.js";
import { pathFor } from "../i18n/index.js";

export function getFooterContactPropsFromProfile(profile, locale = "en") {
  const content = getStaticSiteContent(locale);

  return {
    ...adaptProfileToFooterContact(
      profile,
      content.footerContactCopy,
      content.footerSocialLinkDefinitions,
    ),
    privacyHref: pathFor(locale, "privacy"),
    onSubmit: sendContactEmail,
  };
}

// The footer remains usable without Strapi; only social links are omitted.
export default async function getFooterContactProps(locale = "en") {
  try {
    const profile = await getProfil();
    return getFooterContactPropsFromProfile(profile, locale);
  } catch (error) {
    console.error("Impossible de charger les liens sociaux Strapi.", error);
    return getFooterContactPropsFromProfile(null, locale);
  }
}
