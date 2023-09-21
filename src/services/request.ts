import axios from "axios";
import { API_ENDPOINT, BASE_URL } from "@/constants/apis";

const instance = axios.create({
    baseURL: BASE_URL,
});

instance.interceptors.request.use(async (req) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) req.headers.Authorization = `Bearer ${accessToken}`;
    return req;
});

instance.interceptors.response.use(
    async (res) => res,
    async (err) => {
        const retryRequestOriginal = err.config;

        if (err.response.status === 401 && !retryRequestOriginal._retry) {
            // flag _retry prevent infinity loop
            retryRequestOriginal._retry = true;

            // refresh token
            try {
                const req = await instance.post(API_ENDPOINT.AUTH.REFRESH_TOKEN);
                const newAccessToken = req.data.accessToken;

                localStorage.setItem("accessToken", newAccessToken);

                // recall api
                return instance(retryRequestOriginal);
            } catch (error) {
                // in case refresh token expired
                localStorage.removeItem("accessToken");
                location.assign("/login");
                return Promise.reject(error);
            }
        }
        return Promise.reject(err);
    }
);

export type TRequest = "get" | "post" | "put" | "delete" | "patch";

const request = async <Type>(type: TRequest, api: string, payload?: Type) => {
    return await instance[type]<Type>(api, payload);
};

export default request;
