import Config from "../../config/Config";
import { buildAuthHeaders, buildParams, request } from "../axiosClient";

const UserService = {
    findById(id, token) {
        return request({
            url: Config.USERS.BY_ID(id),
            method: "GET",
            headers: buildAuthHeaders(token)
        });
    },

    search(criteria = {}, token) {
        return request({
            url: Config.USERS.SEARCH,
            method: "GET",
            params: buildParams({
                userId: criteria.userId,
                username: criteria.username,
                firstName: criteria.firstName,
                lastName1: criteria.lastName1,
                lastName2: criteria.lastName2,
                birthDateFrom: criteria.birthDateFrom,
                birthDateTo: criteria.birthDateTo,
                email: criteria.email,
                roleId: criteria.roleId,
                phone: criteria.phone,
                addressId: criteria.addressId,
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

    createOpen(user) {
        return request({
            url: Config.USERS.CREATE_OPEN,
            method: "POST",
            data: user
        });
    },

    create(user, token) {
        return request({
            url: Config.USERS.CREATE,
            method: "POST",
            data: user,
            headers: buildAuthHeaders(token)
        });
    },

    update(id, user, token) {
        return request({
            url: Config.USERS.UPDATE(id),
            method: "PUT",
            data: user,
            headers: buildAuthHeaders(token)
        });
    },

    async delete(id, token) {
        await request({
            url: Config.USERS.DELETE(id),
            method: "DELETE",
            headers: buildAuthHeaders(token)
        });
        return true;
    },

    activate(id, token) {
        return request({
            url: Config.USERS.ACTIVATE(id),
            method: "POST",
            headers: buildAuthHeaders(token)
        });
    }
};

export default UserService;
