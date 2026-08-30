export default function validateProps(props, schema) {
  const errors = [];
  const finalProps = { ...props };

  for (let [key, rule] of Object.entries(schema)) {
    const hasValue = props[key] !== undefined && props[key] !== null;
    const isEmptyRequired = rule.required && props[key] === "";

    if (!hasValue || isEmptyRequired) {
      if (rule.required) {
        errors.push(`${key} est requis`);
      } else if ("default" in rule) {
        finalProps[key] = rule.default;
      }
      continue;
    }

    if (rule.type) {
      const actualType = getActualType(props[key]);
      if (actualType !== rule.type) {
        errors.push(`${key} doit être un ${rule.type}, reçu ${actualType}`);
      }
    }

    // pattern/minLength supposent une string : sans ce garde-fou, un array
    // (qui a aussi .length) ou un objet/nombre (coercé en chaîne par
    // RegExp.test) pourrait silencieusement passer ou échouer ces
    // vérifications sans rapport avec la vraie valeur — pas un crash, mais
    // un résultat trompeur. La vérification "type" reste seule responsable
    // de signaler l'erreur pour une valeur mal typée.
    if (typeof props[key] === "string") {
      if (rule.pattern && !rule.pattern.test(props[key])) {
        errors.push(`${key} ne respecte pas le format attendu`);
      }

      if (rule.minLength && props[key].length < rule.minLength) {
        errors.push(`${key} doit contenir au moins ${rule.minLength} caractères`);
      }
    }
  }

  return { valid: errors.length === 0, errors, props: finalProps };
}

function getActualType(value) {
  if (Array.isArray(value)) {
    return "array";
  }
  return typeof value;
}
