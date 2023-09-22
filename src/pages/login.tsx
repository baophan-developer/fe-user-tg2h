import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { message } from "antd";
import { useRouter } from "next/router";
import AuthLayout from "@/layouts/AuthLayout";
import { FormCustom } from "@/components/templates";
import { getInputEmail, getInputPassword, getInputRememberMe } from "@/components/atoms";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import ROUTERS from "@/constants/routers";

const BottomStyled = styled.div`
    display: flex;
    justify-content: space-between;

    & a {
        color: #000;
    }
`;

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
            <BottomStyled>
                <Link href={ROUTERS.FORGOT_PASSWORD}>Quên mật khẩu?</Link>
                <Link href={ROUTERS.REGISTER}>Bạn chưa có tài khoản?</Link>
            </BottomStyled>
        </>
    );
}

Login.getLayout = function getLayout(page: React.ReactElement) {
    return <AuthLayout>{page}</AuthLayout>;
};
