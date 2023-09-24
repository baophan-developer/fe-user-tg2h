import React from "react";
import styled from "styled-components";
import { type FormProps, type FormItemProps, type ButtonProps, Form, Button } from "antd";
import { isEmpty } from "lodash";

type TProps = {
    form?: FormProps;
    fields: FormItemProps[];
    api?: string;
    title?: React.ReactNode;
    bottom: {
        buttons?: ButtonProps[];
        item?: FormItemProps;
    };
};

const HeadingStyled = styled.h2`
    margin-bottom: 30px;
    text-align: center;
`;

export default function FormCustom({ form, fields, title, bottom }: TProps) {
    return (
        <div style={{ width: "100%" }}>
            <HeadingStyled>{title}</HeadingStyled>
            <Form {...form}>
                {fields.map((item: FormItemProps, index) => (
                    <Form.Item key={index} {...item} />
                ))}
                {!isEmpty(bottom) && (
                    <Form.Item {...bottom.item}>
                        {bottom.buttons?.map((item, index) => (
                            <Button key={index} {...item} />
                        ))}
                    </Form.Item>
                )}
            </Form>
        </div>
    );
}
