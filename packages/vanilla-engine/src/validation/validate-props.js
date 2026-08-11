export default function validateProps(props, schema) {
  const errors = [];
  const finalProps = { ...props };

  for (let [key, rule] of Object.entries(schema)) {
    const hasValue = props[key] !== undefined;

    if (!hasValue) {
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
  }

  return { valid: errors.length === 0, errors, props: finalProps };
}

function getActualType(value) {
  if (Array.isArray(value)) {
    return "array";
  }
  return typeof value;
}
