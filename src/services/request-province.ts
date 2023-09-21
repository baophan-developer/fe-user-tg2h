import axios from "axios";
import { BASE_URL_PROVINCE_VIETNAM } from "@/constants/apis";
import { TRequest } from "./request";

const instance = axios.create({
    baseURL: BASE_URL_PROVINCE_VIETNAM,
});

const requestProvinceVietnam = async (type: TRequest, api: string) => {
    const res = await instance[type](api);
    return res;
};

export default requestProvinceVietnam;
