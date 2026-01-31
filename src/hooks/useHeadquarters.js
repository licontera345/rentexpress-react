import { useState, useEffect } from 'react';
import { getStoredToken } from '../api/axiosClient';
import AddressService from '../api/services/AddressService';
import SedeService from '../api/services/SedeService';
import { getId } from '../utils/entityNormalizers';

const hasEmbeddedAddress = (headquarters) => {
    if (!headquarters) return false;
    return Boolean(
        headquarters.address
        || headquarters.addressDto
        || headquarters.addressList
        || headquarters.addresses
        || headquarters.addressName
    );
};

const resolveAddressId = (headquarters) => {
    if (!headquarters) return null;
    return getId(
        headquarters,
        'addressId',
        'address.addressId',
        'address.id',
        'addressDto.addressId',
        'addressDto.id'
    );
};

const enrichHeadquartersWithAddresses = async (items) => {
    if (!Array.isArray(items) || items.length === 0) return [];

    const storedToken = getStoredToken();

    const addressRequests = new Map();

    const enriched = await Promise.all(
        items.map(async (headquarters) => {
            if (!headquarters || hasEmbeddedAddress(headquarters)) {
                return headquarters;
            }

            const addressId = resolveAddressId(headquarters);
            if (!addressId) {
                return headquarters;
            }

            let requestPromise = addressRequests.get(addressId);
            if (!requestPromise) {
                requestPromise = storedToken
                    ? AddressService.findById(addressId, storedToken)
                    : AddressService.findByIdOpen(addressId);
                addressRequests.set(addressId, requestPromise);
            }

            try {
                const address = await requestPromise;
                return address ? { ...headquarters, address } : headquarters;
            } catch {
                return headquarters;
            }
        })
    );

    return enriched;
};

const useHeadquarters = () => {
    const [headquarters, setHeadquarters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeadquarters = async () => {
            try {
                setLoading(true);
                const data = await SedeService.getAll();
                const enriched = await enrichHeadquartersWithAddresses(data || []);
                setHeadquarters(enriched);
                setError(null);
            } catch (err) {
                setError(err.message || 'Error al cargar sedes');
                setHeadquarters([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHeadquarters();
    }, []);

    return { headquarters, loading, error };
};

export default useHeadquarters;
