import Card from '../../../components/common/layout/Card';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import FilterPanel from '../../../components/common/filters/FilterPanel';
import { MESSAGES } from '../../../constants';
import useEmployeeEmployeeListPage from '../../../hooks/employee/useEmployeeEmployeeListPage';
import { buildEmployeeFilterFields } from '../../../constants/employeeFilterFields';
import EmployeeListHeader from '../../../components/employee/list/EmployeeListHeader';
import EmployeeResultsPanel from '../../../components/employee/list/EmployeeResultsPanel';
import EmployeeFormModal from '../../../components/employee/list/EmployeeFormModal';

function EmployeeList() {
  const { state, ui, actions, meta } = useEmployeeEmployeeListPage();

  const filterFields = buildEmployeeFilterFields({
    roles: state.roles,
    headquarters: state.headquarters
  });

  return (
    <PrivateLayout>
      <section className="personal-space">
        <EmployeeListHeader onCreate={actions.handleOpenCreateModal} />

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

            <EmployeeResultsPanel
              loading={ui.isLoading}
              error={ui.error}
              pageAlert={ui.pageAlert}
              onCloseAlert={() => actions.setPageAlert(null)}
              employees={state.employees}
              pagination={meta.pagination}
              onEdit={actions.handleEditEmployee}
              onDelete={actions.handleDeleteEmployee}
              onPageChange={actions.handlePageChange}
            />
          </div>
        </Card>
      </section>

      <EmployeeFormModal
        isOpen={ui.isCreateOpen}
        title={MESSAGES.EMPLOYEE_CREATE_TITLE}
        description={MESSAGES.EMPLOYEE_CREATE_DESCRIPTION}
        titleId="employee-create-title"
        formData={state.createForm.formData}
        fieldErrors={state.createErrors}
        onChange={actions.handleCreateChange}
        onSubmit={actions.handleCreateEmployee}
        onClose={actions.closeCreateModal}
        roles={state.roles}
        headquarters={state.headquarters}
        headquartersLoading={ui.headquartersLoading}
        alert={state.createForm.formAlert && {
          ...state.createForm.formAlert,
          onClose: () => state.createForm.setFormAlert(null)
        }}
        isSubmitting={ui.isSubmitting}
        submitLabel={MESSAGES.ADD_EMPLOYEE}
      />

      <EmployeeFormModal
        isOpen={ui.isEditOpen}
        title={MESSAGES.EMPLOYEE_EDIT_TITLE}
        description={MESSAGES.EMPLOYEE_EDIT_DESCRIPTION}
        titleId="employee-edit-title"
        formData={state.editForm.formData}
        fieldErrors={state.editErrors}
        onChange={actions.handleEditChange}
        onSubmit={actions.handleUpdateEmployee}
        onClose={actions.closeEditModal}
        roles={state.roles}
        headquarters={state.headquarters}
        headquartersLoading={ui.headquartersLoading}
        alert={state.editForm.formAlert && {
          ...state.editForm.formAlert,
          onClose: () => state.editForm.setFormAlert(null)
        }}
        isSubmitting={ui.isSubmitting}
        isLoading={ui.isEditLoading}
        submitLabel={MESSAGES.UPDATE_EMPLOYEE}
        isEdit
      />
    </PrivateLayout>
  );
}

export default EmployeeList;
