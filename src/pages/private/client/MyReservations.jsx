import { useCallback } from 'react';
import { PrivateLayout } from '../../../components/index.js';
import { SectionHeader, Card, ListResultsPanel, DataTable } from '../../../components/index.js';
import { usePaginatedSearch } from '../../../hooks/index.js';
import { reservationService } from '../../../api/index.js';
import { useAuth } from '../../../hooks/index.js';
import { PAGINATION } from '../../../constants/index.js';

export default function MyReservations() {
  const { user } = useAuth();
  const userId = user?.userId ?? user?.id;

  const list = usePaginatedSearch({
    fetchFn: useCallback(
      (criteria) => reservationService.search({ ...criteria, userId }),
      [userId]
    ),
    defaultFilters: { userId, pageSize: PAGINATION.SEARCH_PAGE_SIZE },
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
        <SectionHeader title="Mis reservas" subtitle="Tus reservas" />
        <Card>
          <ListResultsPanel
            title="Resultados"
            subtitle={list.pagination.totalRecords != null ? `Pág. ${list.pagination.pageNumber} · ${list.pagination.totalRecords} resultados` : null}
            loading={list.loading}
            error={list.error}
            emptyTitle="Sin reservas"
            emptyDescription="Aún no tienes reservas."
            hasItems={list.items.length > 0}
            pagination={list.pagination}
            onPageChange={list.goToPage}
          >
            <DataTable columns={columns} data={list.items} getRowId={(row) => row.reservationId ?? row.id} />
          </ListResultsPanel>
        </Card>
      </section>
    </PrivateLayout>
  );
}
