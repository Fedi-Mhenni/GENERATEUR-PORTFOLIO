import { t } from "../i18n/index.js";

export default function Page404() {
  return {
    type: "main",
    attributes: [["class", ["page"]]],
    children: [
      { type: "h1", children: [t("notFound.title")] },
      { type: "p", children: [t("notFound.copy")] },
    ],
  };
}
