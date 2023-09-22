import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import AuthLayout from "@/layouts/AuthLayout";
import { FormCustom } from "@/components/templates";
import { getInputPassword, getInputConfirmPassword } from "@/components/atoms";
import { Form, message } from "antd";
import request from "@/services/request";
import ROUTERS from "@/constants/routers";
import { API_ENDPOINT } from "@/constants/apis";

const BottomStyled = styled.div`
    & a {
        color: #000;
    }
`;

export default function ResetPassword() {
    const route = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish = async (value: any) => {
        setLoading(true);
        try {
            const res = await request<any>("post", API_ENDPOINT.AUTH.RESET_PASSWORD, {
                password: value.password,
                token: route.query.reset,
            });
            message.success(res.data.message, 1);
            form.resetFields();
        } catch (error: any) {
            message.error(error.response.data.message, 1);
        }
        setLoading(false);
    };

    return (
        <>
            <FormCustom
                title="Đặt lại mật khẩu"
                form={{ layout: "vertical", onFinish: onFinish, form: form }}
                fields={[getInputPassword(), getInputConfirmPassword()]}
                bottomForm={{
                    button: {
                        type: "primary",
                        loading: loading,
                        htmlType: "submit",
                        style: { width: "100%" },
                        children: "Xác nhận",
                    },
                }}
            />
            <BottomStyled>
                <Link href={ROUTERS.LOGIN}>Quay về đăng nhập</Link>
            </BottomStyled>
        </>
    );
}

ResetPassword.getLayout = function getLayout(page: React.ReactElement) {
    return <AuthLayout>{page}</AuthLayout>;
};
