import { createContext, useState } from 'react';

const MessageContext = createContext();

function Provider({ children }) {
  const [message, setMessage] = useState('click to change message');

  return (
    <MessageContext.Provider value={[message, setMessage]}>
      {children}
    </MessageContext.Provider>
  );
}

export { Provider };
export default MessageContext;
