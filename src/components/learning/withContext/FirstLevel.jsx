import { useContext } from 'react';
import SecondLevel from './SecondLevel';
import MessageContext from '../../../context/MessageContext';

function FirstLevel() {
  const [, setMessage] = useContext(MessageContext);

  const update = () => {
    setMessage('Message changed!!');
  };

  return (
    <div>
      <p>First Level</p>
      <SecondLevel />
      <button type="button" onClick={update}>
        Update
      </button>
    </div>
  );
}

export default FirstLevel;
