import Config from "../../config/apiConfig";
import { request } from "../axiosClient";

const AddressService = {
    async findById(id) {
        try {
            return await request({
                url: Config.ADDRESSES.BY_ID(id),
                method: "GET"
            });
        } catch (error) {
            if (![403, 404, 500].includes(error?.status)) {
                throw error;
            }

            return request({
                url: Config.ADDRESSES.BY_ID_OPEN(id),
                method: "GET"
            });
        }
    },
    findByIdOpen(id) {
        return request({
            url: Config.ADDRESSES.BY_ID_OPEN(id),
            method: "GET"
        });
    },

    create(address) {
        return request({
            url: Config.ADDRESSES.CREATE,
            method: "POST",
            data: address
        });
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
            data: address
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
