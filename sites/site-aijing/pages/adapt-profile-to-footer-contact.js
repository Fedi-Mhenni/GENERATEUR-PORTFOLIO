import { footerSocialLinkDefinitions } from "./static-site-content.js";

function nonEmptyString(value) {
  return typeof value === "string" ? value.trim() : "";
}

// This explicit adaptation keeps Strapi's field names out of UI components.
export default function adaptProfileToFooterContact(profile, footerCopy) {
  const socialLinks = footerSocialLinkDefinitions.flatMap((definition) => {
    const value = nonEmptyString(profile?.[definition.field]);

    if (!value) {
      return [];
    }

    return [
      {
        label: definition.label,
        iconSrc: definition.iconSrc,
        href: definition.field === "email" ? `mailto:${value}` : value,
        newTab: definition.newTab,
      },
    ];
  });

  return {
    ...footerCopy,
    socialLinks,
  };
}
