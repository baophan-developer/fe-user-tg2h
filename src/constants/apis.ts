export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const API_ENDPOINT = {
    AUTH: {
        LOGIN: "auth/login",
        REGISTER: "auth/register",
        LOGOUT: "auth/logout",
        REFRESH_TOKEN: "auth/refresh-token",
        FORGOT_PASSWORD: "auth/forgot-password",
        RESET_PASSWORD: "auth/reset-password",
    },
    PROFILE: {
        GET: "profile/",
        UPDATE_PROFILE: "profile/update-profile",
        UPDATE_AVATAR: "profile/update-avatar",
        CREATE_ADDRESS: "profile/create-address",
        UPDATE_ADDRESS: "profile/update-address",
        REMOVE_ADDRESS: "profile/remove-address",
    },
};

export const BASE_URL_PROVINCE_VIETNAM = process.env.NEXT_PUBLIC_PROVINCE_VIETNAM_URL;

export const API_ENDPOINT_PROVINCE_VIETNAM = {
    LIST_PROVINCE: "/",
    LIST_DISTRICT: "/district",
    LIST_WARD: "/ward",
};
