import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Result, message } from "antd";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import ROUTERS from "@/constants/routers";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";
import { useSocket } from "@/contexts/SocketContext";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";
import { EVENTS } from "@/constants/events";

export default function CheckoutSuccess() {
    const socket = useSocket();
    const router = useRouter();
    const user = useRecoilValue(UserAtom);
    /**
     * payment_success with status code 00
     * payment_cancel with status code 02
     */
    const { vnp_TransactionStatus } = router.query;
    const [statusPayment, setStatusPayment] = useState<string>();

    const handleSaveOrder = async (statusPayment: string) => {
        try {
            if (statusPayment === "00") {
                // get from local storage
                const orderStored = JSON.parse(localStorage.getItem("order") as string);
                // set statusPayment = true
                const order = { ...orderStored, statusPayment: true };
                // call api
                const res = await request<any>("post", API_ENDPOINT.ORDER.CREATE, order);
                message.success(res.data.message);
                // remove query, prevent reload page will addition orders
                router.replace("/checkout-success", undefined, { shallow: true });

                // Create notification for seller is here
                socket.emit(EVENTS.NOTIFICATION.EMIT, {
                    title: "Bạn có một đơn hàng mới",
                    message: `Đơn hàng được đặt bởi ${user.name}`,
                    userReceive: order.seller,
                });

                // remove ordered
                localStorage.removeItem("order");
                PubSub.publishSync(PUBSUB_SUBSCRIBE_NAME.GET_CART);
            }
        } catch (error) {}
    };

    useEffect(() => {
        vnp_TransactionStatus && handleSaveOrder(vnp_TransactionStatus as string);
        vnp_TransactionStatus && setStatusPayment(vnp_TransactionStatus as string);
    }, [router.query]);

    if (statusPayment !== "00")
        return (
            <Result
                status="error"
                title="Thanh toán không thành công!"
                subTitle="Bạn đã hủy thanh toán."
                extra={<Button onClick={() => router.push(ROUTERS.HOME)}>Quay về</Button>}
            />
        );

    if (statusPayment === "00")
        return (
            <Result
                status="success"
                title="Thanh toán thành công!"
                subTitle="Đơn hàng đã được thanh toán."
                extra={<Button onClick={() => router.push(ROUTERS.HOME)}>Quay về</Button>}
            />
        );

    return <div></div>;
}
