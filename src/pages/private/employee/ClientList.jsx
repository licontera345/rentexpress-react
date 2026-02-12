import { useMemo } from 'react';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import FilterPanel from '../../../components/common/filters/FilterPanel';
import PeopleListItem from '../../../components/people/PeopleListItem';
import PeopleResultsPanel from '../../../components/people/PeopleResultsPanel';
import PersonFormModal from '../../../components/people/PersonFormModal';
import Button from '../../../components/common/actions/Button';
import { MESSAGES } from '../../../constants';
import useEmployeeClientListPage from '../../../hooks/employee/useEmployeeClientListPage';

function ClientList() {
  const { state, ui, actions, meta } = useEmployeeClientListPage();

  const filterFields = useMemo(() => ([
    { name: 'userId', label: MESSAGES.CUSTOMER_ID, type: 'number', placeholder: 'ID' },
    { name: 'username', label: MESSAGES.USERNAME, type: 'text', placeholder: MESSAGES.USERNAME_PLACEHOLDER },
    { name: 'firstName', label: MESSAGES.FIRST_NAME, type: 'text', placeholder: MESSAGES.FIRST_NAME_PLACEHOLDER },
    { name: 'email', label: MESSAGES.EMAIL, type: 'email', placeholder: MESSAGES.EMAIL_PLACEHOLDER },
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
  ]), []);

  const userFields = useMemo(() => ([
    { name: 'username', label: MESSAGES.USERNAME, required: true },
    { name: 'password', label: MESSAGES.PASSWORD, type: 'password' },
    { name: 'firstName', label: MESSAGES.FIRST_NAME, required: true },
    { name: 'lastName1', label: MESSAGES.LAST_NAME_1, required: true },
    { name: 'lastName2', label: MESSAGES.LAST_NAME_2 },
    { name: 'birthDate', label: MESSAGES.BIRTH_DATE, type: 'date', required: true },
    { name: 'email', label: MESSAGES.EMAIL, type: 'email', required: true },
    { name: 'phone', label: MESSAGES.PHONE, required: true },
    { name: 'addressId', label: MESSAGES.ADDRESS_ID, type: 'number', required: true },
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
  ]), []);

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.CLIENT_LIST_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.CLIENT_LIST_SUBTITLE}</p>
          </div>
          <Button type="button" variant="primary" onClick={() => actions.setIsCreateOpen(true)}>
            {MESSAGES.ADD_USER}
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
              title={MESSAGES.CLIENT_LIST_TITLE}
              emptyDescription={MESSAGES.NO_USERS_REGISTERED}
              loading={ui.isLoading}
              error={ui.error}
              pageAlert={ui.pageAlert}
              onCloseAlert={() => actions.setPageAlert(null)}
              items={state.users}
              pagination={meta.pagination}
              onPageChange={actions.handlePageChange}
              renderItem={(user) => (
                <PeopleListItem
                  key={user.userId ?? user.id}
                  person={user}
                  idField="userId"
                  title={`${user.firstName || ''} ${user.lastName1 || ''}`.trim() || user.username}
                  subtitle={user.username || MESSAGES.NOT_AVAILABLE_SHORT}
                  details={[
                    { label: MESSAGES.EMAIL, value: user.email },
                    { label: MESSAGES.PHONE, value: user.phone },
                    { label: MESSAGES.BIRTH_DATE, value: user.birthDate },
                    { label: MESSAGES.ADDRESS_ID, value: user.addressId || user.address?.[0]?.addressId }
                  ]}
                  onEdit={actions.handleEditUser}
                  onDelete={actions.handleDeleteUser}
                />
              )}
            />
          </div>
        </Card>
      </section>

      <PersonFormModal
        isOpen={ui.isCreateOpen}
        title={MESSAGES.USER_CREATE_TITLE}
        description={MESSAGES.USER_CREATE_SUBTITLE}
        titleId="user-create-title"
        fields={userFields.map((field) => field.name === 'password' ? { ...field, required: true } : field)}
        formData={state.createForm.formData}
        fieldErrors={state.createErrors}
        onChange={state.createForm.handleFormChange}
        onSubmit={actions.handleCreateUser}
        onClose={() => actions.setIsCreateOpen(false)}
        alert={state.createForm.formAlert && { ...state.createForm.formAlert, onClose: () => state.createForm.setFormAlert(null) }}
        isSubmitting={ui.isSubmitting}
        submitLabel={MESSAGES.ADD_USER}
      />

      <PersonFormModal
        isOpen={ui.isEditOpen}
        title={MESSAGES.USER_EDIT_TITLE}
        description={MESSAGES.USER_EDIT_SUBTITLE}
        titleId="user-edit-title"
        fields={userFields}
        formData={state.editForm.formData}
        fieldErrors={state.editErrors}
        onChange={state.editForm.handleFormChange}
        onSubmit={actions.handleUpdateUser}
        onClose={() => actions.setIsEditOpen(false)}
        alert={state.editForm.formAlert && { ...state.editForm.formAlert, onClose: () => state.editForm.setFormAlert(null) }}
        isSubmitting={ui.isSubmitting}
        isLoading={ui.isEditLoading}
        submitLabel={MESSAGES.UPDATE}
      />
    </PrivateLayout>
  );
}

export default ClientList;
