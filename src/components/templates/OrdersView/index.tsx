import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { IOrder } from "@/interfaces";
import { EOrder } from "@/enums/order-enums";
import request, { TRequest } from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";
import useChangeSizeWindow from "@/hooks/useChangeSizeWindow";
import { OrderList } from "@/components/organisms";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";

interface IQuery {
    filter?: any;
    sort?: any;
    pagination?: any;
}

interface IListOrder extends IOrder {
    key: React.Key;
}

type TProps = {
    filter?: any;
    isAccept?: boolean;
    isSeller?: boolean;
};

export default function OrdersView({ filter, isAccept, isSeller }: TProps) {
    const size = useChangeSizeWindow();

    const [orders, setOrders] = useState<IListOrder[]>([]);
    const [query, setQuery] = useState<IQuery>({
        filter: { statusOrder: EOrder.ORDERED },
    });

    const getOrder = async () => {
        try {
            const res = await request<any>("post", API_ENDPOINT.ORDER.GET, query);
            const data = res.data.list.map((item: any, index: number) => ({
                key: index + 1,
                ...item,
            }));
            setOrders(data);
        } catch (error: any) {}
    };

    useEffect(() => {
        setQuery((prev) => ({ ...prev, filter: { ...prev.filter, ...filter } }));
    }, [filter]);

    useEffect(() => {
        if (query.filter?.owner) getOrder();
        if (query.filter?.seller) getOrder();
        PubSub.subscribe(PUBSUB_SUBSCRIBE_NAME.GET_ORDER, getOrder);
        return () => {
            PubSub.unsubscribe(PUBSUB_SUBSCRIBE_NAME.GET_ORDER);
        };
    }, [query]);

    return (
        <Tabs
            style={{ width: size.width < 500 ? "390px" : "100%" }}
            defaultActiveKey="all"
            items={[
                {
                    key: EOrder.ORDERED,
                    label: "Đã đặt",
                    children: (
                        <OrderList
                            orders={orders}
                            isAccept={isAccept}
                            isSeller={isSeller}
                        />
                    ),
                },
                {
                    key: EOrder.DELIVERING,
                    label: "Đang vận chuyển",
                    children: <OrderList orders={orders} isSeller={isSeller} />,
                },
                {
                    key: EOrder.FINISH,
                    label: "Hoàn thành",
                    children: <OrderList orders={orders} isSeller={isSeller} />,
                },
                {
                    key: EOrder.CANCEL,
                    label: "Đã hủy",
                    children: <OrderList orders={orders} isSeller={isSeller} />,
                },
                {
                    key: EOrder.REQUEST_REFUND,
                    label: "Yêu cầu hoàn tiền",
                    children: <OrderList orders={orders} isSeller={isSeller} />,
                },
            ]}
            onChange={(arg) => {
                setQuery((prev) => ({
                    ...prev,
                    filter: { ...prev.filter, statusOrder: arg },
                }));
            }}
        />
    );
}
