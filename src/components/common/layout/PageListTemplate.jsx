import PrivateLayout from '../../layout/private/PrivateLayout';
import SectionHeader from './SectionHeader';
import ListResultsPanel from './ListResultsPanel';
import { Card } from './LayoutPrimitives';
import FilterPanel from '../filters/FilterPanel';

export default function PageListTemplate({
    title,
    subtitle,
    headerActions,

    filterFields,
    filterValues,
    onFilterChange,
    onFilterApply,
    onFilterReset,
    filterTitle,
    isFilterLoading,

    pageAlert,
    onCloseAlert,
    isLoading,
    error,
    emptyDescription,
    hasItems,
    pagination,
    onPageChange,

    children,
    modals
}) {
    return (
        <PrivateLayout>
            <section className="personal-space">
                <SectionHeader title={title} subtitle={subtitle}>
                    {headerActions}
                </SectionHeader>

                <Card className="personal-space-card">
                    <div className="vehicle-list-layout">
                        <aside className="vehicle-filter-panel">
                            <FilterPanel
                                fields={filterFields}
                                values={filterValues}
                                onChange={onFilterChange}
                                onApply={onFilterApply}
                                onReset={onFilterReset}
                                title={filterTitle}
                                isLoading={isFilterLoading}
                                className="vehicle-filters-panel"
                            />
                        </aside>

                        <ListResultsPanel
                            pageAlert={pageAlert}
                            onCloseAlert={onCloseAlert}
                            loading={isLoading}
                            error={error}
                            emptyDescription={emptyDescription}
                            hasItems={hasItems}
                            pagination={pagination}
                            onPageChange={onPageChange}
                        >
                            {children}
                        </ListResultsPanel>
                    </div>
                </Card>
            </section>

            {modals}
        </PrivateLayout>
    );
}
