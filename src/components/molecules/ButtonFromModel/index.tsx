import React, { useState } from "react";
import { Button, ButtonProps, Form, FormItemProps, Modal, message } from "antd";
import { FormCustom } from "@/components/templates";
import request, { TRequest } from "@/services/request";
import { handleDataWithAddress } from "@/utils/handle-data";
import { isEqual } from "lodash";

type TProps = {
    button: ButtonProps;
    title: string;
    req: { api: string; method: TRequest };
    keyPubsub?: string;
    data?: {
        /** id use for update data */
        id?: any;
        initialValueForm?: any;
    };
    fields?: FormItemProps[];
};

export default function ButtonFormModel({
    button,
    title,
    req,
    keyPubsub,
    fields = [],
    data,
}: TProps) {
    const [form] = Form.useForm();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish = async (value: any) => {
        console.log(value);
        // setLoading(true);
        // try {
        //     const newValue = handleDataWithAddress(value);
        //     const oldValue = handleDataWithAddress(data?.initialValueForm);
        //     const check = isEqual(newValue, oldValue);
        //     if (check) {
        //         message.info("Chưa nhập thông tin mới");
        //         setLoading(false);
        //         return;
        //     }
        //     const res = await request<any>(req.method, req.api, {
        //         id: data?.id,
        //         ...newValue,
        //     });
        //     message.success(res.data.message);
        // } catch (error: any) {
        //     message.error(error.response.data.message);
        // }
        // keyPubsub && PubSub.publishSync(keyPubsub);
        // form.resetFields();
        // setLoading(false);
        // setOpen(false);
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
                    setOpen(false);
                }}
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
