import Config from "../../config/apiConfig";
import { buildAuthHeaders, request } from "../axiosClient";

const SedeService = {
    async getAll() {
        try {
            return await request({
                url: Config.HEADQUARTERS.ALL,
                method: "GET"
            });
        } catch (error) {
            return [];
        }
    },

    getById(id, token) {
        return request({
            url: Config.HEADQUARTERS.BY_ID(id),
            method: "GET",
            headers: buildAuthHeaders(token)
        });
    },

    create(headquarters, token) {
        return request({
            url: Config.HEADQUARTERS.CREATE,
            method: "POST",
            data: headquarters,
            headers: buildAuthHeaders(token)
        });
    },

    update(id, headquarters, token) {
        return request({
            url: Config.HEADQUARTERS.UPDATE(id),
            method: "PUT",
            data: headquarters,
            headers: buildAuthHeaders(token)
        });
    },

    async delete(id, token) {
        await request({
            url: Config.HEADQUARTERS.DELETE(id),
            method: "DELETE",
            headers: buildAuthHeaders(token)
        });
        return true;
    }
};

export default SedeService;
