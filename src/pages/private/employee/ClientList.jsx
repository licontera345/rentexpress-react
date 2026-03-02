import PageListTemplate from '../../../components/common/layout/PageListTemplate';
import DataTable from '../../../components/common/layout/DataTable';
import UserFormModal from '../../../components/clients/form/UserFormModal';
import { MESSAGES } from '../../../constants';
import useEmployeeClientListPage from '../../../hooks/employee/useEmployeeClientListPage';

function formatName(user) {
  const parts = [
    user?.firstName,
    user?.lastName1,
    user?.lastName2
  ].filter(Boolean);
  return parts.length ? parts.join(' ') : (user?.username || MESSAGES.NOT_AVAILABLE_SHORT);
}

const isActive = (value) => Number(value) === 1 || value === true || value === '1';

function getClientColumns() {
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
      id: 'status',
      label: MESSAGES.STATUS,
      render: (row) => {
        const active = isActive(row?.activeStatus);
        return (
          <span className={`status-badge status-badge--${active ? 'active' : 'inactive'}`}>
            {active ? MESSAGES.ACTIVE : MESSAGES.INACTIVE}
          </span>
        );
      }
    }
  ];
}

function ClientList() {
  const { state, ui, actions, options } = useEmployeeClientListPage();

  const headerActions = (
    <button
      type="button"
      className="vehicle-create-trigger"
      onClick={actions.handleOpenCreateModal}
      aria-label={MESSAGES.ADD_CLIENT}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5z" />
      </svg>
    </button>
  );

  const modals = (
    <>
      <UserFormModal
        isOpen={ui.isCreateOpen}
        title={MESSAGES.USER_CREATE_TITLE}
        description={MESSAGES.USER_CREATE_DESCRIPTION}
        titleId="user-create-title"
        formData={state.createForm.formData}
        fieldErrors={state.createErrors}
        onChange={actions.handleCreateChange}
        onSubmit={actions.handleCreateUser}
        onClose={actions.closeCreateModal}
        roles={options.roles}
        alert={state.createForm.formAlert && { ...state.createForm.formAlert, onClose: () => state.createForm.setFormAlert(null) }}
        isSubmitting={ui.isSubmitting}
        submitLabel={MESSAGES.ADD_CLIENT}
        isCreate={true}
      />

      <UserFormModal
        isOpen={ui.isEditOpen}
        title={ui.isViewMode ? MESSAGES.USER_VIEW_TITLE : MESSAGES.USER_EDIT_TITLE}
        description={ui.isViewMode ? '' : MESSAGES.USER_EDIT_DESCRIPTION}
        titleId="user-edit-title"
        formData={state.editForm.formData}
        fieldErrors={state.editErrors}
        onChange={actions.handleEditChange}
        onSubmit={actions.handleUpdateUser}
        onClose={actions.closeEditModal}
        roles={options.roles}
        alert={state.editForm.formAlert && { ...state.editForm.formAlert, onClose: () => state.editForm.setFormAlert(null) }}
        isSubmitting={ui.isSubmitting}
        isLoading={ui.isEditLoading}
        submitLabel={MESSAGES.UPDATE_USER}
        isCreate={false}
        readOnly={ui.isViewMode}
      />
    </>
  );

  return (
    <PageListTemplate
      title={MESSAGES.CLIENT_LIST_TITLE}
      subtitle={MESSAGES.CLIENT_LIST_SUBTITLE}
      headerActions={headerActions}
      filterFields={options.filterFields}
      filterValues={state.filters}
      onFilterChange={actions.handleFilterChange}
      onFilterApply={actions.applyFilters}
      onFilterReset={actions.resetFilters}
      filterTitle={MESSAGES.FILTER_BY}
      isFilterLoading={ui.isLoading}
      pageAlert={ui.pageAlert}
      onCloseAlert={() => actions.setPageAlert(null)}
      isLoading={ui.isLoading}
      error={ui.error}
      emptyDescription={MESSAGES.NO_CLIENTS_REGISTERED}
      hasItems={(state.users ?? []).length > 0}
      pagination={options.pagination}
      onPageChange={actions.handlePageChange}
      modals={modals}
    >
      <DataTable
        columns={getClientColumns()}
        data={state.users ?? []}
        getRowId={(row) => row.userId}
        actions={{
          onEdit: (row) => actions.handleEditUser(row?.userId),
          onDelete: (row) => actions.handleDeleteUser(row?.userId)
        }}
      />
    </PageListTemplate>
  );
}

export default ClientList;
