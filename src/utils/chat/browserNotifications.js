/**
 * Notificaciones del navegador para el chat (Notification API).
 * Se muestran cuando llega un mensaje y la pestaña no está visible.
 */

const NOTIFICATION_TAG = 'rentexpress-chat';

/**
 * Solicita permiso para mostrar notificaciones (si aún no está concedido).
 * @returns {Promise<'granted'|'denied'|'default'>}
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

/**
 * Comprueba si podemos mostrar notificaciones (permiso concedido).
 * @returns {boolean}
 */
export function canShowNotifications() {
  return typeof Notification !== 'undefined' && Notification.permission === 'granted';
}

/**
 * Muestra una notificación de escritorio por nuevo mensaje de chat.
 * @param {string} title - Título (ej: "Nuevo mensaje de Juan")
 * @param {string} body - Cuerpo del mensaje (preview, truncado)
 * @param {Object} [options] - Opciones adicionales para Notification
 */
export function showChatNotification(title, body, options = {}) {
  if (!canShowNotifications()) return;
  try {
    const notification = new Notification(title, {
      tag: NOTIFICATION_TAG,
      icon: options.icon || '/favicon.ico',
      body: (body || '').slice(0, 120) || title,
      requireInteraction: false,
      ...options,
    });
    const focusWindow = () => {
      window.focus();
      if (notification.close) notification.close();
    };
    notification.onclick = () => {
      focusWindow();
    };
    setTimeout(() => {
      if (notification.close) notification.close();
    }, 8000);
  } catch {
    // Silently ignore if notifications not supported or fail
  }
}

/**
 * Indica si la pestaña está oculta (usuario en otra pestaña o ventana).
 * @returns {boolean}
 */
export function isPageHidden() {
  return typeof document !== 'undefined' && document.hidden === true;
}

/**
 * Reproduce un sonido corto de notificación (nuevo mensaje).
 * Usa Web Audio API para no depender de archivos externos.
 */
export function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Silently ignore if AudioContext not supported
  }
}

export default {
  requestNotificationPermission,
  canShowNotifications,
  showChatNotification,
  isPageHidden,
  playNotificationSound,
};
