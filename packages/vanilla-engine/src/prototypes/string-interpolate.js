const PLACEHOLDER_REGEX = /\{\{\s*([\w.]+)\s*\}\}/g;

export function resolvePath(path, data) {
  return path.split(".").reduce((value, key) => {
    if (value === null || value === undefined) {
      return undefined;
    }
    return value[key];
  }, data);
}

String.prototype.interpolate = function (data) {
  return this.replace(PLACEHOLDER_REGEX, (match, path) => {
    const value = resolvePath(path, data);
    return value === undefined || value === null ? "" : String(value);
  });
};
