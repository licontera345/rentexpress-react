import Config from "../../config/Config";
import { request } from "../axiosClient";

const RoleService = {
    async getAll() {
        try {
            return await request({
                url: Config.ROLES.ALL,
                method: "GET"
            });
        } catch (error) {
            return [];
        }
    },

    getById(id) {
        return request({
            url: Config.ROLES.BY_ID(id),
            method: "GET"
        });
    }
};

export default RoleService;
