const socialDefinitions = [
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

function nonEmptyString(value) {
  return typeof value === "string" ? value.trim() : "";
}

// This explicit adaptation keeps Strapi's field names out of UI components.
export default function adaptProfileToFooterContact(profile, footerCopy) {
  const socialLinks = socialDefinitions.flatMap((definition) => {
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
