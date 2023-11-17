import React, { useState } from "react";
import { Button, ButtonProps, Modal, message } from "antd";
import request, { TRequest } from "@/services/request";
import { useSocket } from "@/contexts/SocketContext";
import { IOrder } from "@/interfaces";

type TProps = {
    title: React.ReactNode;
    button: ButtonProps;
    req: { method: TRequest; api: string; data?: any };
    children?: React.ReactNode;
    keyPubsub?: string;
    isRealtime?: boolean;
    order?: IOrder;
};

export default function ButtonModel({
    title,
    button,
    children,
    req,
    keyPubsub,
    isRealtime,
    order,
}: TProps) {
    const [open, setOpen] = useState<boolean>(false);
    const socket = useSocket();

    const handleApi = async () => {
        try {
            const res = await request<any>(req.method, req.api, req.data);
            keyPubsub && PubSub.publishSync(keyPubsub);
            message.success(res.data.message);
            setOpen(false);

            if (isRealtime && order)
                // Create notification for seller is here
                socket.emit("notification", {
                    title: "Đơn hàng của bạn đã được duyệt.",
                    message: `Đơn hàng ${order.code} được duyệt bởi ${order.seller.name}`,
                    userReceive: order.owner._id,
                });
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
