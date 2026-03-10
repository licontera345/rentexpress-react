import { useEffect, useRef, useState, useCallback } from 'react';
import Config from '../../config/apiConfig';

const RECONNECT_DELAYS_MS = [2000, 5000, 10000, 30000];
const MAX_RECONNECT_ATTEMPTS = RECONNECT_DELAYS_MS.length;

/**
 * Hook para conectar al WebSocket de chat de soporte y enviar/recibir mensajes.
 * Reconecta automáticamente con backoff al cerrarse la conexión (salvo cierre por desmontaje).
 *
 * @param {number} conversationId - ID de la conversación (sala).
 * @param {string} token - JWT del usuario o empleado.
 * @param {Object} options - { onMessage(msg), onError(err), onOpen(), onClose() }
 * @returns {{
 *   sendMessage: (body: string) => void,
 *   readyState: number,
 *   connected: boolean,
 *   lastError: string | null
 * }}
 */
export function useChatSocket(conversationId, token, options = {}) {
  const { onMessage, onError, onOpen, onClose } = options;
  const [readyState, setReadyState] = useState(WebSocket.CLOSED);
  const [lastError, setLastError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptRef = useRef(0);
  const mountedRef = useRef(true);
  const connectRef = useRef(null);

  const connect = useCallback((isReconnect = false) => {
    if (!conversationId || !token) return;
    const url = Config.CHAT.wsUrl(conversationId, token);
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }
    if (!isReconnect) setLastError(null);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      reconnectAttemptRef.current = 0;
      setReadyState(WebSocket.OPEN);
      setLastError(null);
      onOpen?.();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          onError?.(new Error(data.error));
          setLastError(data.error);
          return;
        }
        onMessage?.(data);
      } catch {
        onMessage?.(event.data);
      }
    };

    ws.onerror = () => {
      const err = new Error('WebSocket error');
      onError?.(err);
      setLastError(err.message);
    };

    ws.onclose = () => {
      wsRef.current = null;
      setReadyState(WebSocket.CLOSED);
      onClose?.();
      if (!mountedRef.current) return;
      const attempt = reconnectAttemptRef.current;
      if (attempt >= MAX_RECONNECT_ATTEMPTS) return;
      const delay = RECONNECT_DELAYS_MS[attempt];
      reconnectAttemptRef.current = attempt + 1;
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectTimeoutRef.current = null;
        connectRef.current?.(true);
      }, delay);
    };
  }, [conversationId, token, onMessage, onError, onOpen, onClose]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    mountedRef.current = true;
    queueMicrotask(() => connect());
    return () => {
      mountedRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      reconnectAttemptRef.current = MAX_RECONNECT_ATTEMPTS;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setReadyState(WebSocket.CLOSED);
    };
  }, [connect]);

  const sendMessage = useCallback((body) => {
    if (!body || typeof body !== 'string' || !body.trim()) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setLastError('No conectado');
      return;
    }
    ws.send(JSON.stringify({ body: body.trim() }));
  }, []);

  const sendTyping = useCallback((typing) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: 'typing', typing: !!typing }));
  }, []);

  return {
    sendMessage,
    sendTyping,
    readyState,
    connected: readyState === WebSocket.OPEN,
    lastError,
    reconnect: () => { reconnectAttemptRef.current = 0; connect(); },
  };
}

export default useChatSocket;
