import { useContext } from 'react';
import MessageContext from '../../../context/MessageContext';

function ThirdLevel() {
  const [message] = useContext(MessageContext);

  return (
    <div>
      <p>Third Level</p>
      <p>{message}</p>
    </div>
  );
}

export default ThirdLevel;
