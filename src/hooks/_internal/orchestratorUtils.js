import { PAGINATION } from '../../constants';

export const createPaginationState = ({
  pageNumber = PAGINATION.DEFAULT_PAGE,
  totalPages = PAGINATION.DEFAULT_PAGE,
  totalRecords = 0
} = {}) => ({
  pageNumber,
  totalPages,
  totalRecords
});

export const createEmptyPaginationState = () => createPaginationState();

export const updateFilterValue = (setFilters, event) => {
  const { name, value } = event.target;
  setFilters((prev) => Object.assign({}, prev, { [name]: value }));
};
