import { useCallback } from 'react';
import { PrivateLayout } from '../../../components/index.js';
import { SectionHeader, Card, ListResultsPanel, DataTable } from '../../../components/index.js';
import { usePaginatedSearch } from '../../../hooks/index.js';
import { rentalService } from '../../../api/index.js';
import { PAGINATION } from '../../../constants/index.js';

const DEFAULT_FILTERS = { pageSize: PAGINATION.SEARCH_PAGE_SIZE };

export default function RentalsList() {
  const list = usePaginatedSearch({
    fetchFn: useCallback((criteria) => rentalService.search(criteria), []),
    defaultFilters: DEFAULT_FILTERS,
    defaultPageSize: PAGINATION.SEARCH_PAGE_SIZE,
  });

  const columns = [
    { id: 'rentalId', label: 'ID', render: (row) => row?.rentalId ?? row?.id ?? '—' },
    { id: 'startDateEffective', label: 'Inicio', render: (row) => row?.startDateEffective ?? '—' },
    { id: 'endDateEffective', label: 'Fin', render: (row) => row?.endDateEffective ?? '—' },
  ];

  return (
    <PrivateLayout>
      <section className="page-list">
        <SectionHeader title="Alquileres" subtitle="Listado" />
        <Card>
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
            <DataTable columns={columns} data={list.items} getRowId={(row) => row.rentalId ?? row.id} actionsLabel="Acciones" />
          </ListResultsPanel>
        </Card>
      </section>
    </PrivateLayout>
  );
}
