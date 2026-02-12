import Card from '../../../components/common/layout/Card';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import FilterPanel from '../../../components/common/filters/FilterPanel';
import { MESSAGES } from '../../../constants';
import { buildClientFilterFields } from '../../../constants/clientFilterFields';
import ClientListHeader from '../../../components/client/list/ClientListHeader';
import ClientResultsPanel from '../../../components/client/list/ClientResultsPanel';
import ClientFormModal from '../../../components/client/list/ClientFormModal';
import useEmployeeClientListPage from '../../../hooks/employee/useEmployeeClientListPage';

function ClientList() {
  const { state, ui, actions, meta } = useEmployeeClientListPage();
  const filterFields = buildClientFilterFields();

  return (
    <PrivateLayout>
      <section className="personal-space">
        <ClientListHeader onCreate={actions.handleOpenCreateModal} />

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

            <ClientResultsPanel
              loading={ui.isLoading}
              error={ui.error}
              pageAlert={ui.pageAlert}
              onCloseAlert={() => actions.setPageAlert(null)}
              clients={state.clients}
              pagination={meta.pagination}
              onEdit={actions.handleEditClient}
              onDelete={actions.handleDeleteClient}
              onPageChange={actions.handlePageChange}
            />
          </div>
        </Card>
      </section>

      <ClientFormModal
        isOpen={ui.isCreateOpen}
        title={MESSAGES.USER_CREATE_TITLE}
        description={MESSAGES.USER_CREATE_DESCRIPTION}
        titleId="user-create-title"
        formData={state.createForm.formData}
        fieldErrors={state.createErrors}
        onChange={actions.handleCreateChange}
        onSubmit={actions.handleCreateClient}
        onClose={actions.closeCreateModal}
        provinces={state.provinces}
        cities={state.createCities}
        provincesLoading={ui.provincesLoading}
        citiesLoading={ui.createCitiesLoading}
        alert={state.createForm.formAlert && {
          ...state.createForm.formAlert,
          onClose: () => state.createForm.setFormAlert(null)
        }}
        isSubmitting={ui.isSubmitting}
        submitLabel={MESSAGES.ADD_USER}
      />

      <ClientFormModal
        isOpen={ui.isEditOpen}
        title={MESSAGES.USER_EDIT_TITLE}
        description={MESSAGES.USER_EDIT_DESCRIPTION}
        titleId="user-edit-title"
        formData={state.editForm.formData}
        fieldErrors={state.editErrors}
        onChange={actions.handleEditChange}
        onSubmit={actions.handleUpdateClient}
        onClose={actions.closeEditModal}
        provinces={state.provinces}
        cities={state.editCities}
        provincesLoading={ui.provincesLoading}
        citiesLoading={ui.editCitiesLoading}
        alert={state.editForm.formAlert && {
          ...state.editForm.formAlert,
          onClose: () => state.editForm.setFormAlert(null)
        }}
        isSubmitting={ui.isSubmitting}
        isLoading={ui.isEditLoading}
        submitLabel={MESSAGES.UPDATE_USER}
        isEdit
      />
    </PrivateLayout>
  );
}

export default ClientList;
