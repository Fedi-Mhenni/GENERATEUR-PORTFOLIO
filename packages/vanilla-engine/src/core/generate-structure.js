export default function generateStructure(structure) {
  const element = document.createElement(structure.type);
  if (structure.attributes) {
    for (let attribute of structure.attributes) {
      if (attribute[0] === "class") {
        for (let className of attribute[1]) {
          element.classList.add(className);
        }
      } else if (attribute[0] === "style") {
        const customStyle = Object.fromEntries(attribute[1]);
        element.style = Object.assign(element.style, customStyle);
      } else if (attribute[0].startsWith("data-")) {
        // dataset exige une clé camelCase ("pdfFeedback"), pas le kebab-case
        // de l'attribut HTML ("pdf-feedback") — sans conversion, affecter
        // dataset["pdf-feedback"] lève une exception (nom de propriété
        // invalide), ça plantait sur tout data-* à tiret multiple.
        const dataKey = attribute[0]
          .replace("data-", "")
          .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
        element.dataset[dataKey] = attribute[1];
      } else {
        element.setAttribute(attribute[0], attribute[1]);
      }
    }
  }

  if (structure.events) {
    for (let event of structure.events) {
      element.addEventListener(event[0], event[1]);
    }
  }

  if (structure.children) {
    for (let child of structure.children) {
      let childElement;
      if (typeof child === "string") {
        childElement = document.createTextNode(child);
      } else {
        childElement = generateStructure(child);
      }
      element.appendChild(childElement);
    }
  }

  return element;
}