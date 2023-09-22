import React from "react";
import styled from "styled-components";
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

const HeadingStyled = styled.h2`
    margin-bottom: 30px;
    text-align: center;
`;

export default function FormCustom({ form, fields, title, bottomForm }: TProps) {
    return (
        <div>
            <HeadingStyled>{title}</HeadingStyled>
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
