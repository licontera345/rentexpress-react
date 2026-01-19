import Config from "../../config/Config";

const EmployeeService = {
    findById(id, token) {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return fetch(Config.getFullUrl(Config.EMPLOYEES.BY_ID(id)), { headers })
            .then(response => response.ok ? response.json() : Promise.reject(response));
    },

    search(criteria = {}, token) {
        const params = new URLSearchParams();

        const addParam = (key, value) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value);
            }
        };

        addParam('employeeId', criteria.employeeId);
        addParam('employeeName', criteria.employeeName);
        addParam('roleId', criteria.roleId);
        addParam('headquartersId', criteria.headquartersId);
        addParam('firstName', criteria.firstName);
        addParam('lastName1', criteria.lastName1);
        addParam('lastName2', criteria.lastName2);
        addParam('email', criteria.email);
        addParam('phone', criteria.phone);
        addParam('activeStatus', criteria.activeStatus);
        addParam('createdAtFrom', criteria.createdAtFrom);
        addParam('createdAtTo', criteria.createdAtTo);
        addParam('updatedAtFrom', criteria.updatedAtFrom);
        addParam('updatedAtTo', criteria.updatedAtTo);
        addParam('pageNumber', criteria.pageNumber);
        addParam('pageSize', criteria.pageSize);

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = `${Config.getFullUrl(Config.EMPLOYEES.SEARCH)}${params.toString() ? `?${params.toString()}` : ''}`;

        return fetch(url, { headers })
            .then(response => response.ok ? response.json() : Promise.reject(response));
    },

    create(employee, token) {
        return fetch(Config.getFullUrl(Config.EMPLOYEES.CREATE), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(employee)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    update(id, employee, token) {
        return fetch(Config.getFullUrl(Config.EMPLOYEES.UPDATE(id)), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(employee)
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    },

    delete(id, token) {
        return fetch(Config.getFullUrl(Config.EMPLOYEES.DELETE(id)), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => response.ok ? true : Promise.reject(response));
    },

    activate(id, token) {
        return fetch(Config.getFullUrl(Config.EMPLOYEES.ACTIVATE(id)), {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => response.ok ? response.json() : Promise.reject(response));
    }
};

export default EmployeeService;
