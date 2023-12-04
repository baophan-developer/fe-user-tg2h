import React, { useEffect, useState } from "react";
import { Button, Image, Input, List, Modal, message, notification } from "antd";
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
import dayjs from "dayjs";
import { useSocket } from "@/contexts/SocketContext";
import { EVENTS } from "@/constants/events";

const { TextArea } = Input;

const HeaderListStyled = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 14px;

    @media only screen and (max-width: 500px) {
        flex-direction: column;
    }
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
        gap: 10px;
    }

    @media only screen and (max-width: 500px) {
        flex-direction: column;
        gap: 10px;

        & div {
            & span {
                justify-content: flex-start;
                text-align: center;
            }
        }
    }
`;

const TotalPaymentStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-size: 14px;

    & span {
        display: flex;
        gap: 10px;
        justify-content: center;

        & p {
            color: red;
            font-size: 20px;
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
    isAccept?: boolean;
    isSeller?: boolean;
    isStatistical?: boolean;
    pagination?: {
        total?: number;
    };
    filter?: any;
};

interface IListOrder extends IOrder {
    key: React.Key;
}

interface IQuery {
    filter?: any;
    sort?: any;
}

const OrderList = ({ filter, isAccept, isSeller, isStatistical }: TProps) => {
    const size = useChangeSizeWindow();
    const user = useRecoilValue(UserAtom);
    const [total, setTotal] = useState<number>(0);

    const [orders, setOrders] = useState<IListOrder[]>([]);
    const [query, setQuery] = useState<IQuery>({
        filter: { ...filter },
    });

    const socket = useSocket();

    const getOrder = async () => {
        try {
            const res = await request<any>("post", API_ENDPOINT.ORDER.GET, query);
            const data = res.data.list.map((item: any, index: number) => ({
                key: index + 1,
                ...item,
            }));
            setOrders(data);
            setTotal(res.data.total);
        } catch (error: any) {}
    };

    useEffect(() => {
        setQuery((prev) => ({ ...prev, filter: { ...prev.filter, ...filter } }));
    }, [filter]);

    useEffect(() => {
        if (query.filter) getOrder();
        PubSub.subscribe(PUBSUB_SUBSCRIBE_NAME.GET_ORDER, getOrder);
        return () => {
            PubSub.unsubscribe(PUBSUB_SUBSCRIBE_NAME.GET_ORDER);
        };
    }, [query]);

    useEffect(() => {
        socket.on(EVENTS.NOTIFICATION.ON, () => {
            setQuery({ filter: { ...filter } });
        });
    }, []);

    return (
        <List
            pagination={
                total > 10 && {
                    total: total,
                    size: "small",
                    onChange: (page) =>
                        setQuery((prev) => ({
                            ...prev,
                            pagination: { page: page - 1, limit: 10 },
                        })),
                }
            }
            locale={{ emptyText: "Không có đơn hàng nào" }}
            style={{ width: "100%" }}
            dataSource={orders}
            renderItem={(order) => (
                <List.Item>
                    <List
                        style={{ width: "100%" }}
                        header={
                            <HeaderListStyled>
                                <div>
                                    <div>Mã đơn hàng: {order.code}</div>
                                    <div>
                                        {size.width > 500 &&
                                            `${
                                                isSeller ? "Người mua:" : "Người bán:"
                                            }`}{" "}
                                        {isSeller ? order.owner.name : order.seller.name}
                                    </div>
                                </div>
                                <div>
                                    <HeaderItemStyled
                                        $statusShipping={order.statusShipping}
                                    >
                                        <p>
                                            <FaTruck /> {order.statusShipping}
                                        </p>
                                        |<p>{order.statusOrder}</p>
                                    </HeaderItemStyled>
                                </div>
                            </HeaderListStyled>
                        }
                        footer={
                            <FooterItemStyled>
                                <span>
                                    <p>
                                        Ngày đặt hàng:{" "}
                                        {dayjs(order.createdAt).format(
                                            "HH:mm DD-MM-YYYY"
                                        )}
                                    </p>
                                    {order.dayReceiveOrder && (
                                        <p>
                                            Ngày nhận hàng:{" "}
                                            {dayjs(order.dayReceiveOrder).format(
                                                "HH:mm DD-MM-YYYY"
                                            )}
                                        </p>
                                    )}
                                    <p>
                                        Trạng thái thanh toán:{" "}
                                        {order.statusPayment
                                            ? "Đã thanh toán"
                                            : "Chưa thanh toán"}{" "}
                                    </p>
                                    <p>
                                        Trạng thái hoàn tiền:{" "}
                                        {order.refund ? "Đã hoàn tiền" : "Không"}
                                    </p>
                                    {order.statusOrder === EOrder.CANCEL && (
                                        <p>Lý do hủy đơn: {order.reasonCancel}</p>
                                    )}
                                </span>
                                <div>
                                    <TotalPaymentStyled>
                                        <span>
                                            Thành tiền:
                                            <p>
                                                {" "}
                                                {order.totalPayment.toLocaleString("vi")}
                                            </p>
                                        </span>
                                    </TotalPaymentStyled>
                                    {/* Button for cancel order */}
                                    {order.statusOrder === EOrder.ORDERED &&
                                        !isStatistical && (
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
                                                    order: order,
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
                                                keyPubsub={
                                                    PUBSUB_SUBSCRIBE_NAME.GET_ORDER
                                                }
                                                isRealtime
                                            />
                                        )}
                                    {/* Button for refund order */}
                                    {order.statusOrder === EOrder.REQUEST_REFUND &&
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
                                                isRealtime
                                                order={order}
                                            />
                                        )}
                                    {/* Button for accept order */}
                                    {isAccept && (
                                        <ButtonModel
                                            button={{
                                                type: "primary",
                                                children: "Xác nhận",
                                            }}
                                            req={{
                                                method: "post",
                                                api: API_ENDPOINT.ORDER.ACCEPT,
                                                data: {
                                                    orderId: order._id,
                                                },
                                            }}
                                            title="Xác nhận đơn hàng"
                                            children="Duyệt đơn hàng và thực hiện việc giao hàng."
                                            keyPubsub={PUBSUB_SUBSCRIBE_NAME.GET_ORDER}
                                            isRealtime
                                            order={order}
                                        />
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
