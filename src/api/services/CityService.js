import Config from "../../config/apiConfig";
import { buildAuthHeaders, request } from "../axiosClient";

const CityService = {
    findAll() {
        return request({
            url: Config.CITIES.ALL,
            method: "GET"
        });
    },

    findById(id, token) {
        return request({
            url: Config.CITIES.BY_ID(id),
            method: "GET",
            headers: buildAuthHeaders(token)
        });
    },

    findByProvinceId(provinceId) {
        return request({
            url: Config.CITIES.BY_PROVINCE(provinceId),
            method: "GET"
        });
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
