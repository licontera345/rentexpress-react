import { useCallback } from 'react';
import { PrivateLayout } from '../../../components/index.js';
import { SectionHeader, Card, FilterPanel, ListResultsPanel, DataTable } from '../../../components/index.js';
import { usePaginatedSearch } from '../../../hooks/index.js';
import { reservationService } from '../../../api/index.js';
import { PAGINATION } from '../../../constants/index.js';

const DEFAULT_FILTERS = { pageSize: PAGINATION.SEARCH_PAGE_SIZE };

export default function ReservationsList() {
  const list = usePaginatedSearch({
    fetchFn: useCallback((criteria) => reservationService.search(criteria), []),
    defaultFilters: DEFAULT_FILTERS,
    defaultPageSize: PAGINATION.SEARCH_PAGE_SIZE,
  });

  const columns = [
    { id: 'reservationId', label: 'ID', render: (row) => row?.reservationId ?? row?.id ?? '—' },
    { id: 'startDate', label: 'Inicio', render: (row) => row?.startDate ?? '—' },
    { id: 'endDate', label: 'Fin', render: (row) => row?.endDate ?? '—' },
  ];

  return (
    <PrivateLayout>
      <section className="page-list">
        <SectionHeader title="Reservas" subtitle="Listado" />
        <Card>
          <div className="list-layout">
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
              <DataTable columns={columns} data={list.items} getRowId={(row) => row.reservationId ?? row.id} actionsLabel="Acciones" />
            </ListResultsPanel>
          </div>
        </Card>
      </section>
    </PrivateLayout>
  );
}
