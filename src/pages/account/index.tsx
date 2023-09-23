import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import dayjs from "dayjs";
import styled from "styled-components";
import { Form, message } from "antd";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";
import { FormCustom } from "@/components/templates";
import {
    getInputChooseDay,
    getInputEmail,
    getInputGender,
    getInputName,
    getInputPhoneNumber,
} from "@/components/atoms";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";

const ContentStyled = styled.div`
    width: 100%;
    display: flex;
`;

export default function Account() {
    const user = useRecoilValue(UserAtom);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);

    const updateInfo = async (value: any) => {
        setLoading(true);
        try {
            const res = await request("put", API_ENDPOINT.PROFILE.UPDATE_PROFILE, {
                ...value,
                birthday: dayjs(value.birthday).format("YYYY-MM-DD"),
            });
            message.success(res.data.message);
            PubSub.publishSync(PUBSUB_SUBSCRIBE_NAME.GET_INFO);
        } catch (error: any) {
            message.error(error.response.data.message, 1);
        }
        setLoading(false);
    };

    useEffect(() => {
        form.setFieldsValue({ ...user, birthday: dayjs(user.birthday) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <ContentStyled>
            <FormCustom
                form={{
                    form: form,
                    onFinish: updateInfo,
                    labelCol: { span: 5 },
                    wrapperCol: { span: 16 },
                    style: { width: "70%" },
                }}
                fields={[
                    getInputEmail({ disabled: true }),
                    getInputName(),
                    getInputPhoneNumber(),
                    getInputChooseDay({ format: "YYYY-MM-DD" }),
                    getInputGender(),
                ]}
                bottomForm={{
                    item: { wrapperCol: { offset: 5 } },
                    button: {
                        htmlType: "submit",
                        children: "Cập nhật",
                        type: "primary",
                        loading: loading,
                    },
                }}
            />
            <div></div>
        </ContentStyled>
    );
}

Account.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout title="Quản lý thông tin cá nhân của bạn">
                {page}
            </AccountLayout>
        </UserLayout>
    );
};
