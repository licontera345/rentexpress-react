const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? 'AIzaSyAbvNw4IbPlILEshPYvP3M6Q1mHTCkHP-Y';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-1.5-flash';

const buildPrompt = ({ vehicles, tripDetails }) => {
  const { destination, companions, duration, peopleCount, notes } = tripDetails;

  return [
    'Eres un asesor experto en alquiler de vehículos.',
    'Analiza el viaje y recomienda los 3 mejores vehículos del listado proporcionado.',
    'Tu respuesta debe ser exclusivamente un objeto JSON válido.',
    'Estructura requerida:',
    '{"recommendations":[{"id":"","name":"","reason":""}],"summary":""}',
    'Si no hay vehículos adecuados, explica por qué en "summary" y deja "recommendations" vacío.',
    '---',
    'DATOS DEL VIAJE:',
    `- Destino: ${destination}`,
    `- Acompañantes: ${companions}`,
    `- Personas: ${peopleCount}`,
    `- Duración: ${duration}`,
    `- Notas: ${notes || 'Sin notas adicionales'}`,
    '---',
    'LISTADO DE VEHÍCULOS DISPONIBLES:',
    JSON.stringify(vehicles),
  ].join('\n');
};

/**
 * Intenta extraer y limpiar el JSON de la respuesta.
 * Al usar responseMimeType: 'application/json', Gemini suele enviar el JSON limpio,
 * pero mantenemos esto por seguridad.
 */
const parseGeminiResponse = (text) => {
  try {
    // 1. Limpieza básica de caracteres invisibles o extraños
    let cleanText = text.trim();
    
    // 2. Eliminar bloques de código markdown si existieran (```json ... ```)
    if (cleanText.includes('```')) {
      cleanText = cleanText.replace(/```(?:json)?/g, '').replace(/```/g, '').trim();
    }

    // 3. Intentar parsear
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('[Gemini] Error crítico al parsear JSON:', error, 'Texto recibido:', text);
    // Retornamos un objeto válido para no romper el flujo de la app
    return { 
      recommendations: [], 
      summary: "Error al procesar las recomendaciones del asesor." 
    };
  }
};

export const getVehicleRecommendations = async ({ vehicles, tripDetails }) => {
  if (!GEMINI_API_KEY) {
    throw new Error('La API Key de Gemini no está configurada en las variables de entorno.');
  }

  if (!vehicles || vehicles.length === 0) {
    return { recommendations: [], summary: "No hay vehículos disponibles para analizar." };
  }

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: buildPrompt({ vehicles, tripDetails }) }],
      },
    ],
    generationConfig: {
      temperature: 0.1, // Temperatura baja para mayor precisión técnica
      maxOutputTokens: 1000,
      responseMimeType: 'application/json', // Fuerza a Gemini a responder en formato JSON
    },
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error API (${response.status}): ${errorData.error?.message || 'Error desconocido'}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Gemini devolvió una respuesta vacía.');
    }

    return parseGeminiResponse(rawText);

  } catch (error) {
    console.error('[Gemini Service Error]:', error);
    throw error;
  }
};