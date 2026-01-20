import { useState } from 'react';
import SecondLevel from './SecondLevel';

function FirstLevel() {
  const [message, setMessage] = useState('click to change message');

  const update = () => {
    setMessage('Thank you!');
  };

  return (
    <div>
      <p>First Level</p>
      <SecondLevel message={message} />
      <button type="button" onClick={update}>
        Update
      </button>
    </div>
  );
}

export default FirstLevel;
