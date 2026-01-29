import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import { MESSAGES } from '../../../constants/messages';

function EmployeeList() {
  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.EMPLOYEE_LIST_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.EMPLOYEE_LIST_SUBTITLE}</p>
          </div>
        </header>

        <Card className="personal-space-card">
          <p>{MESSAGES.SECTION_COMING_SOON}</p>
        </Card>
      </section>
    </PrivateLayout>
  );
}

export default EmployeeList;
