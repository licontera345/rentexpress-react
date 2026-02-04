import { useEffect, useMemo, useRef, useState } from 'react';
import apiConfig from '../../config/apiConfig';
import '../../styles/chatDemo.css';

// Componente Chat Demo que encapsula la interfaz y la lógica principal de esta sección.

const DEFAULT_ROOM = 'room_01';

const safeParse = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return {
      sender: 'system',
      content: raw,
      timestamp: new Date().toISOString(),
    };
  }
};

function ChatDemo() {
  const [roomId, setRoomId] = useState(DEFAULT_ROOM);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState('');
  const socketRef = useRef(null);

  const wsUrl = useMemo(() => {
    const configuredBase = import.meta.env.VITE_WS_BASE_URL;
    const apiBase = configuredBase || apiConfig.API_BASE_URL;
    const wsBase = apiBase.replace(/^https?:\/\//i, (match) => (match.toLowerCase() === 'https://' ? 'wss://' : 'ws://'))
                          .replace(/\/api\/?$/i, '');

    return `${wsBase}/ws/chat/${roomId}`;
  }, [roomId]);

  useEffect(() => {
    if (!roomId) {
      return undefined;
    }

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = (event) => {
      const message = safeParse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    socketRef.current.onerror = () => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'system',
          content: 'No se pudo conectar con el servidor WebSocket.',
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomId, wsUrl]);

  const handleSend = () => {
    if (!text.trim()) {
      return;
    }

    const msg = {
      roomId,
      sender: user || 'anon',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
      setText('');
    }
  };

  return (
    <div className="chat-demo">
      <header className="chat-demo__header">
        <div>
          <p className="chat-demo__eyebrow">Demo WebSocket</p>
          <h1>Chat de prueba</h1>
          <p className="chat-demo__subtitle">
            Cambia la sala, conecta y envía mensajes para validar el flujo en tiempo real.
          </p>
        </div>
        <div className="chat-demo__connection">
          <span className="chat-demo__label">Endpoint</span>
          <code>{wsUrl}</code>
        </div>
      </header>

      <section className="chat-demo__panel">
        <div className="chat-demo__form">
          <label htmlFor="room">
            Sala
            <input
              id="room"
              value={roomId}
              onChange={(event) => setRoomId(event.target.value)}
              placeholder="room_01"
            />
          </label>
          <label htmlFor="sender">
            Remitente
            <input
              id="sender"
              value={user}
              onChange={(event) => setUser(event.target.value)}
              placeholder="Tu nombre"
            />
          </label>
          <label htmlFor="message">
            Mensaje
            <input
              id="message"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Escribe un mensaje"
            />
          </label>
          <button type="button" onClick={handleSend}>
            Enviar
          </button>
        </div>

        <div className="chat-demo__messages">
          <h2>Mensajes</h2>
          {messages.length === 0 ? (
            <p className="chat-demo__empty">No hay mensajes todavía.</p>
          ) : (
            messages.map((message, index) => (
              <div key={`${message.timestamp}-${index}`} className="chat-demo__message">
                <strong>{message.sender}</strong>
                <span>{message.content}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default ChatDemo;
