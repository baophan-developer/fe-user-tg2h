import React, { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import styled from "styled-components";
import { Form, message } from "antd";
import { FormCustom } from "@/components/templates";
import { RangePickerProps } from "antd/es/date-picker";
import AuthLayout from "@/layouts/AuthLayout";
import {
    getInputChooseDay,
    getInputConfirmPassword,
    getInputEmail,
    getInputGender,
    getInputName,
    getInputPassword,
    getInputPhoneNumber,
} from "@/components/atoms";
import request from "@/services/request";
import ROUTERS from "@/constants/routers";
import { API_ENDPOINT } from "@/constants/apis";

const BottomStyled = styled.div`
    & a {
        color: #000;
    }
`;

const disableDay: RangePickerProps["disabledDate"] = (current) => {
    return current && current > dayjs().endOf("day");
};

interface IRegisterUser {
    email: string;
    password: string;
    name: string;
    phone: string;
    birthday: Date;
    gender: boolean;
}

export default function Register() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish = async (value: IRegisterUser) => {
        setLoading(true);
        try {
            const { email, password, name, phone, birthday, gender } = value;
            const res = await request<any>("post", API_ENDPOINT.AUTH.REGISTER, {
                email,
                password,
                name,
                phone,
                gender,
                birthday: new Date(dayjs(birthday).format("YYYY-MM-DD")),
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
                title="Đăng ký"
                form={{ layout: "vertical", onFinish: onFinish, form: form }}
                fields={[
                    getInputEmail(),
                    getInputName(),
                    getInputPassword(),
                    getInputConfirmPassword(),
                    getInputPhoneNumber(),
                    getInputChooseDay({
                        style: { width: "100%" },
                        placeholder: "Chọn năm sinh",
                        disabledDate: disableDay,
                    }),
                    getInputGender(),
                ]}
                bottom={{
                    buttons: [
                        {
                            type: "primary",
                            loading: loading,
                            htmlType: "submit",
                            style: { width: "100%" },
                            children: "Đăng ký",
                        },
                    ],
                }}
            />
            <BottomStyled>
                <Link href={ROUTERS.LOGIN}>Trở về trang đăng nhập</Link>
            </BottomStyled>
        </>
    );
}
Register.getLayout = function getLayout(page: React.ReactElement) {
    return <AuthLayout>{page}</AuthLayout>;
};
