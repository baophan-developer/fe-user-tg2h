import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { FormItemProps, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ButtonFormModel } from "@/components/molecules";
import request, { TRequest } from "@/services/request";

const ActionStyled = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
`;

type TProps = {
    /** create is props for component ButtonFormModel */
    create: {
        title: React.ReactNode;
        fields: FormItemProps[];
        request: { method: TRequest; api: string };
        func: (value: any) => any;
        usingFormData: boolean;
    };
    /** using get data */
    get: {
        request: { method: TRequest; api: string; filter: any };
    };
    /** pubsub key */
    pubsub: string;
    columns: any;
};

export default function ManagementView({ create, get, pubsub, columns = [] }: TProps) {
    const [data, setData] = useState([]);

    const getData = async () => {
        try {
            const res = await request<any>(
                get.request.method,
                get.request.api,
                get.request.filter
            );
            const dataSource = res.data.list.map((item: any, index: any) => ({
                key: index + 1,
                ...item,
            }));
            setData(dataSource);
        } catch (error: any) {}
    };

    useEffect(() => {
        getData();
        PubSub.subscribe(pubsub, getData);
        return () => {
            PubSub.unsubscribe(pubsub);
        };
    }, []);

    return (
        <div>
            <ActionStyled>
                <ButtonFormModel
                    title={create.title}
                    button={{ children: "Thêm mới", icon: <PlusOutlined /> }}
                    req={{ method: create.request.method, api: create.request.api }}
                    fields={create.fields}
                    keyPubsub={pubsub}
                    width={"50%"}
                    funcHandleData={create.func}
                    usingFormData={create.usingFormData}
                />
            </ActionStyled>
            <Table columns={columns} dataSource={data} />
        </div>
    );
}
