import React, { useState } from "react";
import { Button, Image, Input, List, Modal, message } from "antd";
import { IOrder } from "@/interfaces";
import { EOrder, EStatusShipping } from "@/enums/order-enums";
import styled from "styled-components";
import useChangeSizeWindow from "@/hooks/useChangeSizeWindow";
import { FaTruck } from "react-icons/fa";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import { ButtonFormModel, ButtonModel } from "@/components/molecules";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";

const { TextArea } = Input;

const HeaderListStyled = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 16px;
`;

const handleColorStatusOrder = (statusShipping?: string) => {
    switch (statusShipping) {
        case EStatusShipping.PENDING:
        case EStatusShipping.PREPARING:
            return "#faad14";
        case EStatusShipping.DELIVER_RECEIVE_ITEM:
        case EStatusShipping.IN_STORE:
            return "#d4380d";
        case EStatusShipping.DELIVERING:
        case EStatusShipping.DELIVERED:
            return "#389e0d";
        default:
            return "#000000";
    }
};

const HeaderItemStyled = styled.div<{ $statusShipping?: string }>`
    display: flex;
    gap: 10px;

    :nth-child(1) {
        display: flex;
        gap: 10px;
        align-items: center;
        color: ${(props) => handleColorStatusOrder(props.$statusShipping)};
    }

    :nth-child(2) {
        text-transform: uppercase;
        color: green;
    }
`;

const FooterItemStyled = styled.div`
    display: flex;
    justify-content: space-between;

    & div {
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-size: 16px;

        & span {
            display: flex;
            gap: 10px;
            justify-content: center;

            & p {
                color: red;
                font-size: 22px;
            }
        }
    }
`;

const ItemPriceStyled = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;

    :nth-child(1) {
        text-decoration: line-through;
    }

    :nth-child(2) {
        font-size: 16px;
        color: red;
    }

    :nth-child(3) {
        font-size: 16px;
    }
`;

type TProps = {
    orders: IOrder[];
    isAccept?: boolean;
    isSeller?: boolean;
};

const OrderList = ({ orders = [], isAccept, isSeller }: TProps) => {
    const size = useChangeSizeWindow();
    const user = useRecoilValue(UserAtom);
    const [open, setOpen] = useState<boolean>(false);

    const acceptOrder = async (orderId: string) => {
        try {
            const res = await request<any>("post", API_ENDPOINT.ORDER.ACCEPT, {
                orderId,
            });
            message.success(res.data.message);
            PubSub.publishSync(PUBSUB_SUBSCRIBE_NAME.GET_ORDER);
            setOpen(!open);
        } catch (error: any) {
            message.error(error.response.data.message);
        }
    };

    return (
        <List
            style={{ width: "100%" }}
            dataSource={orders}
            renderItem={(order) => (
                <List.Item>
                    <List
                        style={{ width: "100%" }}
                        header={
                            <HeaderListStyled>
                                <div>
                                    {size.width > 500 &&
                                        `${isSeller ? "Người mua:" : "Người bán:"}`}{" "}
                                    {isSeller ? order.owner.name : order.seller.name}
                                </div>
                                <HeaderItemStyled $statusShipping={order.statusShipping}>
                                    <p>
                                        <FaTruck /> {order.statusShipping}
                                    </p>
                                    |<p>{order.statusOrder}</p>
                                </HeaderItemStyled>
                            </HeaderListStyled>
                        }
                        footer={
                            <FooterItemStyled>
                                <span>
                                    <i>Trạng thái thanh toán: </i>
                                    <p>
                                        {order.statusPayment
                                            ? "Đã thanh toán"
                                            : "Chưa thanh toán"}
                                    </p>
                                    <i>Trạng thái hoàn tiền:</i>
                                    <p>{order.refund ? "Đã hoàn tiền" : "Không"}</p>
                                    {order.statusOrder === EOrder.CANCEL && (
                                        <span>
                                            <i>Lý do hủy đơn:</i>
                                            <p>{order.reasonCancel}</p>
                                        </span>
                                    )}
                                </span>
                                <div>
                                    <span>
                                        Thành tiền:
                                        <p> {order.totalPayment.toLocaleString("vi")}</p>
                                    </span>
                                    {order.statusOrder === EOrder.ORDERED && (
                                        <ButtonFormModel
                                            button={{
                                                children: "Hủy",
                                                danger: true,
                                                type: "primary",
                                                style: {
                                                    display: "flex",
                                                    justifyContent: "center",
                                                },
                                            }}
                                            funcHandleData={(value) => value}
                                            req={{
                                                method: "post",
                                                api: API_ENDPOINT.ORDER.CANCEL,
                                            }}
                                            title="Bạn có muốn hủy đơn"
                                            data={{
                                                id: order._id,
                                                idUserRequest: user._id,
                                            }}
                                            fields={[
                                                {
                                                    name: "reasonCancel",
                                                    label: "Lý do hủy đơn",
                                                    children: (
                                                        <TextArea placeholder="Nhập lý do hủy đơn." />
                                                    ),
                                                },
                                            ]}
                                            keyPubsub={PUBSUB_SUBSCRIBE_NAME.GET_ORDER}
                                        />
                                    )}
                                    {!order.refund &&
                                        order.statusOrder === EOrder.REQUEST_REFUND &&
                                        user._id === order.seller._id && (
                                            <ButtonModel
                                                button={{
                                                    type: "primary",
                                                    children: "Hoàn tiền",
                                                }}
                                                req={{
                                                    method: "post",
                                                    api: API_ENDPOINT.ORDER.REFUND,
                                                    data: {
                                                        orderId: order._id,
                                                    },
                                                }}
                                                title="Hoàn tiền"
                                                children="Hoàn tiền cho đơn hàng yêu cầu hủy đơn."
                                                keyPubsub={
                                                    PUBSUB_SUBSCRIBE_NAME.GET_ORDER
                                                }
                                            />
                                        )}
                                    {isAccept && (
                                        <div>
                                            <Button
                                                type="primary"
                                                onClick={() => setOpen(!open)}
                                            >
                                                Duyệt
                                            </Button>
                                            <Modal
                                                title="Duyệt đơn hàng"
                                                open={open}
                                                okText="Đồng ý"
                                                cancelText="Hủy"
                                                onCancel={() => setOpen(!open)}
                                                onOk={() => {
                                                    acceptOrder(order._id);
                                                }}
                                            >
                                                Bạn đồng ý với đơn hàng?
                                            </Modal>
                                        </div>
                                    )}
                                </div>
                            </FooterItemStyled>
                        }
                        dataSource={order.items}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        <div>
                                            <Image
                                                src={item.product.images[0]}
                                                width={50}
                                                preview={false}
                                            />
                                        </div>
                                    }
                                    title={<p>{item.product.name}</p>}
                                    description={
                                        <ItemPriceStyled>
                                            <p>
                                                {item.product.price.toLocaleString("vi")}
                                            </p>
                                            <p>
                                                {(
                                                    item.price / item.quantity
                                                ).toLocaleString("vi")}
                                            </p>
                                            <p>x{item.quantity}</p>
                                        </ItemPriceStyled>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </List.Item>
            )}
        />
    );
};

export default OrderList;
