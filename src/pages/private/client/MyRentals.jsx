import { useCallback } from 'react';
import { PrivateLayout } from '../../../components/index.js';
import { SectionHeader, Card, ListResultsPanel, DataTable } from '../../../components/index.js';
import { usePaginatedSearch } from '../../../hooks/index.js';
import { rentalService } from '../../../api/index.js';
import { useAuth } from '../../../hooks/index.js';
import { PAGINATION } from '../../../constants/index.js';

export default function MyRentals() {
  const { user } = useAuth();
  const userId = user?.userId ?? user?.id;

  const list = usePaginatedSearch({
    fetchFn: useCallback(
      (criteria) => rentalService.search({ ...criteria, userId }),
      [userId]
    ),
    defaultFilters: { userId, pageSize: PAGINATION.SEARCH_PAGE_SIZE },
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
        <SectionHeader title="Mis alquileres" subtitle="Tus alquileres activos" />
        <Card>
          <ListResultsPanel
            title="Resultados"
            subtitle={list.pagination.totalRecords != null ? `Pág. ${list.pagination.pageNumber} · ${list.pagination.totalRecords} resultados` : null}
            loading={list.loading}
            error={list.error}
            emptyTitle="Sin alquileres"
            emptyDescription="Aún no tienes alquileres."
            hasItems={list.items.length > 0}
            pagination={list.pagination}
            onPageChange={list.goToPage}
          >
            <DataTable columns={columns} data={list.items} getRowId={(row) => row.rentalId ?? row.id} />
          </ListResultsPanel>
        </Card>
      </section>
    </PrivateLayout>
  );
}
