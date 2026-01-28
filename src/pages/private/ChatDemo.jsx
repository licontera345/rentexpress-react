import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_ROOM = 'room_01';

const safeParse = (raw) => {
  try {
    return JSON.parse(raw);
  } catch (error) {
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
    const baseUrl = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080/restapi';
    return `${baseUrl}/ws/chat/${roomId}`;
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
    <div className="page-container">
      <h1>Chat de prueba</h1>
      <p>
        Demo rápido para probar WebSocket. Cambia la sala, conecta y envía mensajes para validar el
        flujo en tiempo real.
      </p>

      <div className="form-field">
        <label htmlFor="room">Sala</label>
        <input
          id="room"
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
          placeholder="room_01"
        />
      </div>

      <div className="form-field">
        <label htmlFor="sender">Remitente</label>
        <input
          id="sender"
          value={user}
          onChange={(event) => setUser(event.target.value)}
          placeholder="Tu nombre"
        />
      </div>

      <div className="form-field">
        <label htmlFor="message">Mensaje</label>
        <input
          id="message"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Escribe un mensaje"
        />
      </div>

      <button type="button" onClick={handleSend}>
        Enviar
      </button>

      <section className="form-section">
        <h2>Mensajes</h2>
        {messages.length === 0 ? (
          <p>No hay mensajes todavía.</p>
        ) : (
          messages.map((message, index) => (
            <div key={`${message.timestamp}-${index}`}>
              <strong>{message.sender}:</strong> {message.content}
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default ChatDemo;
