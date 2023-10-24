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
        DELETE_ADDRESS: "profile/delete-address",
        CHOOSE_ADDRESS: "profile/choose-address-is-main",
    },
    PRODUCT: {
        GET: "product",
        CREATE: "product/create",
    },
    CART: {
        GET: "session-cart/",
        ADD_TO_CART: "session-cart/add",
        REMOVE_TO_CART: "session-cart/remove",
        DECREASE_TO_CART: "session-cart/decrease",
    },
    ORDER: {
        GET: "order/",
        CREATE: "order/create-order",
        CALCULATOR: "order/calculator-payment",
        ACCEPT: "order/accept-order",
        CANCEL: "order/cancel-order",
        REFUND: "order/refund",
    },
    DISCOUNT: {
        MAIN: "discount/",
        APPLY: "discount/use",
        REMOVE: "discount/remove",
    },
    COMMENTS: {
        MAIN: "comment/",
        ADD: "comment/add",
    },
    SIZE_SCREEN: "size-screen/",
    SCAN_FREQUENCY_SCREEN: "scan-frequency-screen/",
    RESOLUTION_SCREEN: "resolution-screen/",
    TYPE_RAM: "type-ram/",
    CAPACITY_RAM: "capacity-ram/",
    TYPE_ROM: "type-rom/",
    CAPACITY_ROM: "capacity-rom/",
    GPU: "gpu/",
    CPU: "cpu/",
    BRAND: "brand/",
    CATEGORY: "category/",
    OS: "os/",
    SHIPPING: "shipping/",
    PAYMENT: "payment/",
};

export const BASE_URL_PROVINCE_VIETNAM = process.env.NEXT_PUBLIC_PROVINCE_VIETNAM_URL;

export const API_ENDPOINT_PROVINCE_VIETNAM = {
    LIST_PROVINCE: "/",
    LIST_DISTRICT: "/district",
    LIST_WARD: "/ward",
};
