import { useCallback } from 'react';
import { PrivateLayout } from '../../../components/index.js';
import { SectionHeader, Card, FilterPanel, ListResultsPanel, DataTable } from '../../../components/index.js';
import { usePaginatedSearch } from '../../../hooks/index.js';
import { vehicleService } from '../../../api/index.js';
import { PAGINATION } from '../../../constants/index.js';

const DEFAULT_FILTERS = { brand: '', model: '', pageSize: PAGINATION.SEARCH_PAGE_SIZE };
const FILTER_FIELDS = [
  { name: 'brand', label: 'Marca', type: 'text', placeholder: 'Marca' },
  { name: 'model', label: 'Modelo', type: 'text', placeholder: 'Modelo' },
];

export default function VehicleList() {
  const list = usePaginatedSearch({
    fetchFn: useCallback((criteria) => vehicleService.search(criteria), []),
    defaultFilters: DEFAULT_FILTERS,
    defaultPageSize: PAGINATION.SEARCH_PAGE_SIZE,
  });

  const columns = [
    { id: 'brand', label: 'Marca', render: (row) => row?.brand ?? '—' },
    { id: 'model', label: 'Modelo', render: (row) => row?.model ?? '—' },
    { id: 'licensePlate', label: 'Matrícula', render: (row) => row?.licensePlate ?? '—' },
    { id: 'dailyPrice', label: 'Precio/día', render: (row) => row?.dailyPrice != null ? `${row.dailyPrice} €` : '—' },
  ];

  return (
    <PrivateLayout>
      <section className="page-list">
        <SectionHeader title="Vehículos" subtitle="Flota" />
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
              <DataTable columns={columns} data={list.items} getRowId={(row) => row.vehicleId ?? row.id} actionsLabel="Acciones" />
            </ListResultsPanel>
          </div>
        </Card>
      </section>
    </PrivateLayout>
  );
}
