import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import { Card } from '../../../components/common/layout/LayoutPrimitives';
import ListResultsPanel from '../../../components/common/layout/ListResultsPanel';
import SectionHeader from '../../../components/common/layout/SectionHeader';
import FilterPanel from '../../../components/common/filters/FilterPanel';
import DataTable from '../../../components/common/layout/DataTable';
import EmployeeFormModal from '../../../components/employees/form/EmployeeFormModal';
import { MESSAGES } from '../../../constants';
import useEmployeeEmployeeListPage from '../../../hooks/employee/useEmployeeEmployeeListPage';

function formatName(employee) {
  const parts = [
    employee?.firstName,
    employee?.lastName1,
    employee?.lastName2
  ].filter(Boolean);
  return parts.length ? parts.join(' ') : MESSAGES.NOT_AVAILABLE_SHORT;
}

const isActive = (value) => {
  if (value === false || value === 0 || value === '0') return false;
  return value === true || Number(value) === 1 || value === '1';
};

function getActiveStatus(employee) {
  return employee?.activeStatus;
}

function getRoleLabel(row, roles = []) {
  if (row?.roleName) return row.roleName;
  if (row?.role?.roleName) return row.role.roleName;
  const id = row?.roleId ?? row?.role?.roleId;
  if (id == null) return MESSAGES.NOT_AVAILABLE_SHORT;
  const found = roles.find((r) => Number(r.roleId) === Number(id));
  return found?.roleName ?? MESSAGES.NOT_AVAILABLE_SHORT;
}

function getHeadquartersLabel(row, headquarters = []) {
  if (row?.headquarters?.name) return row.headquarters.name;
  const id = row?.headquartersId ?? row?.headquarters?.id;
  if (id == null) return MESSAGES.NOT_AVAILABLE_SHORT;
  const found = headquarters.find((h) => Number(h.id) === Number(id));
  return found?.name ?? MESSAGES.NOT_AVAILABLE_SHORT;
}

function getEmployeeColumns(roles = [], headquarters = []) {
  return [
    {
      id: 'name',
      label: MESSAGES.FULL_NAME,
      render: (row) => formatName(row)
    },
    {
      id: 'email',
      label: MESSAGES.EMAIL,
      render: (row) => row?.email || MESSAGES.NOT_AVAILABLE_SHORT
    },
    {
      id: 'role',
      label: MESSAGES.EMPLOYEE_POSITION_LABEL,
      render: (row) => getRoleLabel(row, roles)
    },
    {
      id: 'headquarters',
      label: MESSAGES.HEADQUARTERS_LABEL,
      render: (row) => getHeadquartersLabel(row, headquarters)
    },
    {
      id: 'status',
      label: MESSAGES.STATUS,
      render: (row) => {
        const active = isActive(getActiveStatus(row));
        return (
          <span className={`status-badge status-badge--${active ? 'active' : 'inactive'}`}>
            {active ? MESSAGES.ACTIVE : MESSAGES.INACTIVE}
          </span>
        );
      }
    }
  ];
}

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
              hasItems={(state.employees ?? []).length > 0}
              pagination={options.pagination}
              onPageChange={actions.handlePageChange}
            >
              <DataTable
                columns={getEmployeeColumns(options.roles ?? [], options.headquarters ?? [])}
                data={state.employees ?? []}
                getRowId={(row) => row.id}
                actions={{
                  onEdit: (row) => actions.handleEditEmployee(row?.id),
                  onDelete: (row) => actions.handleDeleteEmployee(row?.id)
                }}
              />
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
