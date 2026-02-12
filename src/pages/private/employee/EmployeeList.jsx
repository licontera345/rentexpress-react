import { useMemo } from 'react';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import FilterPanel from '../../../components/common/filters/FilterPanel';
import PeopleListItem from '../../../components/people/PeopleListItem';
import PeopleResultsPanel from '../../../components/people/PeopleResultsPanel';
import PersonFormModal from '../../../components/people/PersonFormModal';
import Button from '../../../components/common/actions/Button';
import { MESSAGES } from '../../../constants';
import useEmployeeEmployeeListPage from '../../../hooks/employee/useEmployeeEmployeeListPage';

function EmployeeList() {
  const { state, ui, actions, meta } = useEmployeeEmployeeListPage();

  const filterFields = useMemo(() => ([
    { name: 'employeeId', label: MESSAGES.EMPLOYEE_ID, type: 'number', placeholder: 'ID' },
    { name: 'employeeName', label: MESSAGES.USERNAME, type: 'text', placeholder: MESSAGES.USERNAME_PLACEHOLDER },
    { name: 'firstName', label: MESSAGES.FIRST_NAME, type: 'text', placeholder: MESSAGES.FIRST_NAME_PLACEHOLDER },
    { name: 'email', label: MESSAGES.EMAIL, type: 'email', placeholder: MESSAGES.EMAIL_PLACEHOLDER },
    { name: 'roleId', label: MESSAGES.EMPLOYEE_POSITION_LABEL, type: 'select', placeholder: MESSAGES.SELECT_ROLE, options: state.roleOptions.filter((item) => item.value) },
    { name: 'headquartersId', label: MESSAGES.HEADQUARTERS_LABEL, type: 'select', placeholder: MESSAGES.SELECT_HEADQUARTERS, options: state.headquartersOptions.filter((item) => item.value) },
    {
      name: 'activeStatus',
      label: MESSAGES.ACTIVE_STATUS,
      type: 'select',
      placeholder: MESSAGES.ALL,
      options: [
        { value: 'true', label: MESSAGES.ACTIVE },
        { value: 'false', label: MESSAGES.INACTIVE }
      ]
    }
  ]), [state.headquartersOptions, state.roleOptions]);

  const employeeFields = useMemo(() => ([
    { name: 'employeeName', label: MESSAGES.USERNAME, required: true },
    { name: 'password', label: MESSAGES.PASSWORD, type: 'password' },
    { name: 'firstName', label: MESSAGES.FIRST_NAME, required: true },
    { name: 'lastName1', label: MESSAGES.LAST_NAME_1, required: true },
    { name: 'lastName2', label: MESSAGES.LAST_NAME_2 },
    { name: 'email', label: MESSAGES.EMAIL, type: 'email', required: true },
    { name: 'phone', label: MESSAGES.PHONE, required: true },
    { name: 'roleId', label: MESSAGES.EMPLOYEE_POSITION_LABEL, as: 'select', required: true, options: state.roleOptions },
    { name: 'headquartersId', label: MESSAGES.HEADQUARTERS_LABEL, as: 'select', required: true, options: state.headquartersOptions },
    {
      name: 'activeStatus',
      label: MESSAGES.ACTIVE_STATUS,
      as: 'select',
      required: true,
      options: [
        { value: 'true', label: MESSAGES.ACTIVE },
        { value: 'false', label: MESSAGES.INACTIVE }
      ]
    }
  ]), [state.headquartersOptions, state.roleOptions]);

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.EMPLOYEE_LIST_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.EMPLOYEE_LIST_SUBTITLE}</p>
          </div>
          <Button type="button" variant="primary" onClick={() => actions.setIsCreateOpen(true)}>
            {MESSAGES.ADD_EMPLOYEE}
          </Button>
        </header>

        <Card className="personal-space-card">
          <div className="vehicle-list-layout">
            <aside className="vehicle-filter-panel">
              <FilterPanel
                fields={filterFields}
                values={state.filters}
                onChange={actions.handleFilterChange}
                onApply={actions.applyFilters}
                onReset={actions.resetFilters}
                title={MESSAGES.FILTER_BY}
                isLoading={ui.isLoading}
                className="vehicle-filters-panel"
              />
            </aside>

            <PeopleResultsPanel
              title={MESSAGES.EMPLOYEE_LIST_TITLE}
              emptyDescription={MESSAGES.NO_EMPLOYEES_REGISTERED}
              loading={ui.isLoading}
              error={ui.error}
              pageAlert={ui.pageAlert}
              onCloseAlert={() => actions.setPageAlert(null)}
              items={state.employees}
              pagination={meta.pagination}
              onPageChange={actions.handlePageChange}
              renderItem={(employee) => (
                <PeopleListItem
                  key={employee.employeeId ?? employee.id}
                  person={employee}
                  idField="employeeId"
                  title={`${employee.firstName || ''} ${employee.lastName1 || ''}`.trim() || employee.employeeName}
                  subtitle={employee.employeeName || MESSAGES.NOT_AVAILABLE_SHORT}
                  details={[
                    { label: MESSAGES.EMAIL, value: employee.email },
                    { label: MESSAGES.PHONE, value: employee.phone },
                    { label: MESSAGES.EMPLOYEE_POSITION_LABEL, value: employee.role?.roleName || employee.role?.name || employee.roleId },
                    { label: MESSAGES.HEADQUARTERS_LABEL, value: employee.headquarters?.name || employee.headquartersId }
                  ]}
                  onEdit={actions.handleEditEmployee}
                  onDelete={actions.handleDeleteEmployee}
                />
              )}
            />
          </div>
        </Card>
      </section>

      <PersonFormModal
        isOpen={ui.isCreateOpen}
        title={MESSAGES.EMPLOYEE_CREATE_TITLE}
        description={MESSAGES.EMPLOYEE_CREATE_SUBTITLE}
        titleId="employee-create-title"
        fields={employeeFields.map((field) => field.name === 'password' ? { ...field, required: true } : field)}
        formData={state.createForm.formData}
        fieldErrors={state.createErrors}
        onChange={state.createForm.handleFormChange}
        onSubmit={actions.handleCreateEmployee}
        onClose={() => actions.setIsCreateOpen(false)}
        alert={state.createForm.formAlert && { ...state.createForm.formAlert, onClose: () => state.createForm.setFormAlert(null) }}
        isSubmitting={ui.isSubmitting}
        submitLabel={MESSAGES.ADD_EMPLOYEE}
      />

      <PersonFormModal
        isOpen={ui.isEditOpen}
        title={MESSAGES.EMPLOYEE_EDIT_TITLE}
        description={MESSAGES.EMPLOYEE_EDIT_SUBTITLE}
        titleId="employee-edit-title"
        fields={employeeFields}
        formData={state.editForm.formData}
        fieldErrors={state.editErrors}
        onChange={state.editForm.handleFormChange}
        onSubmit={actions.handleUpdateEmployee}
        onClose={() => actions.setIsEditOpen(false)}
        alert={state.editForm.formAlert && { ...state.editForm.formAlert, onClose: () => state.editForm.setFormAlert(null) }}
        isSubmitting={ui.isSubmitting}
        isLoading={ui.isEditLoading}
        submitLabel={MESSAGES.UPDATE}
      />
    </PrivateLayout>
  );
}

export default EmployeeList;
