import React from "react";
import { Tabs } from "antd";
import { EOrder } from "@/enums/order-enums";
import { OrderList } from "@/components/organisms";

type TProps = {
    filter?: any;
    isAccept?: boolean;
    isSeller?: boolean;
};

export default function OrdersView({ filter, isAccept, isSeller }: TProps) {
    return (
        <Tabs
            defaultActiveKey="all"
            items={[
                {
                    key: EOrder.ORDERED,
                    label: "Đã đặt",
                    children: (
                        <OrderList
                            filter={{ ...filter, statusOrder: EOrder.ORDERED }}
                            isAccept={isAccept}
                            isSeller={isSeller}
                        />
                    ),
                },
                {
                    key: EOrder.DELIVERING,
                    label: "Đang vận chuyển",
                    children: (
                        <OrderList
                            filter={{ ...filter, statusOrder: EOrder.DELIVERING }}
                            isSeller={isSeller}
                        />
                    ),
                },
                {
                    key: EOrder.FINISH,
                    label: "Hoàn thành",
                    children: (
                        <OrderList
                            filter={{ ...filter, statusOrder: EOrder.FINISH }}
                            isSeller={isSeller}
                        />
                    ),
                },
                {
                    key: EOrder.CANCEL,
                    label: "Đã hủy",
                    children: (
                        <OrderList
                            filter={{ ...filter, statusOrder: EOrder.CANCEL }}
                            isSeller={isSeller}
                        />
                    ),
                },
                {
                    key: EOrder.REQUEST_REFUND,
                    label: "Yêu cầu hoàn tiền",
                    children: (
                        <OrderList
                            filter={{ ...filter, statusOrder: EOrder.REQUEST_REFUND }}
                            isSeller={isSeller}
                        />
                    ),
                },
            ]}
        />
    );
}
