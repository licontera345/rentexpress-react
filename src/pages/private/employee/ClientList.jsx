import { useCallback, useState } from 'react';
import { PrivateLayout } from '../../../components/index.js';
import { SectionHeader, Card, Button, FilterPanel, ListResultsPanel, DataTable, Modal, FormField } from '../../../components/index.js';
import { usePaginatedSearch, useForm, useToggle } from '../../../hooks/index.js';
import { userService } from '../../../api/index.js';
import { PAGINATION, DEFAULT_FORM_DATA } from '../../../constants/index.js';
import { formatFullName, isActiveStatus } from '../../../utils/format.js';
import { Badge } from '../../../components/index.js';

const DEFAULT_FILTERS = { username: '', firstName: '', lastName1: '', email: '', activeStatus: '', pageSize: PAGINATION.SEARCH_PAGE_SIZE };
const FILTER_FIELDS = [
  { name: 'username', label: 'Usuario', type: 'text', placeholder: 'Usuario' },
  { name: 'firstName', label: 'Nombre', type: 'text', placeholder: 'Nombre' },
  { name: 'lastName1', label: 'Apellido', type: 'text', placeholder: 'Apellido' },
  { name: 'email', label: 'Email', type: 'text', placeholder: 'Email' },
  { name: 'activeStatus', label: 'Estado', type: 'select', placeholder: 'Todos', options: [{ value: '', label: 'Todos' }, { value: 'true', label: 'Activo' }, { value: 'false', label: 'Inactivo' }] },
];

export default function ClientList() {
  const [pageAlert, setPageAlert] = useState(null);
  const list = usePaginatedSearch({
    fetchFn: useCallback((criteria) => userService.search(criteria), []),
    defaultFilters: DEFAULT_FILTERS,
    defaultPageSize: PAGINATION.SEARCH_PAGE_SIZE,
  });
  const createModal = useToggle(false);
  const createForm = useForm(DEFAULT_FORM_DATA.REGISTER);

  const columns = [
    { id: 'name', label: 'Nombre', render: (row) => formatFullName(row) },
    { id: 'email', label: 'Email', render: (row) => row?.email ?? '—' },
    { id: 'status', label: 'Estado', render: (row) => (isActiveStatus(row?.activeStatus) ? <Badge variant="success">Activo</Badge> : <Badge variant="default">Inactivo</Badge>) },
  ];

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.createPublic(createForm.values);
      list.refresh();
      createModal.close();
      createForm.reset();
      setPageAlert({ type: 'success', message: 'Cliente creado.' });
    } catch (err) {
      createForm.setAlert({ type: 'error', message: err?.message ?? 'Error al crear' });
    }
  };

  return (
    <PrivateLayout>
      <section className="page-list">
        <SectionHeader title="Clientes" subtitle="Listado de clientes">
          <Button onClick={createModal.open}>Añadir cliente</Button>
        </SectionHeader>
        <Card>
          <div className="list-layout">
            <aside className="list-filters">
              <FilterPanel
                fields={FILTER_FIELDS}
                values={list.filters}
                onChange={list.setFilterFromEvent}
                onApply={list.applyFilters}
                onReset={list.resetFilters}
                title="Filtrar"
                isLoading={list.loading}
              />
            </aside>
            <ListResultsPanel
              title="Resultados"
              subtitle={list.pagination.totalRecords != null ? `Pág. ${list.pagination.pageNumber} · ${list.pagination.totalRecords} resultados` : null}
              pageAlert={pageAlert}
              onCloseAlert={() => setPageAlert(null)}
              loading={list.loading}
              error={list.error}
              emptyTitle="Sin resultados"
              emptyDescription="No hay clientes con los filtros indicados."
              hasItems={list.items.length > 0}
              pagination={list.pagination}
              onPageChange={list.goToPage}
            >
              <DataTable
                columns={columns}
                data={list.items}
                getRowId={(row) => row.userId ?? row.id}
                actions={{ onView: (row) => {}, onEdit: (row) => {}, onDelete: (row) => {} }}
                actionsLabel="Acciones"
              />
            </ListResultsPanel>
          </div>
        </Card>
      </section>

      <Modal open={createModal.on} onClose={createModal.close} title="Nuevo cliente" closeLabel="Cerrar">
        {createForm.alert && <div className={`alert alert-${createForm.alert.type}`}>{createForm.alert.message}</div>}
        <form onSubmit={handleCreateSubmit}>
          <FormField label="Usuario" name="username" value={createForm.values.username} onChange={createForm.setFromEvent} required />
          <FormField label="Email" name="email" type="email" value={createForm.values.email} onChange={createForm.setFromEvent} required />
          <FormField label="Contraseña" name="password" type="password" value={createForm.values.password} onChange={createForm.setFromEvent} required />
          <FormField label="Nombre" name="firstName" value={createForm.values.firstName} onChange={createForm.setFromEvent} />
          <FormField label="Apellido 1" name="lastName1" value={createForm.values.lastName1} onChange={createForm.setFromEvent} />
          <FormField label="Apellido 2" name="lastName2" value={createForm.values.lastName2} onChange={createForm.setFromEvent} />
          <FormField label="Teléfono" name="phone" value={createForm.values.phone} onChange={createForm.setFromEvent} />
          <div className="form-actions">
            <Button type="submit">Crear</Button>
            <Button type="button" variant="secondary" onClick={createModal.close}>Cancelar</Button>
          </div>
        </form>
      </Modal>
    </PrivateLayout>
  );
}
