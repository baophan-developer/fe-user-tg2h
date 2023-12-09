import React, { useState } from "react";
import { Button, ButtonProps, Modal, message } from "antd";
import request, { TRequest } from "@/services/request";
import { useSocket } from "@/contexts/SocketContext";
import { IOrder } from "@/interfaces";
import { EVENTS } from "@/constants/events";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";

export const actionOrders = {
    CONFIRM_ORDER: "confirm_order",
    REQUEST_REFUND: "request_refund",
    CONFIRM_REFUND: "confirm_refund",
};

type TProps = {
    title: React.ReactNode;
    button: ButtonProps;
    req: { method: TRequest; api: string; data?: any };
    children?: React.ReactNode;
    keyPubsub?: string;
    createNotification?: {
        data: any;
        action: "confirm_order" | "request_refund" | "confirm_refund";
    };
};

export default function ButtonModel({
    title,
    button,
    children,
    req,
    keyPubsub,
    createNotification,
}: TProps) {
    const socket = useSocket();
    const user = useRecoilValue(UserAtom);
    const [open, setOpen] = useState<boolean>(false);

    const handleApi = async () => {
        try {
            const res = await request<any>(req.method, req.api, req.data);
            keyPubsub && PubSub.publishSync(keyPubsub);
            message.success(res.data.message);
            setOpen(false);

            if (createNotification)
                switch (createNotification.action) {
                    case actionOrders.CONFIRM_ORDER:
                        socket.emit("notification", {
                            title: "Xác nhận đã nhận hàng",
                            message: `Đơn hàng ${createNotification.data.code} đã được xác nhận, đã nhận hàng từ người dùng ${user.name}`,
                            userReceive: createNotification.data.seller._id,
                        });
                        break;

                    case actionOrders.REQUEST_REFUND:
                        socket.emit("notification", {
                            title: "Yêu cầu trả hàng",
                            message: `Đơn hàng ${createNotification.data.code} được yêu cầu hoàn trả từ người dùng ${user.name}`,
                            userReceive: createNotification.data.seller._id,
                        });
                        break;

                    case actionOrders.CONFIRM_REFUND:
                        socket.emit("notification", {
                            title: "Xác nhận hoàn trả",
                            message: `Đơn hàng ${createNotification.data.code} được xác nhận yêu cầu hoàn trả từ người bán ${createNotification.data.seller.name}`,
                            userReceive: createNotification.data.owner._id,
                        });
                        break;

                    default:
                        break;
                }
        } catch (error: any) {
            message.error(error.response.data.message);
        }
    };

    return (
        <div>
            <Button {...button} onClick={() => setOpen(true)} />
            <Modal
                title={title}
                open={open}
                okText="Xác nhận"
                cancelText="Hủy"
                onCancel={() => setOpen(false)}
                onOk={handleApi}
            >
                {children}
            </Modal>
        </div>
    );
}
