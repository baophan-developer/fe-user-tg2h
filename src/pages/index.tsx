import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, Layout, Row } from "antd";
import { API_ENDPOINT } from "@/constants/apis";
import { ViewProducts } from "@/components/templates";
import request from "@/services/request";
import { useRouter } from "next/router";
import ROUTERS from "@/constants/routers";
import { TopSale } from "@/components/organisms";

const HeadingStyled = styled.h2`
    width: 100%;
    padding: 10px;
    font-weight: 400;
    text-align: center;
`;

const CategoryStyled = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const HeadingTopStyled = styled.div`
    background-color: white;
    margin: 7px;
    padding: 15px 10px;
    border-radius: 5px;
    font-size: 18px;
`;

interface ICategory {
    _id: string;
    name: string;
}

export default function Home() {
    const router = useRouter();
    const [category, setCategory] = useState<ICategory[]>([]);

    const getCategory = async () => {
        try {
            const res = await request<any>("get", API_ENDPOINT.CATEGORY);
            setCategory([{ _id: "All", name: "Tất cả" }, ...res.data.list]);
        } catch (error) {}
    };

    useEffect(() => {
        getCategory();
    }, []);

    return (
        <Layout>
            <TopSale />
            <HeadingTopStyled>Top những sản phẩm bán chạy</HeadingTopStyled>
            <ViewProducts
                requestApi={{ method: "post", api: API_ENDPOINT.PRODUCT.SOLD_HIGH }}
            />
            <HeadingTopStyled>Top những sản phẩm có xếp hạng cao</HeadingTopStyled>
            <ViewProducts
                requestApi={{ method: "post", api: API_ENDPOINT.PRODUCT.RATING_HIGH }}
            />
            <CategoryStyled>
                <Card title="Danh mục Laptop" style={{ width: "100%" }}>
                    {category.map((item, index) => (
                        <Card.Grid
                            key={index}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                router.push(
                                    `${ROUTERS.PRODUCTS}?category=${item._id}&title=${item.name}`
                                )
                            }
                        >
                            {item.name}
                        </Card.Grid>
                    ))}
                </Card>
            </CategoryStyled>
            <HeadingStyled>GỢI Ý HÔM NAY</HeadingStyled>
            <ViewProducts
                requestApi={{ method: "post", api: API_ENDPOINT.PRODUCT.RECOMMENDATION }}
            />
        </Layout>
    );
}
