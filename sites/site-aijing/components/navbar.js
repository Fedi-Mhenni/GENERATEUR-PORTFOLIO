import BrowserLink from "../vanilla-engine/src/router/link.js";
import validateProps from "../vanilla-engine/src/validation/validate-props.js";
import NavLink from "./nav-link.js";

const schema = {
  currentPath: { type: "string", required: false, default: "" },
  brandLabel: { type: "string", required: false, default: "Aijing Li" },
  brandHref: { type: "string", required: false, default: "/" },
  contactLabel: { type: "string", required: false, default: "Contact" },
};

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about-me", label: "About" },
  { href: "/projects", label: "Projects" },
];

function scrollToContact(event) {
  const contact = document.getElementById("contact");

  if (!contact) {
    return;
  }

  event.preventDefault();
  contact.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState({}, "", "#contact");
}

export default function Navbar(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("Navbar: props invalides —", errors.join(", "));
  }

  const brand = BrowserLink(
    finalProps.brandHref ?? "/",
    finalProps.brandLabel ?? "Aijing Li",
  );
  brand.attributes.push(["class", ["navbar__brand"]]);

  return {
    type: "header",
    attributes: [["class", ["navbar"]]],
    children: [
      {
        type: "nav",
        attributes: [
          ["class", ["navbar__inner", "container"]],
          ["aria-label", "Navigation principale"],
        ],
        children: [
          brand,
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
        ],
      },
    ],
  };
}
