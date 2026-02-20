import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import { Card } from '../../../components/common/layout/LayoutPrimitives';
import ListResultsPanel from '../../../components/common/layout/ListResultsPanel';
import SectionHeader from '../../../components/common/layout/SectionHeader';
import FilterPanel from '../../../components/common/filters/FilterPanel';
import EmployeeListItem from '../../../components/employees/list/EmployeeListItem';
import EmployeeFormModal from '../../../components/employees/form/EmployeeFormModal';
import { MESSAGES } from '../../../constants';
import useEmployeeEmployeeListPage from '../../../hooks/employee/useEmployeeEmployeeListPage';

function EmployeeList() {
  const { state, ui, actions, options } = useEmployeeEmployeeListPage();

  return (
    <PrivateLayout>
      <section className="personal-space">
        <SectionHeader
          title={MESSAGES.EMPLOYEE_LIST_TITLE}
          subtitle={MESSAGES.EMPLOYEE_LIST_SUBTITLE}
        >
          <button
            type="button"
            className="vehicle-create-trigger"
            onClick={actions.handleOpenCreateModal}
            aria-label={MESSAGES.ADD_EMPLOYEE}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5z" />
            </svg>
          </button>
        </SectionHeader>

        <Card className="personal-space-card">
          <div className="vehicle-list-layout">
            <aside className="vehicle-filter-panel">
              <FilterPanel
                fields={options.filterFields}
                values={state.filters}
                onChange={actions.handleFilterChange}
                onApply={actions.applyFilters}
                onReset={actions.resetFilters}
                title={MESSAGES.FILTER_BY}
                isLoading={ui.isLoading}
                className="vehicle-filters-panel"
              />
            </aside>

            <ListResultsPanel
              pageAlert={ui.pageAlert}
              onCloseAlert={() => actions.setPageAlert(null)}
              loading={ui.isLoading}
              error={ui.error}
              emptyDescription={MESSAGES.NO_EMPLOYEES_REGISTERED}
              hasItems={state.employees.length > 0}
              pagination={options.pagination}
              onPageChange={actions.handlePageChange}
            >
              {state.employees.map((employee) => (
                <EmployeeListItem
                  key={employee.id}
                  employee={employee}
                  onEdit={actions.handleEditEmployee}
                  onDelete={actions.handleDeleteEmployee}
                />
              ))}
            </ListResultsPanel>
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
        roles={options.roles}
        headquarters={options.headquarters || []}
        alert={state.createForm.formAlert && { ...state.createForm.formAlert, onClose: () => state.createForm.setFormAlert(null) }}
        isSubmitting={ui.isSubmitting}
        submitLabel={MESSAGES.ADD_EMPLOYEE}
        isCreate={true}
        canChangeRole={options.canChangeRole}
      />

      <EmployeeFormModal
        isOpen={ui.isEditOpen}
        title={ui.isViewMode ? MESSAGES.EMPLOYEE_VIEW_TITLE : MESSAGES.EMPLOYEE_EDIT_TITLE}
        description={ui.isViewMode ? '' : MESSAGES.EMPLOYEE_EDIT_DESCRIPTION}
        titleId="employee-edit-title"
        formData={state.editForm.formData}
        fieldErrors={state.editErrors}
        onChange={actions.handleEditChange}
        onSubmit={actions.handleUpdateEmployee}
        onClose={actions.closeEditModal}
        roles={options.roles}
        headquarters={options.headquarters || []}
        alert={state.editForm.formAlert && { ...state.editForm.formAlert, onClose: () => state.editForm.setFormAlert(null) }}
        isSubmitting={ui.isSubmitting}
        isLoading={ui.isEditLoading}
        submitLabel={MESSAGES.UPDATE_EMPLOYEE}
        isCreate={false}
        readOnly={ui.isViewMode}
        canChangeRole={options.canChangeRole}
      />
    </PrivateLayout>
  );
}

export default EmployeeList;
