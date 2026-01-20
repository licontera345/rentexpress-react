import { Provider } from '../../context/MessageContext';
import NoContextFirstLevel from '../../components/learning/noContext/FirstLevel';
import WithContextFirstLevel from '../../components/learning/withContext/FirstLevel';

function ReactContextGuide() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Prop Drilling vs useContext</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Prop drilling (sen context)</h2>
        <NoContextFirstLevel />
      </section>

      <section>
        <h2>useContext (con Provider)</h2>
        <Provider>
          <WithContextFirstLevel />
        </Provider>
      </section>
    </div>
  );
}

export default ReactContextGuide;
