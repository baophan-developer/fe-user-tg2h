import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IProductRender } from "@/interfaces";
import { Card, Col, Image, Pagination, PaginationProps, Rate, Row } from "antd";
import request, { TRequest } from "@/services/request";
import { useRouter } from "next/router";
import ROUTERS from "@/constants/routers";

const { Meta } = Card;

const CardStyled = styled(Card)`
    width: 240px;
    height: 370px;

    @media only screen and (max-width: 500px) {
        width: 200px;
    }
`;

const PaginationStyled = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: center;
`;

const EmptyStyled = styled.div`
    height: 50vh;
    display: grid;
    place-items: center;

    & h1 {
        font-weight: 400;
    }
`;

const PriceStyled = styled.div`
    text-align: center;
    font-size: 18px;
`;

const DiscountStyled = styled.p<{ $discount?: any }>`
    text-decoration: ${(props) => props.$discount && "line-through"};
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

export const discount = (price: number, percent: number | undefined): string => {
    if (!percent) return price.toLocaleString("vi") + " đ";
    return (price - price / percent).toLocaleString("vi") + ` đ`;
};

export default function ViewProducts({ requestApi, filters, sort }: TProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<IProductRender[]>([]);
    const [total, setTotal] = useState<number>(20);
    const [query, setQuery] = useState<IQuery>({
        filters: {
            status: true,
            approve: true,
            ...filters,
        },
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
        setQuery((prev) => ({
            ...prev,
            filters: { status: true, approve: true, ...filters },
            sort: { ...sort },
        }));
    }, [filters, sort]);

    return (
        <div>
            <Row gutter={[8, 8]} style={{ justifyContent: "center" }}>
                {products.map((item, index) => (
                    <Col key={index}>
                        <CardStyled hoverable loading={loading}>
                            <div
                                onClick={() =>
                                    router.push(`${ROUTERS.PRODUCTS}/${item._id}`)
                                }
                            >
                                <Image
                                    loading="eager"
                                    src={item.images[0]}
                                    preview={false}
                                />
                                <Meta
                                    style={{ marginTop: "20px" }}
                                    title={item.name}
                                    description={
                                        <div>
                                            <PriceStyled>
                                                <DiscountStyled $discount={item.discount}>
                                                    {item.discount &&
                                                        item.price.toLocaleString("vi") +
                                                            " đ"}
                                                </DiscountStyled>
                                                <p
                                                    style={{
                                                        fontWeight: "500",
                                                        color: "red",
                                                    }}
                                                >
                                                    {discount(
                                                        item.price,
                                                        item.discount?.percent
                                                    )}
                                                </p>
                                                <Rate
                                                    style={{
                                                        margin: "10px 0",
                                                        color: "red",
                                                        fontSize: "14px",
                                                    }}
                                                    value={item.rating}
                                                    disabled
                                                    allowHalf
                                                />
                                            </PriceStyled>
                                            <span>
                                                <p>Lượt mua {item.sold}</p>
                                                <p>Lượt đánh giá giá {item.reviews}</p>
                                            </span>
                                        </div>
                                    }
                                />
                                <br />
                            </div>
                        </CardStyled>
                    </Col>
                ))}
                {products.length === 0 && (
                    <EmptyStyled>
                        <h1>Không có sản phẩm nào tương tự</h1>
                    </EmptyStyled>
                )}
            </Row>
            <PaginationStyled>
                {total > 20 && (
                    <Pagination
                        defaultCurrent={query.pagination.page + 1}
                        defaultPageSize={query.pagination.limit}
                        total={total}
                        onChange={handleChangePagination}
                    />
                )}
            </PaginationStyled>
        </div>
    );
}
