export function PropertyValidator(props) {
  for (const property of props) {
    if (property == null) return false;

    if (typeof property == "object")
      if (Object.keys(property).length == 0) return false;

    if (typeof property == "string")
      if (property.trim().length == 0) return false;
  }

  return true;
}
