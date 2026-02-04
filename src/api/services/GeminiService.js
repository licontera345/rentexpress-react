const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? 'AIzaSyAOocetOa5cEBuCHR7uvw3OPVk7-fmKgBY';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.5-flash';

const buildPrompt = ({ vehicles, tripDetails }) => {
  const { destination, companions, duration, peopleCount, notes } = tripDetails;

  const prompt = [
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

  console.info('[Gemini] Prompt construido', {
    destination,
    companions,
    duration,
    peopleCount,
    notes: notes || 'Sin notas',
    vehiclesCount: vehicles.length,
    promptPreview: `${prompt.slice(0, 500)}${prompt.length > 500 ? '...' : ''}`,
  });

  return prompt;
};

const extractJson = (text) => {
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) {
    return trimmed;
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
};

export const getVehicleRecommendations = async ({ vehicles, tripDetails }) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Falta configurar VITE_GEMINI_API_KEY.');
  }

  console.info('[Gemini] Iniciando recomendación', {
    model: GEMINI_MODEL,
    vehiclesCount: vehicles.length,
    tripDetails,
  });

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: buildPrompt({ vehicles, tripDetails }) }],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
  };

  console.info('[Gemini] Enviando solicitud', {
    endpoint: `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    generationConfig: requestBody.generationConfig,
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Gemini] Error en la respuesta', {
      status: response.status,
      statusText: response.statusText,
      errorText,
    });
    throw new Error(`Error al consultar Gemini: ${errorText}`);
  }

  const data = await response.json();
  console.info('[Gemini] Respuesta recibida', {
    status: response.status,
    data,
  });
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.warn('[Gemini] Respuesta sin contenido', { data });
    throw new Error('Gemini no devolvió contenido para la recomendación.');
  }

  const jsonText = extractJson(text);
  if (!jsonText) {
    console.warn('[Gemini] No se encontró JSON en la respuesta', { text });
    return { summary: text, recommendations: [] };
  }

  try {
    const parsed = JSON.parse(jsonText);
    console.info('[Gemini] JSON parseado', { parsed });
    return parsed;
  } catch {
    console.warn('[Gemini] Fallo al parsear JSON', { jsonText });
    return { summary: text, recommendations: [] };
  }
};
