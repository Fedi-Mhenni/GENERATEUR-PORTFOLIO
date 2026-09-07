import SiteLayout from "../components/site-layout.js";
import getFooterContactProps from "./get-footer-contact-props.js";

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

export default async function PrivacyPage() {
  const footerProps = await getFooterContactProps();

  return SiteLayout({
    currentPath: "",
    mainClassName: "privacy-page",
    footerProps,
    mainChildren: [
      {
        type: "article",
        attributes: [["class", ["privacy-page__content"]]],
        children: [
          {
            type: "header",
            attributes: [["class", ["privacy-page__header"]]],
            children: [
              { type: "p", attributes: [["class", ["type-label"]]], children: ["LEGAL / PRIVACY"] },
              { type: "h1", attributes: [["class", ["type-heading-primary"]]], children: ["Privacy Policy"] },
              { type: "p", attributes: [["class", ["privacy-page__updated"]]], children: ["Last updated: September 7, 2026"] },
              paragraph("This Privacy Policy explains how this website processes the personal data of visitors and people who use the contact form, in accordance with the General Data Protection Regulation (\"GDPR\")."),
            ],
          },
          policySection("privacy-controller", "1. Data Controller", [
            paragraph("The data controller is:"),
            paragraph("Aijing Li"),
            { type: "p", children: ["Email: ", { type: "a", attributes: [["href", `mailto:${contactEmail}`]], children: [contactEmail] }] },
          ]),
          policySection("privacy-data", "2. Personal Data Collected", [
            paragraph("When you use the contact form, the following data may be collected:"),
            list(["Your name", "Your email address", "The content of your message"]),
            paragraph("Technical information, such as your IP address and browser information, may also be processed by the hosting provider and EmailJS for security and service-operation purposes."),
          ]),
          policySection("privacy-purpose", "3. Purpose of Processing", [
            paragraph("Your personal data is used only to:"),
            list(["Read and respond to your message;", "Communicate with you about your request;", "Protect the website and email service against misuse, spam, or security incidents."]),
            paragraph("Your data is not used for advertising, profiling, newsletters, or sold to third parties."),
          ]),
          policySection("privacy-legal-basis", "4. Legal Basis", [
            paragraph("The processing of contact-form data is based on the legitimate interest of the website owner to respond to messages and requests received through the website."),
            paragraph("You may object to this processing at any time by contacting us."),
          ]),
          policySection("privacy-recipients", "5. Recipients of the Data", [
            paragraph("Your message is sent through EmailJS, an email-delivery service acting as a processor."),
            paragraph("The message is then received in the data controller’s email inbox. It is not stored in a database on this website."),
            paragraph("Personal data may also be processed by the website hosting provider and the Strapi API provider, where necessary to operate and secure the website."),
          ]),
          policySection("privacy-retention", "6. Retention Period", [
            paragraph("Contact-form messages are kept only for the time necessary to handle your request."),
            paragraph("Messages are deleted no later than 12 months after the last exchange, unless a longer retention period is necessary to comply with a legal obligation or to establish, exercise, or defend legal claims."),
          ]),
          policySection("privacy-cookies", "7. Cookies and Tracking Technologies", [
            paragraph("This website does not currently use advertising cookies, analytics cookies, or other tracking technologies."),
            paragraph("No cookie-consent banner is required while no non-essential cookies or trackers are used. If this changes, this policy will be updated and consent will be requested where required."),
          ]),
          policySection("privacy-security", "8. Data Security", [
            paragraph("Appropriate technical and organisational measures are used to protect personal data against unauthorised access, loss, alteration, or disclosure."),
            paragraph("However, no transmission of data over the internet can be guaranteed to be completely secure."),
          ]),
          policySection("privacy-transfers", "9. International Data Transfers", [
            paragraph("EmailJS may process personal data outside the European Economic Area, including in the United States."),
            paragraph("Where such transfers take place, appropriate safeguards are used by EmailJS, such as Standard Contractual Clauses, in accordance with applicable data-protection law."),
          ]),
          policySection("privacy-rights", "10. Your Rights", [
            paragraph("Under the GDPR, you have the right to:"),
            list(["Access your personal data;", "Request correction of inaccurate data;", "Request deletion of your data;", "Request restriction of processing;", "Object to processing;", "Request portability of your data, where applicable."]),
            { type: "p", children: ["To exercise these rights, contact: ", { type: "a", attributes: [["href", `mailto:${contactEmail}`]], children: [contactEmail] }, "."] },
          ]),
          policySection("privacy-complaint", "11. Right to Lodge a Complaint", [
            paragraph("If you believe that your personal data has not been processed in accordance with applicable law, you may lodge a complaint with the French data-protection authority:"),
            paragraph("CNIL — Commission Nationale de l’Informatique et des Libertés"),
            { type: "p", children: [{ type: "a", attributes: [["href", "https://www.cnil.fr/fr/plaintes"], ["target", "_blank"], ["rel", "noopener noreferrer"]], children: ["Visit the CNIL complaints page (opens in a new tab)"] }] },
          ]),
          policySection("privacy-changes", "12. Changes to This Policy", [
            paragraph("This Privacy Policy may be updated when the website, its services, or applicable legal requirements change."),
            paragraph("The latest version will always be available on this page."),
          ]),
          policySection("privacy-contact", "13. Contact", [
            paragraph("For any question about this Privacy Policy or the processing of your personal data, please contact:"),
            paragraph("Aijing Li"),
            { type: "p", children: ["Email: ", { type: "a", attributes: [["href", `mailto:${contactEmail}`]], children: [contactEmail] }] },
          ]),
        ],
      },
    ],
  });
}
