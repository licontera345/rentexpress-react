import Config from "../../config/apiConfig";
import { buildAuthHeaders, request } from "../axiosClient";

const ProvinceService = {
    async findAll() {
        try {
            return await request({
                url: Config.PROVINCES.ALL,
                method: "GET"
            });
        } catch (error) {
            return [];
        }
    },

    findById(id) {
        return request({
            url: Config.PROVINCES.BY_ID(id),
            method: "GET"
        });
    },

    create(province, token) {
        return request({
            url: Config.PROVINCES.CREATE,
            method: "POST",
            data: province,
            headers: buildAuthHeaders(token)
        });
    },

    update(id, province, token) {
        return request({
            url: Config.PROVINCES.UPDATE(id),
            method: "PUT",
            data: province,
            headers: buildAuthHeaders(token)
        });
    },

    async delete(id, token) {
        await request({
            url: Config.PROVINCES.DELETE(id),
            method: "DELETE",
            headers: buildAuthHeaders(token)
        });
        return true;
    }
};

export default ProvinceService;
