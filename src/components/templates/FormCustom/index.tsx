import React from "react";
import { type FormProps, type FormItemProps, type ButtonProps, Form, Button } from "antd";

type TProps = {
    form?: FormProps;
    fields: FormItemProps[];
    api?: string;
    title?: React.ReactNode;
    bottomForm: {
        button?: ButtonProps;
        item?: FormItemProps;
    };
};

export default function FormCustom({ form, fields, title, bottomForm }: TProps) {
    return (
        <div>
            <h2>{title}</h2>
            <Form {...form}>
                {fields.map((item: FormItemProps, index) => (
                    <Form.Item key={index} {...item} />
                ))}
                <Form.Item {...bottomForm.item}>
                    <Button {...bottomForm.button} />
                </Form.Item>
            </Form>
        </div>
    );
}
