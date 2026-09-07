import SiteLayout from "../components/site-layout.js";
import getFooterContactProps from "./get-footer-contact-props.js";
import { t } from "../i18n/index.js";

const contactEmail = "aijing822li@outlook.com";

function paragraph(copy) {
  return { type: "p", children: [copy] };
}

function list(items) {
  return {
    type: "ul",
    children: items.map((item) => ({ type: "li", children: [item] })),
  };
}

function policySection(id, title, children) {
  return {
    type: "section",
    attributes: [["class", ["privacy-page__section"]], ["aria-labelledby", id]],
    children: [
      { type: "h2", attributes: [["id", id]], children: [title] },
      ...children,
    ],
  };
}

export default async function PrivacyPage({ locale = "en" } = {}) {
  const copy = t("privacy");
  const footerProps = await getFooterContactProps(locale);

  return SiteLayout({
    currentPath: "",
    mainClassName: "privacy-page",
    footerProps,
    locale,
    mainChildren: [
      {
        type: "article",
        attributes: [["class", ["privacy-page__content"]]],
        children: [
          {
            type: "header",
            attributes: [["class", ["privacy-page__header"]]],
            children: [
              { type: "p", attributes: [["class", ["type-label"]]], children: [copy.eyebrow] },
              { type: "h1", attributes: [["class", ["type-heading-primary"]]], children: [copy.title] },
              { type: "p", attributes: [["class", ["privacy-page__updated"]]], children: [copy.updated] },
              paragraph(copy.introduction),
            ],
          },
          policySection("privacy-controller", copy.controller.title, [
            paragraph(copy.controller.intro),
            paragraph("Aijing Li"),
            { type: "p", children: [copy.controller.email, " ", { type: "a", attributes: [["href", `mailto:${contactEmail}`]], children: [contactEmail] }] },
          ]),
          policySection("privacy-data", copy.data.title, [
            paragraph(copy.data.intro),
            list(copy.data.items),
            paragraph(copy.data.technical),
          ]),
          policySection("privacy-purpose", copy.purpose.title, [
            paragraph(copy.purpose.intro),
            list(copy.purpose.items),
            paragraph(copy.purpose.outro),
          ]),
          policySection("privacy-legal-basis", copy.legalBasis.title, [
            paragraph(copy.legalBasis.text),
            paragraph(copy.legalBasis.objection),
          ]),
          policySection("privacy-recipients", copy.recipients.title, [
            paragraph(copy.recipients.emailjs),
            paragraph(copy.recipients.mailbox),
            paragraph(copy.recipients.infrastructure),
          ]),
          policySection("privacy-retention", copy.retention.title, [
            paragraph(copy.retention.intro),
            paragraph(copy.retention.period),
          ]),
          policySection("privacy-cookies", copy.cookies.title, [
            paragraph(copy.cookies.none),
            paragraph(copy.cookies.banner),
          ]),
          policySection("privacy-security", copy.security.title, [
            paragraph(copy.security.measures),
            paragraph(copy.security.caveat),
          ]),
          policySection("privacy-transfers", copy.transfers.title, [
            paragraph(copy.transfers.location),
            paragraph(copy.transfers.safeguards),
          ]),
          policySection("privacy-rights", copy.rights.title, [
            paragraph(copy.rights.intro),
            list(copy.rights.items),
            { type: "p", children: [copy.rights.contact, " ", { type: "a", attributes: [["href", `mailto:${contactEmail}`]], children: [contactEmail] }, "."] },
          ]),
          policySection("privacy-complaint", copy.complaint.title, [
            paragraph(copy.complaint.intro),
            paragraph(copy.complaint.cnil),
            { type: "p", children: [{ type: "a", attributes: [["href", "https://www.cnil.fr/fr/plaintes"], ["target", "_blank"], ["rel", "noopener noreferrer"]], children: [copy.complaint.link] }] },
          ]),
          policySection("privacy-changes", copy.changes.title, [
            paragraph(copy.changes.text),
            paragraph(copy.changes.latest),
          ]),
          policySection("privacy-contact", copy.contact.title, [
            paragraph(copy.contact.intro),
            paragraph("Aijing Li"),
            { type: "p", children: [copy.controller.email, " ", { type: "a", attributes: [["href", `mailto:${contactEmail}`]], children: [contactEmail] }] },
          ]),
        ],
      },
    ],
  });
}
