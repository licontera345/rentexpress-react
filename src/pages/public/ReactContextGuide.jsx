import { Provider } from '../../context/MessageContext';
import NoContextFirstLevel from '../../components/learning/noContext/FirstLevel';
import WithContextFirstLevel from '../../components/learning/withContext/FirstLevel';
import PublicLayout from '../../components/layout/public/PublicLayout';

function ReactContextGuide() {
  return (
    <PublicLayout>
      <div className="react-context-guide">
        <h1>Prop Drilling vs useContext</h1>

        <section className="react-context-section">
          <h2>Prop drilling (sen context)</h2>
          <NoContextFirstLevel />
        </section>

        <section className="react-context-section">
          <h2>useContext (con Provider)</h2>
          <Provider>
            <WithContextFirstLevel />
          </Provider>
        </section>
      </div>
    </PublicLayout>
  );
}

export default ReactContextGuide;
