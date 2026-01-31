import Config from "../../config/apiConfig";
import { request } from "../axiosClient";

const ProvinceService = {
    findAll() {
        return request({
            url: Config.PROVINCES.ALL,
            method: "GET"
        });
    },

    findById(id) {
        return request({
            url: Config.PROVINCES.BY_ID(id),
            method: "GET"
        });
    },

    create(province) {
        return request({
            url: Config.PROVINCES.CREATE,
            method: "POST",
            data: province
        });
    },

    update(id, province) {
        return request({
            url: Config.PROVINCES.UPDATE(id),
            method: "PUT",
            data: province
        });
    },

    async delete(id) {
        await request({
            url: Config.PROVINCES.DELETE(id),
            method: "DELETE"
        });
        return true;
    }
};

export default ProvinceService;
