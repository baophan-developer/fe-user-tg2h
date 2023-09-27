import React, { useState } from "react";
import { Button, ButtonProps, Modal, message } from "antd";
import request, { TRequest } from "@/services/request";

type TProps = {
    title: React.ReactNode;
    button: ButtonProps;
    req: { method: TRequest; api: string; data?: any };
    children?: React.ReactNode;
    keyPubsub?: string;
};

export default function ButtonModel({ title, button, children, req, keyPubsub }: TProps) {
    const [open, setOpen] = useState<boolean>(false);

    const handleApi = async () => {
        try {
            console.log(req.data);
            const res = await request<any>(req.method, req.api, req.data);
            keyPubsub && PubSub.publishSync(keyPubsub);
            message.success(res.data.message);
            setOpen(false);
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
