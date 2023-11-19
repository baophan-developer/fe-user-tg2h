import React, { useState } from "react";
import { Button, ButtonProps, Form, FormItemProps, Modal, message } from "antd";
import { FormCustom } from "@/components/templates";
import request, { TRequest } from "@/services/request";
import { isEqual } from "lodash";
import { useSocket } from "@/contexts/SocketContext";
import { IOrder } from "@/interfaces";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";
import { EVENTS } from "@/constants/events";

type TProps = {
    button: ButtonProps;
    title: React.ReactNode;
    req: { api: string; method: TRequest };
    keyPubsub?: string;
    dataPubsub?: any;
    data?: {
        /** id use for update data */
        id?: any;
        idUserRequest?: any;
        initialValueForm?: any;
        order?: IOrder;
    };
    fields?: FormItemProps[];
    width?: number | string;
    usingFormData?: boolean;
    funcHandleData: (value: any) => any;
    isRealtime?: boolean;
};

export default function ButtonFormModel({
    button,
    title,
    req,
    keyPubsub,
    dataPubsub,
    fields = [],
    data,
    width,
    funcHandleData,
    usingFormData,
    isRealtime,
}: TProps) {
    const [form] = Form.useForm();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const socket = useSocket();

    const onFinish = async (value: any) => {
        setLoading(true);
        try {
            const newValue = funcHandleData(value);
            const oldValue = funcHandleData(data?.initialValueForm);
            const check = isEqual(newValue, oldValue);
            if (check) {
                message.info("Chưa nhập thông tin mới");
                setLoading(false);
                return;
            }
            const dataSend = usingFormData
                ? newValue
                : { id: data?.id, idUserRequest: data?.idUserRequest, ...newValue };
            const res = await request<any>(req.method, req.api, dataSend);
            message.success(res.data.message);
            // Create notification realtime
            if (isRealtime && data?.order) {
                let userReceive: string;
                let nameUserCancel: string;

                if (data.idUserRequest === data.order.owner._id) {
                    nameUserCancel = data.order.owner.name;
                    userReceive = data?.order?.seller._id;
                } else {
                    nameUserCancel = data.order.seller.name;
                    userReceive = data?.order?.owner._id;
                }

                // Create notification for seller is here
                socket.emit(EVENTS.NOTIFICATION.EMIT, {
                    title: "Hủy đơn hàng",
                    message: `Đơn hàng ${data.order.code} đã bị hủy bởi ${nameUserCancel}`,
                    userReceive: userReceive,
                });

                PubSub.publishSync(PUBSUB_SUBSCRIBE_NAME.GET_COUNT_NOTIFICATION);
            }
        } catch (error: any) {
            message.error(error.response?.data?.message);
            setLoading(false);
            return;
        }
        keyPubsub && PubSub.publishSync(keyPubsub, dataPubsub);
        form.resetFields();
        setLoading(false);
        setOpen(false);
    };

    return (
        <div>
            <Button {...button} onClick={() => setOpen(true)} />
            <Modal
                title={title}
                open={open}
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ loading: loading }}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    form.resetFields();
                    setLoading(false);
                    setOpen(false);
                }}
                width={width}
            >
                <FormCustom
                    form={{
                        layout: "vertical",
                        form: form,
                        onFinish: onFinish,
                        initialValues: data?.initialValueForm,
                    }}
                    fields={fields}
                />
            </Modal>
        </div>
    );
}
