import SiteLayout from "../components/site-layout.js";
import getFooterContactProps from "./get-footer-contact-props.js";

export default async function HomePage() {
  const footerProps = await getFooterContactProps();

  return SiteLayout({
    currentPath: "/",
    mainClassName: "page page--pending",
    footerProps,
    mainChildren: [
      {
        type: "h1",
        children: ["Home"],
      },
      {
        type: "p",
        children: ["Cette page sera intégrée après Projects."],
      },
    ],
  });
}
