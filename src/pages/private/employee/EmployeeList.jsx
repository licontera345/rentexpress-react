import { useCallback } from 'react';
import { PrivateLayout } from '../../../components/index.js';
import { SectionHeader, Card, FilterPanel, ListResultsPanel, DataTable } from '../../../components/index.js';
import { usePaginatedSearch } from '../../../hooks/index.js';
import { employeeService } from '../../../api/index.js';
import { PAGINATION } from '../../../constants/index.js';
import { formatFullName, isActiveStatus } from '../../../utils/format.js';
import { Badge } from '../../../components/index.js';

const DEFAULT_FILTERS = { employeeName: '', email: '', activeStatus: '', pageSize: PAGINATION.SEARCH_PAGE_SIZE };
const FILTER_FIELDS = [
  { name: 'employeeName', label: 'Nombre', type: 'text', placeholder: 'Nombre' },
  { name: 'email', label: 'Email', type: 'text', placeholder: 'Email' },
  { name: 'activeStatus', label: 'Estado', type: 'select', placeholder: 'Todos', options: [{ value: '', label: 'Todos' }, { value: 'true', label: 'Activo' }, { value: 'false', label: 'Inactivo' }] },
];

export default function EmployeeList() {
  const list = usePaginatedSearch({
    fetchFn: useCallback((criteria) => employeeService.search(criteria), []),
    defaultFilters: DEFAULT_FILTERS,
    defaultPageSize: PAGINATION.SEARCH_PAGE_SIZE,
  });

  const columns = [
    { id: 'name', label: 'Nombre', render: (row) => formatFullName(row) },
    { id: 'email', label: 'Email', render: (row) => row?.email ?? '—' },
    { id: 'status', label: 'Estado', render: (row) => (isActiveStatus(row?.activeStatus) ? <Badge variant="success">Activo</Badge> : <Badge variant="default">Inactivo</Badge>) },
  ];

  return (
    <PrivateLayout>
      <section className="page-list">
        <SectionHeader title="Empleados" subtitle="Listado de empleados" />
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
              loading={list.loading}
              error={list.error}
              emptyTitle="Sin resultados"
              hasItems={list.items.length > 0}
              pagination={list.pagination}
              onPageChange={list.goToPage}
            >
              <DataTable
                columns={columns}
                data={list.items}
                getRowId={(row) => row.id}
                actionsLabel="Acciones"
              />
            </ListResultsPanel>
          </div>
        </Card>
      </section>
    </PrivateLayout>
  );
}
