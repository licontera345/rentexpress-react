import { useCallback } from 'react';
import { PublicLayout } from '../../components/index.js';
import { SectionHeader, Card, Loading, Empty } from '../../components/index.js';
import { usePaginatedSearch } from '../../hooks/index.js';
import { vehicleService } from '../../api/index.js';
import { PAGINATION } from '../../constants/index.js';
import { ROUTES } from '../../constants/index.js';
import { Link } from 'react-router-dom';

export default function Catalog() {
  const list = usePaginatedSearch({
    fetchFn: useCallback((criteria) => vehicleService.search(criteria), []),
    defaultFilters: { pageSize: PAGINATION.DEFAULT_PAGE_SIZE },
  });

  return (
    <PublicLayout>
      <section className="page-catalog">
        <SectionHeader title="Catálogo" subtitle="Vehículos disponibles" />
        <Card>
          {list.loading && <Loading message="Cargando catálogo…" />}
          {!list.loading && list.error && <div className="alert alert-error">{list.error}</div>}
          {!list.loading && !list.error && list.items.length === 0 && (
            <Empty title="Sin resultados" description="No hay vehículos que coincidan." />
          )}
          {!list.loading && !list.error && list.items.length > 0 && (
            <ul className="catalog-list">
              {list.items.map((v) => (
                <li key={v.vehicleId ?? v.id}>
                  <Link to={`${ROUTES.CATALOG}/${v.vehicleId ?? v.id}`}>
                    {v.brand} {v.model} – {v.dailyPrice} €/día
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {list.pagination.totalPages > 1 && (
            <nav className="pagination-simple">
              <button type="button" disabled={list.pagination.pageNumber <= 1} onClick={() => list.goToPage(list.pagination.pageNumber - 1)}>Anterior</button>
              <span>Pág. {list.pagination.pageNumber} de {list.pagination.totalPages}</span>
              <button type="button" disabled={list.pagination.pageNumber >= list.pagination.totalPages} onClick={() => list.goToPage(list.pagination.pageNumber + 1)}>Siguiente</button>
            </nav>
          )}
        </Card>
      </section>
    </PublicLayout>
  );
}
