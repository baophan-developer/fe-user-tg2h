import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Form, List, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";
import { FormCustom } from "@/components/templates";
import { getInputAddress, getInputAddressDetail } from "@/components/atoms";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import UserAtom from "@/stores/UserStore";
import { IAddress } from "@/interfaces";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";

const ActionStyled = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
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
                ...value.addressDetail,
                address: value.address,
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
                        fields={[getInputAddressDetail(), getInputAddress()]}
                        bottomForm={{}}
                    />
                </Modal>
            </ActionStyled>
            <List
                dataSource={addressData}
                renderItem={(item) => (
                    <List.Item actions={[<Button key={1}>Chỉnh sửa</Button>]}>
                        <List.Item.Meta
                            title={item.provinceId}
                            description={
                                <div>
                                    {item.address} - {item.wardId} - {item.districtId}
                                </div>
                            }
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
