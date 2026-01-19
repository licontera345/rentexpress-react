import Config from "../../config/Config";

const UserService = {
    findById(id, token) {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return fetch(Config.getFullUrl(Config.USERS.BY_ID(id)), { headers })
            .then(response => response.ok ? response.json() : Promise.reject(response));
    },

    search(criteria = {}, token) {
        const params = new URLSearchParams();

        const addParam = (key, value) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value);
            }
        };

        addParam('userId', criteria.userId);
        addParam('username', criteria.username);
        addParam('firstName', criteria.firstName);
        addParam('lastName1', criteria.lastName1);
        addParam('lastName2', criteria.lastName2);
        addParam('birthDateFrom', criteria.birthDateFrom);
        addParam('birthDateTo', criteria.birthDateTo);
        addParam('email', criteria.email);
        addParam('roleId', criteria.roleId);
        addParam('phone', criteria.phone);
        addParam('addressId', criteria.addressId);
        addParam('activeStatus', criteria.activeStatus);
        addParam('createdAtFrom', criteria.createdAtFrom);
        addParam('createdAtTo', criteria.createdAtTo);
        addParam('updatedAtFrom', criteria.updatedAtFrom);
        addParam('updatedAtTo', criteria.updatedAtTo);
        addParam('pageNumber', criteria.pageNumber);
        addParam('pageSize', criteria.pageSize);

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = `${Config.getFullUrl(Config.USERS.SEARCH)}${params.toString() ? `?${params.toString()}` : ''}`;

        return fetch(url, { headers })
            .then(response => response.ok ? response.json() : Promise.reject(response));
    },

    createOpen(user) {
        return fetch(Config.getFullUrl(Config.USERS.CREATE_OPEN), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    create(user, token) {
        return fetch(Config.getFullUrl(Config.USERS.CREATE), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(user)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    update(id, user, token) {
        return fetch(Config.getFullUrl(Config.USERS.UPDATE(id)), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(user)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    delete(id, token) {
        return fetch(Config.getFullUrl(Config.USERS.DELETE(id)), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => response.ok ? true : Promise.reject(response));
    },

    activate(id, token) {
        return fetch(Config.getFullUrl(Config.USERS.ACTIVATE(id)), {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    }
};

export default UserService;
