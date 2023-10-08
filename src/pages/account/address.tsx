import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { List } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";
import UserAtom from "@/stores/UserStore";
import { IAddress } from "@/interfaces";
import { getInputAddress, getInputStreet } from "@/components/atoms";
import { ButtonFormModel, ButtonModel } from "@/components/molecules";
import { API_ENDPOINT } from "@/constants/apis";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";
import { handleDataWithAddress } from "@/utils/handle-data";

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
    const [addressData, setAddressData] = useState<IAddress[]>([]);

    useEffect(() => {
        setAddressData(user.address);
    }, [user]);

    return (
        <div>
            <ActionStyled>
                <ButtonFormModel
                    title="Thêm địa chỉ mới"
                    button={{ children: "Thêm địa chỉ mới", icon: <PlusOutlined /> }}
                    fields={[getInputAddress(), getInputStreet()]}
                    req={{ method: "post", api: API_ENDPOINT.PROFILE.CREATE_ADDRESS }}
                    keyPubsub={PUBSUB_SUBSCRIBE_NAME.GET_INFO}
                    funcHandleData={handleDataWithAddress}
                />
            </ActionStyled>
            <List
                header={<HeadingTwoStyled>Địa chỉ</HeadingTwoStyled>}
                dataSource={addressData}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <ButtonFormModel
                                key={1}
                                title="Cập nhật địa chỉ"
                                button={{
                                    children: "Chỉnh sửa",
                                }}
                                req={{
                                    method: "put",
                                    api: API_ENDPOINT.PROFILE.UPDATE_ADDRESS,
                                }}
                                fields={[getInputAddress(), getInputStreet()]}
                                data={{
                                    id: item._id,
                                    initialValueForm: {
                                        address: {
                                            provinceId: item.provinceId,
                                            districtId: item.districtId,
                                            wardId: item.wardId,
                                            address: item.address,
                                        },
                                        street: item.street,
                                    },
                                }}
                                keyPubsub={PUBSUB_SUBSCRIBE_NAME.GET_INFO}
                                funcHandleData={handleDataWithAddress}
                            />,
                            <ButtonModel
                                key={2}
                                title="Xóa địa chỉ"
                                button={{
                                    danger: true,
                                    type: "primary",
                                    children: "Xóa",
                                }}
                                req={{
                                    method: "delete",
                                    api: `${API_ENDPOINT.PROFILE.DELETE_ADDRESS}/${item._id}`,
                                }}
                                keyPubsub={PUBSUB_SUBSCRIBE_NAME.GET_INFO}
                            >
                                <div>Bạn có muốn xóa địa chỉ?</div>
                            </ButtonModel>,
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
