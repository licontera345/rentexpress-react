import Config from "../../config/apiConfig";
import { request } from "../axiosClient";

// La API solo expone GET /addresses/open/{id} y POST /addresses/open para lectura/creación pública.
const AddressService = {
    findById(id) {
        return request({
            url: Config.ADDRESSES.BY_ID_OPEN(id),
            method: "GET"
        });
    },

    findByIdOpen(id) {
        return this.findById(id);
    },

    createPublic(address) {
        return request({
            url: Config.ADDRESSES.CREATE_OPEN,
            method: "POST",
            data: address
        });
    },

    update(id, address) {
        return request({
            url: Config.ADDRESSES.UPDATE(id),
            method: "PUT",
            data: Object.assign({}, address, { id })
        });
    },

    async delete(id) {
        await request({
            url: Config.ADDRESSES.DELETE(id),
            method: "DELETE"
        });
        return true;
    }
};

export default AddressService;
