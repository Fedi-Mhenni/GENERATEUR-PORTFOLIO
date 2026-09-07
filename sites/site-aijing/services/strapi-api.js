import config from "../config.js";

function normalizedLocale(locale) {
  // The public route uses the concise `/fr`, while this Strapi instance is
  // configured with the regional French locale (`fr-FR`). This function is
  // intentionally idempotent because the locale also passes through request()
  // after it has already been normalized by localizedResponse().
  return locale === "fr" || locale === "fr-FR" ? "fr-FR" : "en";
}

function endpointUrl(endpoint, locale) {
  const path = endpoint.replace(/^\//, "");
  const url = new URL(path, `${config.API_URL}/`);

  if (locale) {
    url.searchParams.set("locale", normalizedLocale(locale));
  }

  return url;
}

function hasData(data) {
  return Array.isArray(data) ? data.length > 0 : Boolean(data);
}

function debug(event, details) {
  if (config.IS_LOCAL_DEVELOPMENT) {
    console.info(`[Strapi] ${event}`, details);
  }
}

function fallbackWarning(endpoint, error) {
  if (!config.IS_LOCAL_DEVELOPMENT) {
    return;
  }

  console.warn(
    "[Strapi] French content is unavailable; displaying the English fallback.",
    { endpoint, ...(error ? { error: error.message } : {}) },
  );
}

async function request(endpoint, locale) {
  const url = endpointUrl(endpoint, locale);
  let response;

  try {
    response = await fetch(url);
  } catch (cause) {
    const error = new Error(`Unable to reach Strapi at ${url.toString()}.`);
    error.cause = cause;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(
      `Strapi returned HTTP ${response.status} for ${url.toString()}.`,
    );
    error.status = response.status;
    throw error;
  }

  const payload = await response.json();
  debug("response", {
    url: url.toString(),
    requestedLocale: locale,
    itemCount: Array.isArray(payload.data) ? payload.data.length : Number(Boolean(payload.data)),
    receivedLocales: Array.isArray(payload.data)
      ? [...new Set(payload.data.map((item) => item.locale).filter(Boolean))]
      : [payload.data?.locale].filter(Boolean),
  });

  return payload;
}

async function get(endpoint) {
  const json = await request(endpoint);
  return json.data;
}

async function localizedResponse(endpoint, locale = "en") {
  const requestedLocale = normalizedLocale(locale);
  const shouldFallbackToEnglish = locale === "fr";
  let response;

  try {
    response = await request(endpoint, requestedLocale);
  } catch (error) {
    // A failed request is a real application error. A 404 is the one expected
    // Strapi response when a single-type has no localisation yet.
    if (!shouldFallbackToEnglish || error.status !== 404) {
      throw error;
    }

    fallbackWarning(endpoint, error);
    return request(endpoint, "en");
  }

  if (shouldFallbackToEnglish && !hasData(response.data)) {
    fallbackWarning(endpoint);
    return request(endpoint, "en");
  }

  return response;
}

async function localizedGet(endpoint, locale = "en") {
  const response = await localizedResponse(endpoint, locale);
  return response.data;
}

export function getProfil(locale) {
  return localizedGet("/profil?populate=photo,cv", locale);
}

export function getProjets(locale) {
  return localizedGet("/projets?populate=image", locale);
}

export function getLatestProjets(locale) {
  const params = new URLSearchParams({
    populate: "image",
    "sort[0]": "date:desc",
    "pagination[page]": "1",
    "pagination[pageSize]": "3",
  });

  return localizedGet(`/projets?${params}`, locale);
}

export async function getProjetBySlug(slug, locale) {
  const params = new URLSearchParams({
    populate: "image,optional_images",
    "filters[slug][$eq]": slug,
    "pagination[pageSize]": "1",
  });
  const projects = await localizedGet(`/projets?${params}`, locale);

  if (!Array.isArray(projects) || projects.length === 0) {
    return null;
  }

  return projects[0];
}

export function getProjetsByDate(locale) {
  const params = new URLSearchParams({
    "sort[0]": "date:desc",
    "pagination[page]": "1",
    "pagination[pageSize]": "100",
  });

  return localizedGet(`/projets?${params}`, locale);
}

export function getProjetsPage({ page = 1, pageSize = 6, locale } = {}) {
  const params = new URLSearchParams({
    populate: "image",
    "sort[0]": "date:desc",
    "pagination[page]": String(page),
    "pagination[pageSize]": String(pageSize),
  });

  return localizedResponse(`/projets?${params}`, locale);
}

export function getExperiences(locale) {
  const params = new URLSearchParams({
    populate: "image",
    "sort[0]": "dateDebut:desc",
    "pagination[page]": "1",
    "pagination[pageSize]": "100",
  });

  return localizedGet(`/experiences?${params}`, locale);
}

export function getCompetences() {
  const params = new URLSearchParams({
    "sort[0]": "categorie:asc",
    "sort[1]": "nom:asc",
    "pagination[page]": "1",
    "pagination[pageSize]": "100",
  });

  return get(`/competences?${params}`);
}

export function getJourneys(locale) {
  const params = new URLSearchParams({
    populate: "image",
    "sort[0]": "date_debut:desc",
    "pagination[page]": "1",
    "pagination[pageSize]": "100",
  });

  return localizedGet(`/journeys?${params}`, locale);
}
