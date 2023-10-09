import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, Layout, Row } from "antd";
import { API_ENDPOINT } from "@/constants/apis";
import { ViewProducts } from "@/components/templates";
import request from "@/services/request";
import { useRouter } from "next/router";

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
            setCategory(res.data.list);
        } catch (error) {}
    };

    useEffect(() => {
        getCategory();
    }, []);

    return (
        <Layout>
            <Layout>
                <CategoryStyled>
                    <Card title="Danh mục Laptop" style={{ width: "90%" }}>
                        {category.map((item, index) => (
                            <Card.Grid
                                key={index}
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                    router.push(`/${item.name}?id=${item._id}`)
                                }
                            >
                                {item.name}
                            </Card.Grid>
                        ))}
                    </Card>
                </CategoryStyled>
                <HeadingStyled>GỢI Ý HÔM NAY</HeadingStyled>
                <ViewProducts
                    requestApi={{ method: "post", api: API_ENDPOINT.PRODUCT.GET }}
                />
            </Layout>
        </Layout>
    );
}
