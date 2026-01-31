import Config from "../../config/apiConfig";
import { request } from "../axiosClient";

const CityService = {
    findAll() {
        return request({
            url: Config.CITIES.ALL,
            method: "GET"
        });
    },

    findById(id) {
        return request({
            url: Config.CITIES.BY_ID(id),
            method: "GET"
        });
    },

    findByProvinceId(provinceId) {
        return request({
            url: Config.CITIES.BY_PROVINCE(provinceId),
            method: "GET"
        });
    },

    create(city) {
        return request({
            url: Config.CITIES.CREATE,
            method: "POST",
            data: city
        });
    },

    update(id, city) {
        return request({
            url: Config.CITIES.UPDATE(id),
            method: "PUT",
            data: city
        });
    },

    async delete(id) {
        await request({
            url: Config.CITIES.DELETE(id),
            method: "DELETE"
        });
        return true;
    }
};

export default CityService;
