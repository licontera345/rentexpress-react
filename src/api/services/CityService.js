import Config from "../../config/apiConfig";
import { buildAuthHeaders, request } from "../axiosClient";

const CityService = {
    async findAll() {
        try {
            return await request({
                url: Config.CITIES.ALL,
                method: "GET"
            });
        } catch {
            return [];
        }
    },

    findById(id, token) {
        return request({
            url: Config.CITIES.BY_ID(id),
            method: "GET",
            headers: buildAuthHeaders(token)
        });
    },

    async findByProvinceId(provinceId) {
        try {
            return await request({
                url: Config.CITIES.BY_PROVINCE(provinceId),
                method: "GET"
            });
        } catch {
            return [];
        }
    },

    create(city, token) {
        return request({
            url: Config.CITIES.CREATE,
            method: "POST",
            data: city,
            headers: buildAuthHeaders(token)
        });
    },

    update(id, city, token) {
        return request({
            url: Config.CITIES.UPDATE(id),
            method: "PUT",
            data: city,
            headers: buildAuthHeaders(token)
        });
    },

    async delete(id, token) {
        await request({
            url: Config.CITIES.DELETE(id),
            method: "DELETE",
            headers: buildAuthHeaders(token)
        });
        return true;
    }
};

export default CityService;
