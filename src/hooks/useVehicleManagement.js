import { useCallback, useEffect, useMemo, useState } from 'react';
import VehicleService from '../api/services/VehicleService';
import VehicleCategoryService from '../api/services/VehicleCategoryService';
import VehicleStatusService from '../api/services/VehicleStatusService';
import { useAuth } from './useAuth';
import { DEFAULT_ACTIVE_STATUS, MESSAGES, PAGINATION } from '../constants';

const DEFAULT_FILTERS = {
  brand: '',
  model: '',
  licensePlate: '',
  categoryId: '',
  vehicleStatusId: '',
  minPrice: '',
  maxPrice: '',
  activeStatus: ''
};

const DEFAULT_FORM_DATA = {
  brand: '',
  model: '',
  licensePlate: '',
  vinNumber: '',
  manufactureYear: '',
  dailyPrice: '',
  currentMileage: '',
  categoryId: '',
  vehicleStatusId: '',
  currentHeadquartersId: '',
  activeStatus: String(DEFAULT_ACTIVE_STATUS),
  description: ''
};

const toInputValue = (value) => {
  if (value === null || value === undefined) return '';
  return String(value);
};

const normalizeVehicleForm = (vehicle = {}) => ({
  brand: toInputValue(vehicle.brand),
  model: toInputValue(vehicle.model),
  licensePlate: toInputValue(vehicle.licensePlate),
  vinNumber: toInputValue(vehicle.vinNumber),
  manufactureYear: toInputValue(vehicle.manufactureYear),
  dailyPrice: toInputValue(vehicle.dailyPrice),
  currentMileage: toInputValue(vehicle.currentMileage),
  categoryId: toInputValue(vehicle.categoryId),
  vehicleStatusId: toInputValue(vehicle.vehicleStatusId),
  currentHeadquartersId: toInputValue(vehicle.currentHeadquartersId),
  activeStatus: vehicle.activeStatus !== undefined ? String(vehicle.activeStatus) : String(DEFAULT_ACTIVE_STATUS),
  description: toInputValue(vehicle.description)
});

const buildPayload = (payload) => Object.entries(payload).reduce((acc, [key, value]) => {
  if (value !== undefined && value !== '') {
    acc[key] = value;
  }
  return acc;
}, {});

