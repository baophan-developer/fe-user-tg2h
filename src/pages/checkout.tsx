import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { Button, Layout, List, Modal, Radio } from "antd";
import UserAtom from "@/stores/UserStore";
import CheckoutAtom from "@/stores/CheckoutStore";
import { CiLocationOn } from "react-icons/ci";
import { AddressModal } from "@/components/organisms";

const { Header } = Layout;

const LayoutStyled = styled(Layout)`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const HeaderStyled = styled(Header)`
    background-color: #fff;
    height: fit-content;

    & h2 {
        font-weight: 400;
    }
`;

const AddressStyled = styled(Header)`
    background-color: #fff;
    height: fit-content;

    & h2 {
        height: 32px;
    }
`;

const AddressItemStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    & h3 {
        font-weight: 400;
    }

    @media only screen and (max-width: 500px) {
        margin: 20px 0;
        flex-direction: column;
        align-items: last baseline;
        line-height: 20px;
        gap: 10px;
    }
`;

export default function Checkout() {
    const user = useRecoilValue(UserAtom);
    const checkout = useRecoilValue(CheckoutAtom);

    // form address
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [address, setAddress] = useState<string>();
    const [defaultAddress, setDefaultAddress] = useState<number>(0);

    useEffect(() => {
        user.address &&
            setAddress(
                `${user.address[defaultAddress].street} - ${user.address[defaultAddress].address}`
            );
    }, [user]);

    return (
        <LayoutStyled>
            <HeaderStyled>
                <h2>ĐẶT HÀNG | THANH TOÁN</h2>
            </HeaderStyled>
            <AddressStyled>
                <h2>
                    Địa chỉ của bạn <CiLocationOn />
                </h2>
                <AddressItemStyled>
                    <div>
                        <h3>{address}</h3>
                    </div>
                    <Button onClick={() => setOpenModal(!openModal)}>Thay đổi</Button>
                    <Modal
                        title="Địa chỉ của tôi"
                        open={openModal}
                        onOk={() => setOpenModal(!openModal)}
                        onCancel={() => setOpenModal(!openModal)}
                    >
                        <Radio.Group
                            style={{ width: "100%" }}
                            onChange={(e) => {
                                setAddress(
                                    `${user.address[e.target.value].street} - ${
                                        user.address[e.target.value].address
                                    }`
                                );
                                setDefaultAddress(e.target.value);
                            }}
                            value={defaultAddress}
                        >
                            <List
                                dataSource={user.address}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <Radio
                                            value={index}
                                            style={{ marginRight: "20px" }}
                                        />
                                        <List.Item.Meta
                                            title={item.address}
                                            description={item.street}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Radio.Group>
                        <AddressModal />
                    </Modal>
                </AddressItemStyled>
            </AddressStyled>
            <div></div>
        </LayoutStyled>
    );
}
