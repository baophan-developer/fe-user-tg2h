import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { styled } from "styled-components";
import request, { TRequest } from "@/services/request";
import { Button, Image, List, Modal, Radio } from "antd";

type TProps = {
    title: React.ReactNode;
    req: { method: TRequest; api: string };
};

const ContainerStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    & div {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    @media only screen and (max-width: 500px) {
        flex-direction: column;
        align-items: flex-start;

        & div {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 10px;
        }
    }
`;

const Choices = forwardRef(function Choices(props: TProps, ref) {
    const [value, setValue] = useState<any>();
    const [data, setData] = useState<{ avatar: string; name: string }[]>([]);

    const [open, setOpen] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        value: value,
    }));

    const getData = async () => {
        try {
            const res = await request<any>(props.req.method, props.req.api);
            setData(res.data.list);
            setValue(res.data.list[0]);
        } catch (error) {}
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <ContainerStyled>
            <div>
                <h3>{props.title}:</h3>
                <p>{value?.name}</p>
            </div>
            <Button onClick={() => setOpen(!open)}>Thay đổi</Button>
            <Modal
                open={open}
                onOk={() => setOpen(!open)}
                onCancel={() => setOpen(!open)}
                okText="Xác nhận"
                cancelText="Hủy"
                title={props.title}
            >
                <Radio.Group
                    style={{ width: "100%" }}
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                >
                    <List
                        dataSource={data ? data : []}
                        renderItem={(item) => (
                            <List.Item>
                                <div>
                                    <Radio value={item} />
                                    {item.avatar ? (
                                        <Image
                                            src={item.avatar}
                                            width={90}
                                            preview={false}
                                        />
                                    ) : (
                                        item.name
                                    )}
                                </div>
                            </List.Item>
                        )}
                    />
                </Radio.Group>
            </Modal>
        </ContainerStyled>
    );
});

export default Choices;
