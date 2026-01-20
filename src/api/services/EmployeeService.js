import Config from "../../config/Config";
import { buildAuthHeaders, buildParams, request } from "../axiosClient";

const EmployeeService = {
    findById(id, token) {
        return request({
            url: Config.EMPLOYEES.BY_ID(id),
            method: "GET",
            headers: buildAuthHeaders(token)
        });
    },

    search(criteria = {}, token) {
        return request({
            url: Config.EMPLOYEES.SEARCH,
            method: "GET",
            params: buildParams({
                employeeId: criteria.employeeId,
                employeeName: criteria.employeeName,
                roleId: criteria.roleId,
                headquartersId: criteria.headquartersId,
                firstName: criteria.firstName,
                lastName1: criteria.lastName1,
                lastName2: criteria.lastName2,
                email: criteria.email,
                phone: criteria.phone,
                activeStatus: criteria.activeStatus,
                createdAtFrom: criteria.createdAtFrom,
                createdAtTo: criteria.createdAtTo,
                updatedAtFrom: criteria.updatedAtFrom,
                updatedAtTo: criteria.updatedAtTo,
                pageNumber: criteria.pageNumber,
                pageSize: criteria.pageSize
            }),
            headers: buildAuthHeaders(token)
        });
    },

    create(employee, token) {
        return request({
            url: Config.EMPLOYEES.CREATE,
            method: "POST",
            data: employee,
            headers: buildAuthHeaders(token)
        });
    },

    update(id, employee, token) {
        return request({
            url: Config.EMPLOYEES.UPDATE(id),
            method: "PUT",
            data: employee,
            headers: buildAuthHeaders(token)
        });
    },

    async delete(id, token) {
        await request({
            url: Config.EMPLOYEES.DELETE(id),
            method: "DELETE",
            headers: buildAuthHeaders(token)
        });
        return true;
    },

    activate(id, token) {
        return request({
            url: Config.EMPLOYEES.ACTIVATE(id),
            method: "POST",
            headers: buildAuthHeaders(token)
        });
    }
};

export default EmployeeService;
