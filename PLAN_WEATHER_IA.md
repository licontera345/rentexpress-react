# Plan de Accion - Frontend React: Clima + Recomendacion IA

## Objetivo
Integrar dos servicios proxy del backend:
- Widget del clima en la creacion de reservas (sedes de recogida/devolucion)
- Panel de recomendacion IA en el catalogo publico (4 preguntas con radio buttons)

---

## Tarea 1: Configuracion de endpoints
- [ ] Anadir en `apiConfig.js`: WEATHER.BY_CITY y RECOMMENDATIONS.GET

## Tarea 2: Servicio del Clima
- [ ] Crear `api/services/WeatherService.js` - getByCity(cityName)
- [ ] Crear `hooks/misc/useWeatherWidget.js` - resuelve ciudad desde HQ, obtiene clima
- [ ] Crear `components/reservations/create/WeatherWidget.jsx` - tarjeta compacta del clima
- [ ] Integrar WeatherWidget en `ReservationCreateForm.jsx`

## Tarea 3: Servicio de Recomendacion IA
- [ ] Crear `api/services/RecommendationService.js` - getRecommendations(preferences, vehicles)
- [ ] Crear `hooks/public/useVehicleRecommendation.js` - estado de 4 preguntas + envio
- [ ] Crear `components/vehicle/catalog/VehicleRecommendationPanel.jsx` - panel con radios
- [ ] Integrar VehicleRecommendationPanel en `Catalog.jsx`

## Tarea 4: i18n
- [ ] Traducciones del clima en en.json, es.json, fr.json
- [ ] Traducciones de recomendacion IA en en.json, es.json, fr.json

## Tarea 5: Estilos
- [ ] Crear `styles/weather.css` (widget compacto, dark mode)
- [ ] Crear `styles/recommendation.css` (panel radios, dark mode)

## Las 4 Preguntas de Recomendacion
1. Tipo de destino: Ciudad | Playa/Costa | Montana/Campo
2. Pasajeros: 1-2 | 3-4 | 5+
3. Duracion: 1-3 dias | 4-7 dias | +1 semana
4. Carreteras: Buenas | Mixtas | Mal estado/sin asfaltar

## Principios
- El frontend NUNCA referencia proveedores externos (ni OpenWeatherMap ni Groq)
- Solo se comunica con nuestro REST API (/open/weather, /open/recommendations)
- Errores se muestran como mensajes genericos al usuario
