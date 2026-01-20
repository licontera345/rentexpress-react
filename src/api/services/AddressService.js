import Config from "../../config/Config";
import { buildAuthHeaders, request } from "../axiosClient";

const AddressService = {
    findById(id, token) {
        return request({
            url: Config.ADDRESSES.BY_ID(id),
            method: "GET",
            headers: buildAuthHeaders(token)
        });
    },

    create(address, token) {
        return request({
            url: Config.ADDRESSES.CREATE,
            method: "POST",
            data: address,
            headers: buildAuthHeaders(token)
        });
    },

    update(id, address, token) {
        return request({
            url: Config.ADDRESSES.UPDATE(id),
            method: "PUT",
            data: address,
            headers: buildAuthHeaders(token)
        });
    },

    async delete(id, token) {
        await request({
            url: Config.ADDRESSES.DELETE(id),
            method: "DELETE",
            headers: buildAuthHeaders(token)
        });
        return true;
    }
};

export default AddressService;
