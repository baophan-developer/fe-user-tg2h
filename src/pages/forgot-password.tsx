import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { Form, message } from "antd";
import { getInputEmail } from "@/components/atoms";
import { FormCustom } from "@/components/templates";
import AuthLayout from "@/layouts/AuthLayout";
import request from "@/services/request";
import ROUTERS from "@/constants/routers";
import { API_ENDPOINT } from "@/constants/apis";

const BottomStyled = styled.div`
    & a {
        color: #000;
    }
`;

export default function ForgotPassword() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish = async (value: any) => {
        setLoading(true);
        try {
            const res = await request("post", API_ENDPOINT.AUTH.FORGOT_PASSWORD, value);
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
                title="Quên mật khẩu"
                form={{ layout: "vertical", onFinish: onFinish, form: form }}
                fields={[getInputEmail()]}
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

ForgotPassword.getLayout = function getLayout(page: React.ReactElement) {
    return <AuthLayout>{page}</AuthLayout>;
};
