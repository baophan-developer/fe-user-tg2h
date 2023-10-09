import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { FormItemProps, Table, TableProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ButtonFormModel } from "@/components/molecules";
import request, { TRequest } from "@/services/request";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";

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
        request: { method: TRequest; api: string };
    };
    /** pubsub key */
    pubsub: string;
    columns: any;
    attributeQuery?: { title: string; value: string }[];
    filters?: any;
};

interface IQuery {
    filters?: any;
    sort?: any;
    pagination: { page: number; limit: number };
}

export default function ManagementView({
    create,
    get,
    pubsub,
    columns = [],
    attributeQuery,
    filters,
}: TProps) {
    const user = useRecoilValue(UserAtom);
    const [data, setData] = useState([]);
    const [total, seTotal] = useState<number>(10);
    const [query, setQuery] = useState<IQuery>({
        filters: {
            // set default using for product table
            owner: user._id,
        },
        pagination: {
            page: 0,
            limit: 10,
        },
    });

    const handleTableChange: TableProps<any>["onChange"] = (
        pagination,
        filters,
        sorter: any
    ) => {
        let sort: 1 | -1 | null = null;

        if (sorter.order) {
            if (sorter.order === "ascend") sort = 1;
            if (sorter.order === "descend") sort = -1;
        }

        const checkColumns = attributeQuery?.filter(
            (item) => item.title === sorter.column?.title
        )[0];

        if (checkColumns) {
            setQuery((prev) => ({
                ...prev,
                sort: {
                    [checkColumns?.value]: sort,
                },
            }));
        }

        if (pagination.current) {
            const page = pagination.current - 1;
            setQuery((prev) => ({
                ...prev,
                pagination: {
                    page: page || 0,
                    limit: pagination.pageSize || 10,
                },
            }));
        }
    };

    const getData = async () => {
        try {
            const res = await request<any>(get.request.method, get.request.api, query);
            const dataSource = res.data.list.map((item: any, index: any) => ({
                key: index + 1,
                ...item,
            }));
            seTotal(res.data.total);
            setData(dataSource);
        } catch (error: any) {}
    };

    useEffect(() => {
        getData();
        PubSub.subscribe(pubsub, getData);
        return () => {
            PubSub.unsubscribe(pubsub);
        };
    }, [query]);

    useEffect(() => {
        setQuery((prev) => ({ ...prev, filters: filters }));
    }, [filters]);

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
            <Table
                size="small"
                columns={columns}
                dataSource={data}
                onChange={handleTableChange}
                pagination={{ total: total }}
            />
        </div>
    );
}
