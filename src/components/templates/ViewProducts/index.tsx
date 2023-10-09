import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IProductRender } from "@/interfaces";
import { useRecoilValue } from "recoil";
import { Button, Card, Col, Image, Pagination, PaginationProps, Row } from "antd";
import request, { TRequest } from "@/services/request";
import UserAtom from "@/stores/UserStore";

const { Meta } = Card;

const CardStyled = styled(Card)`
    width: 240px;

    @media only screen and (max-width: 500px) {
        width: 200px;
    }
`;

const PaginationStyled = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: center;
`;

interface IQuery {
    filters?: any;
    sort?: any;
    pagination: {
        page: number;
        limit: number;
    };
}

type TProps = {
    requestApi: { method: TRequest; api: string };
    filters?: any;
    sort?: any;
};

export default function ViewProducts({ requestApi, filters, sort }: TProps) {
    const user = useRecoilValue(UserAtom);
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<IProductRender[]>([]);
    const [total, setTotal] = useState<number>(20);
    const [query, setQuery] = useState<IQuery>({
        pagination: {
            page: 0,
            limit: 20,
        },
    });

    const getProducts = async () => {
        setLoading(true);
        try {
            const res = await request<any>(requestApi.method, requestApi.api, query);
            setProducts(res.data.list);
            setTotal(res.data.total);
        } catch (error) {}
        setLoading(false);
    };

    const handleChangePagination: PaginationProps["onShowSizeChange"] = (
        current,
        pageSize
    ) => {
        setQuery((prev) => ({
            ...prev,
            pagination: { page: current - 1, limit: pageSize },
        }));
    };

    useEffect(() => {
        getProducts();
    }, [query]);

    useEffect(() => {
        setQuery((prev) => ({ ...prev, filters: { ...filters }, sort: { ...sort } }));
    }, [filters, sort]);

    return (
        <div>
            <Row gutter={[8, 8]} style={{ justifyContent: "center" }}>
                {products.map((item, index) => (
                    <Col key={index}>
                        <CardStyled hoverable loading={loading}>
                            <Image src={item.images[0]} preview={false} />
                            <Meta
                                title={item.name}
                                description={item.price.toLocaleString("vi")}
                            />
                            <br />
                            <Button
                                style={{ width: "100%" }}
                                type="primary"
                                disabled={item.owner?._id === user._id}
                            >
                                Thêm vào giỏ hàng
                            </Button>
                        </CardStyled>
                    </Col>
                ))}
            </Row>
            <PaginationStyled>
                <Pagination
                    defaultCurrent={query.pagination.page + 1}
                    defaultPageSize={query.pagination.limit}
                    total={total}
                    onChange={handleChangePagination}
                />
            </PaginationStyled>
        </div>
    );
}
