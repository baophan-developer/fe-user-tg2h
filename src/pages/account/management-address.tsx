import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Form, List, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";
import { FormCustom } from "@/components/templates";
import { getInputAddress, getInputStreet } from "@/components/atoms";
import request from "@/services/request";
import UserAtom from "@/stores/UserStore";
import { IAddress } from "@/interfaces";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";
import { API_ENDPOINT } from "@/constants/apis";

const ActionStyled = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const HeadingTwoStyled = styled.h2`
    font-weight: 400;
`;

const HeadingThreeStyled = styled.p`
    font-size: 16px;
    font-weight: 400;
`;

export default function Address() {
    const user = useRecoilValue(UserAtom);
    const [form] = Form.useForm();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [addressData, setAddressData] = useState<IAddress[]>([]);

    const onFinish = async (value: any) => {
        setLoading(true);
        try {
            const res = await request("put", API_ENDPOINT.PROFILE.UPDATE_ADDRESS, {
                ...value.address,
                street: value.street,
            });
            message.success(res.data.message, 1);
        } catch (error: any) {
            message.error(error.response.data.message, 1);
        }
        form.resetFields();
        setLoading(false);
        setOpen(false);
        PubSub.publishSync(PUBSUB_SUBSCRIBE_NAME.GET_INFO);
    };

    useEffect(() => {
        setAddressData(user.address);
    }, [user]);

    return (
        <div>
            <ActionStyled>
                <Button icon={<PlusOutlined />} onClick={() => setOpen(true)}>
                    Thêm địa chỉ mới
                </Button>
                <Modal
                    title="Thêm địa chỉ mới"
                    open={open}
                    onCancel={() => {
                        setOpen(false);
                        form.resetFields();
                    }}
                    onOk={() => {
                        form.submit();
                    }}
                    okText="Xác nhận"
                    cancelText="Hủy"
                    okButtonProps={{ loading: loading }}
                >
                    <FormCustom
                        form={{ layout: "vertical", form: form, onFinish: onFinish }}
                        fields={[getInputAddress(), getInputStreet()]}
                        bottomForm={{}}
                    />
                </Modal>
            </ActionStyled>
            <List
                header={<HeadingTwoStyled>Địa chỉ</HeadingTwoStyled>}
                dataSource={addressData}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button key={1} type="default">
                                Chỉnh sửa
                            </Button>,
                            <Button key={2} type="primary" danger>
                                Xóa
                            </Button>,
                        ]}
                    >
                        <List.Item.Meta
                            title={
                                <HeadingThreeStyled>{item.address}</HeadingThreeStyled>
                            }
                            description={item.street}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
}

Address.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout title="Quản lý danh sách địa chỉ">{page}</AccountLayout>
        </UserLayout>
    );
};
