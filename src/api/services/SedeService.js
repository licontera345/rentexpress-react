import Config from "../../config/apiConfig";
import { request } from "../axiosClient";

const SedeService = {
    getAll() {
        return request({
            url: Config.HEADQUARTERS.ALL,
            method: "GET"
        });
    },

    getById(id) {
        return request({
            url: Config.HEADQUARTERS.BY_ID(id),
            method: "GET"
        });
    },

    create(headquarters) {
        return request({
            url: Config.HEADQUARTERS.CREATE,
            method: "POST",
            data: headquarters
        });
    },

    update(id, headquarters) {
        return request({
            url: Config.HEADQUARTERS.UPDATE(id),
            method: "PUT",
            data: headquarters
        });
    },

    async delete(id) {
        await request({
            url: Config.HEADQUARTERS.DELETE(id),
            method: "DELETE"
        });
        return true;
    }
};

export default SedeService;
