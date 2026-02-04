const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? 'AIzaSyAOocetOa5cEBuCHR7uvw3OPVk7-fmKgBY';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.5-flash';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.4,
  topP: 0.9,
  maxOutputTokens: 1024,
};

const buildPrompt = ({ vehicles, tripDetails }) => {
  const { destination, companions, duration, peopleCount, notes } = tripDetails;

  return [
    'Eres un asesor experto en alquiler de vehículos.',
    'Analiza el viaje usando los datos proporcionados y recomienda los 3 mejores vehículos disponibles.',
    'Responde exclusivamente en JSON válido con la siguiente estructura:',
    '{"recommendations":[{"id":"","name":"","reason":""}],"summary":""}',
    'Si no encuentras vehículos adecuados, explica por qué en "summary" y deja "recommendations" vacío.',
    'Datos del viaje:',
    `Destino: ${destination}`,
    `Acompañantes: ${companions}`,
    `Cantidad de personas: ${peopleCount}`,
    `Duración estimada: ${duration}`,
    `Notas adicionales: ${notes || 'Sin notas'}`,
    'Listado de vehículos disponibles en JSON:',
    JSON.stringify(vehicles, null, 2),
  ].join('\n');
};

const extractJson = (text = '') => {
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) {
    return trimmed;
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
};

const buildRequestBody = ({ vehicles, tripDetails }) => ({
  contents: [
    {
      role: 'user',
      parts: [{ text: buildPrompt({ vehicles, tripDetails }) }],
    },
  ],
  generationConfig: DEFAULT_GENERATION_CONFIG,
});

const parseRecommendations = (payload, fallbackText) => {
  if (!payload || typeof payload !== 'object') {
    return { summary: fallbackText, recommendations: [] };
  }

  const summary = typeof payload.summary === 'string' ? payload.summary : fallbackText;
  const recommendations = Array.isArray(payload.recommendations)
    ? payload.recommendations
        .filter(Boolean)
        .map((item) => ({
          id: item.id ?? '',
          name: item.name ?? '',
          reason: item.reason ?? '',
        }))
    : [];

  return { summary, recommendations };
};

const parseGeminiResponse = (data) => {
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini no devolvió contenido para la recomendación.');
  }

  const jsonText = extractJson(text);
  if (!jsonText) {
    return { summary: text, recommendations: [] };
  }

  try {
    return parseRecommendations(JSON.parse(jsonText), text);
  } catch {
    return { summary: text, recommendations: [] };
  }
};

const requestGemini = async ({ vehicles, tripDetails }) => {
  const response = await fetch(
    `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildRequestBody({ vehicles, tripDetails })),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al consultar Gemini: ${errorText}`);
  }

  return response.json();
};

export const getVehicleRecommendations = async ({ vehicles, tripDetails }) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Falta configurar VITE_GEMINI_API_KEY.');
  }

  const data = await requestGemini({ vehicles, tripDetails });
  return parseGeminiResponse(data);
};
