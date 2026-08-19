import config from "../config.js";

export async function getProjets() {
  const response = await fetch(`${config.API_URL}/projets?populate=image`);
  const json = await response.json();
  return json.data;
}