const useVehicleManagement = () => {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [lastCriteria, setLastCriteria] = useState({
    pageNumber: PAGINATION.DEFAULT_PAGE,
    pageSize: PAGINATION.MAX_PAGE_SIZE
  });

  const loadVehicles = useCallback(async (criteria) => {
    setLoading(true);
    setError('');
    try {
      const result = await VehicleService.search(criteria);
      setVehicles(result.results || result || []);
      setLastCriteria(criteria);
    } catch (err) {
      setVehicles([]);
      setError(err?.message || MESSAGES.ERROR_LOADING_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [vehiclesData, categoriesData, statusesData] = await Promise.all([
        VehicleService.search({
          pageNumber: PAGINATION.DEFAULT_PAGE,
          pageSize: PAGINATION.MAX_PAGE_SIZE
        }),
        VehicleCategoryService.getAll(),
        VehicleStatusService.getAll()
      ]);
      setVehicles(vehiclesData.results || vehiclesData || []);
      setCategories(categoriesData || []);
      setStatuses(statusesData || []);
      setLastCriteria({
        pageNumber: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.MAX_PAGE_SIZE
      });
    } catch (err) {
      setVehicles([]);
      setError(err?.message || MESSAGES.ERROR_LOADING_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleFilterChange = useCallback((event) => {
    const { name, value } = event.target;
    setFilters((prev) => Object.assign({}, prev, {
      [name]: value
    }));
  }, []);

  const applyFilters = useCallback(async () => {
    const criteria = {
      brand: filters.brand?.trim() || undefined,
      model: filters.model?.trim() || undefined,
      licensePlate: filters.licensePlate?.trim() || undefined,
      categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
      vehicleStatusId: filters.vehicleStatusId ? Number(filters.vehicleStatusId) : undefined,
      dailyPriceMin: filters.minPrice ? Number(filters.minPrice) : undefined,
      dailyPriceMax: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      activeStatus: filters.activeStatus !== '' ? filters.activeStatus === 'true' : undefined,
      pageNumber: PAGINATION.DEFAULT_PAGE,
      pageSize: PAGINATION.MAX_PAGE_SIZE
    };
    await loadVehicles(criteria);
  }, [filters, loadVehicles]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    loadVehicles({
      pageNumber: PAGINATION.DEFAULT_PAGE,
      pageSize: PAGINATION.MAX_PAGE_SIZE
    }).catch(() => {});
  }, [loadVehicles]);

  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => Object.assign({}, prev, {
      [name]: value
    }));

    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      return Object.assign({}, prev, { [name]: null });
    });

    setStatusMessage('');
    setErrorMessage('');
  }, []);

  const startCreate = useCallback(() => {
    setEditingVehicleId(null);
    setFormData(DEFAULT_FORM_DATA);
    setFieldErrors({});
    setStatusMessage('');
    setErrorMessage('');
  }, []);

  const startEdit = useCallback(async (vehicleId) => {
    setFormLoading(true);
    setFieldErrors({});
    setStatusMessage('');
    setErrorMessage('');
    try {
      const vehicle = await VehicleService.findById(vehicleId);
      setFormData(normalizeVehicleForm(vehicle));
      setEditingVehicleId(vehicleId);
    } catch (err) {
      setErrorMessage(err?.message || MESSAGES.FETCH_VEHICLE_ERROR);
    } finally {
      setFormLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    const nextErrors = {};
    ['brand', 'model', 'licensePlate', 'manufactureYear', 'dailyPrice', 'categoryId', 'vehicleStatusId', 'currentHeadquartersId']
      .forEach((field) => {
        if (!formData[field]) {
          nextErrors[field] = MESSAGES.FIELD_REQUIRED;
        }
      });

    if (formData.dailyPrice && Number.isNaN(Number(formData.dailyPrice))) {
      nextErrors.dailyPrice = MESSAGES.FIELD_REQUIRED;
    }

    if (formData.manufactureYear && Number.isNaN(Number(formData.manufactureYear))) {
      nextErrors.manufactureYear = MESSAGES.FIELD_REQUIRED;
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setErrorMessage(MESSAGES.REQUIRED_FIELDS);
      return;
    }

    if (!token) {
      setErrorMessage(MESSAGES.LOGIN_REQUIRED);
      return;
    }

    const payload = buildPayload({
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      licensePlate: formData.licensePlate.trim(),
      vinNumber: formData.vinNumber?.trim() || undefined,
      manufactureYear: formData.manufactureYear ? Number(formData.manufactureYear) : undefined,
      dailyPrice: formData.dailyPrice ? Number(formData.dailyPrice) : undefined,
      currentMileage: formData.currentMileage ? Number(formData.currentMileage) : undefined,
      categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
      vehicleStatusId: formData.vehicleStatusId ? Number(formData.vehicleStatusId) : undefined,
      currentHeadquartersId: formData.currentHeadquartersId ? Number(formData.currentHeadquartersId) : undefined,
      activeStatus: formData.activeStatus === 'true',
      description: formData.description?.trim() || undefined
    });

    setFormLoading(true);
    try {
      if (editingVehicleId) {
        await VehicleService.update(editingVehicleId, payload, token);
        setStatusMessage(MESSAGES.VEHICLE_UPDATED);
      } else {
        await VehicleService.create(payload, token);
        setStatusMessage(MESSAGES.VEHICLE_CREATED);
        setFormData(DEFAULT_FORM_DATA);
      }
      await loadVehicles(lastCriteria);
    } catch (err) {
      setErrorMessage(err?.message || MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setFormLoading(false);
    }
  }, [editingVehicleId, formData, lastCriteria, loadVehicles, token]);

  const handleDelete = useCallback(async (vehicleId) => {
    if (!token) {
      setErrorMessage(MESSAGES.LOGIN_REQUIRED);
      return;
    }

    const confirmed = window.confirm(MESSAGES.CONFIRM_DELETE_VEHICLE);
    if (!confirmed) {
      return;
    }

    setFormLoading(true);
    try {
      await VehicleService.delete(vehicleId, token);
      setStatusMessage(MESSAGES.VEHICLE_DELETED);
      await loadVehicles(lastCriteria);
      if (editingVehicleId === vehicleId) {
        startCreate();
      }
    } catch (err) {
      setErrorMessage(err?.message || MESSAGES.ERROR_DELETING);
    } finally {
      setFormLoading(false);
    }
  }, [editingVehicleId, lastCriteria, loadVehicles, startCreate, token]);

  const brandOptions = useMemo(() => {
    const uniqueBrands = new Set();
    vehicles.forEach((vehicle) => {
      if (vehicle?.brand) {
        uniqueBrands.add(vehicle.brand);
      }
    });
    return [...uniqueBrands];
  }, [vehicles]);

  return {
    vehicles,
    categories,
    statuses,
    filters,
    loading,
    formLoading,
    error,
    fieldErrors,
    statusMessage,
    errorMessage,
    formData,
    editingVehicleId,
    selectedVehicleId,
    setSelectedVehicleId,
    brandOptions,
    applyFilters,
    resetFilters,
    handleFilterChange,
    handleFormChange,
    handleSubmit,
    startCreate,
    startEdit,
    handleDelete
  };
};

export default useVehicleManagement;
