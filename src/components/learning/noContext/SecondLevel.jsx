import ThirdLevel from './ThirdLevel';

function SecondLevel({ message }) {
  return (
    <div>
      <p>Second Level</p>
      <ThirdLevel message={message} />
    </div>
  );
}

export default SecondLevel;
