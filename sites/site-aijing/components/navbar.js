import BrowserLink from "../vanilla-engine/src/router/link.js";
import validateProps from "../vanilla-engine/src/validation/validate-props.js";
import LanguageSelector from "./language-selector.js";
import NavLink from "./nav-link.js";
import { pathFor, t } from "../i18n/index.js";

const schema = {
  currentPath: { type: "string", required: false, default: "" },
  brandLabel: { type: "string", required: false, default: "Aijing Li" },
  brandHref: { type: "string", required: false, default: "" },
  contactLabel: { type: "string", required: false, default: "Contact" },
  locale: { type: "string", required: false, default: "en" },
};

function scrollToContact(event) {
  const contact = document.getElementById("contact");

  if (!contact) {
    return;
  }

  event.preventDefault();
  contact.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState({}, "", "#contact");
}

function pageFromCurrentPath() {
  const pathname = window.location.pathname;
  const slugMatch = pathname.match(/^\/(?:en\/projects|fr\/projets)\/(.+)$/);

  if (slugMatch) {
    return { page: "project", params: { slug: decodeURIComponent(slugMatch[1]) } };
  }

  if (["/en/about-me", "/fr/a-propos"].includes(pathname)) {
    return { page: "about", params: {} };
  }

  if (["/en/projects", "/fr/projets"].includes(pathname)) {
    return { page: "projects", params: {} };
  }

  if (["/en/privacy-policy", "/fr/politique-de-confidentialite"].includes(pathname)) {
    return { page: "privacy", params: {} };
  }

  return { page: "home", params: {} };
}

function changeLanguage(locale) {
  const { page, params } = pageFromCurrentPath();
  window.history.pushState({}, "", `${pathFor(locale, page, params)}${window.location.search}`);
  window.dispatchEvent(new Event("pushstate"));
}

export default function Navbar(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("Navbar: props invalides —", errors.join(", "));
  }

  const brand = BrowserLink(
    finalProps.brandHref || pathFor(finalProps.locale, "home"),
    finalProps.brandLabel ?? "Aijing Li",
  );
  brand.attributes.push(["class", ["navbar__brand"]]);
  const navigationItems = [
    { href: pathFor(finalProps.locale, "home"), label: t("nav.home") },
    { href: pathFor(finalProps.locale, "about"), label: t("nav.about") },
    { href: pathFor(finalProps.locale, "projects"), label: t("nav.projects") },
  ];

  return {
    type: "header",
    attributes: [["class", ["navbar"]]],
    children: [
      {
        type: "nav",
        attributes: [
          ["class", ["navbar__inner", "container"]],
          ["aria-label", t("nav.primaryLabel")],
        ],
        children: [
          brand,
          {
            type: "div",
            attributes: [["class", ["navbar__actions"]]],
            children: [
              {
                type: "ul",
                attributes: [["class", ["navbar__links"]]],
                children: [
                  ...navigationItems.map((item) => ({
                    type: "li",
                    children: [
                      NavLink({
                        ...item,
                        current: finalProps.currentPath === item.href,
                      }),
                    ],
                  })),
                  {
                    type: "li",
                    children: [
                      {
                        type: "a",
                        attributes: [
                          ["class", ["nav-link"]],
                          ["href", "#contact"],
                        ],
                        events: [["click", scrollToContact]],
                        children: [finalProps.contactLabel ?? "Contact"],
                      },
                    ],
                  },
                ],
              },
              LanguageSelector({
                active: finalProps.locale,
                onChange: changeLanguage,
                ariaLabel: t("nav.languageLabel"),
              }),
            ],
          },
        ],
      },
    ],
  };
}
