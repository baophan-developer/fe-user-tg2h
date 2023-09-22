import React from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { useRouter } from "next/router";
import { FormCustom } from "@/components/templates";
import { getInputEmail, getInputPassword, getInputRememberMe } from "@/components/atoms";
import { message } from "antd";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import ROUTERS from "@/constants/routers";

export default function Login() {
    const route = useRouter();

    const onFinish = async (value: any) => {
        try {
            const res = await request("post", API_ENDPOINT.AUTH.LOGIN, value);
            // save token
            localStorage.setItem("accessToken", res.data.accessToken);
            message.success(res.data.message, 1);
            route.push(ROUTERS.HOME);
        } catch (error: any) {
            message.error(error.response.data.message, 1);
        }
    };

    return (
        <>
            <FormCustom
                title="Đăng nhập"
                form={{ layout: "vertical", onFinish: onFinish }}
                fields={[getInputEmail(), getInputPassword(), getInputRememberMe()]}
                bottomForm={{
                    button: {
                        children: "Đăng nhập",
                        type: "primary",
                        style: { width: "100%" },
                        htmlType: "submit",
                    },
                }}
            />
        </>
    );
}

Login.getLayout = function getLayout(page: React.ReactElement) {
    return <AuthLayout>{page}</AuthLayout>;
};
