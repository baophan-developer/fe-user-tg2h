import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IProduct } from "@/interfaces";
import { useRecoilValue } from "recoil";
import { Button, Card, Col, Image, Layout, Pagination, PaginationProps, Row } from "antd";
import request from "@/services/request";
import UserAtom from "@/stores/UserStore";
import { API_ENDPOINT } from "@/constants/apis";

const { Meta } = Card;

interface IQuery {
    filters?: any;
    sort?: any;
    pagination: {
        page: number;
        limit: number;
    };
}

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

export default function Home() {
    const user = useRecoilValue(UserAtom);
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [total, setTotal] = useState<number>(10);
    const [query, setQuery] = useState<IQuery>({
        pagination: {
            page: 0,
            limit: 20,
        },
    });

    const getProducts = async () => {
        setLoading(true);
        try {
            const res = await request<any>("post", API_ENDPOINT.PRODUCT.GET, query);
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
        setQuery((prev) => ({ ...prev, filters: { owner: { $ne: user._id } } }));
    }, [user._id]);

    useEffect(() => {
        getProducts();
    }, [query]);

    return (
        <Layout>
            <Layout>
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
                                <Button style={{ width: "100%" }} type="primary">
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
            </Layout>
        </Layout>
    );
}
