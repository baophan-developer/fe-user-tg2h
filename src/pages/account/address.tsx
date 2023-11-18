import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, List, message } from "antd";
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
import { AddressModal } from "@/components/organisms";
import request from "@/services/request";

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

const ListItemStyled = styled(List.Item)`
    @media only screen and (max-width: 1000px) {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: flex-end !important;

        & .ant-list-item-meta {
            width: 100%;
        }

        & .ant-list-item-action {
            margin-inline-start: 0 !important;
        }
    }
`;

export default function Address() {
    const user = useRecoilValue(UserAtom);
    const [addressData, setAddressData] = useState<IAddress[]>([]);

    const handleChooseAddressIsMain = async (id: string) => {
        try {
            const res = await request<any>("post", API_ENDPOINT.PROFILE.CHOOSE_ADDRESS, {
                addressId: id,
            });
            message.success(res.data.message);
            PubSub.publishSync(PUBSUB_SUBSCRIBE_NAME.GET_INFO);
        } catch (error: any) {
            message.error(error.response.data.message);
        }
    };

    useEffect(() => {
        setAddressData(user.address);
    }, [user]);

    return (
        <div>
            <ActionStyled>
                <AddressModal />
            </ActionStyled>
            <List
                header={<HeadingTwoStyled>Địa chỉ</HeadingTwoStyled>}
                dataSource={addressData}
                renderItem={(item) => (
                    <ListItemStyled
                        actions={[
                            <Button
                                disabled={item.main}
                                onClick={() =>
                                    handleChooseAddressIsMain(item._id as string)
                                }
                            >
                                Chọn làm địa chỉ chính
                            </Button>,
                            <ButtonFormModel
                                key={1}
                                title="Cập nhật địa chỉ"
                                button={{
                                    children: "Chỉnh sửa",
                                    type: "primary",
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
                    </ListItemStyled>
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
