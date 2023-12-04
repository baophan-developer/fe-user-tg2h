import React, { useEffect, useState } from "react";
import { Button, Carousel, Image } from "antd";
import { IProduct } from "@/interfaces";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import { CountDown } from "..";
import styled from "styled-components";
import { useRouter } from "next/router";
import ROUTERS from "@/constants/routers";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const ContainerStyled = styled.div`
    margin: 7px;
    padding: 10px;
    background-color: white;
`;

const ItemCarouselStyled = styled.div`
    position: relative;
    display: flex;
    cursor: pointer;
    min-height: fit-content;

    @media only screen and (max-width: 1000px) {
        flex-direction: column;
    }
`;

const InfoStyled = styled.div`
    width: 70%;
    margin-left: 10px;

    @media only screen and (max-width: 1000px) {
        width: 100%;
        margin-left: 0;
    }
`;

const NameStyled = styled.div`
    display: flex;
    gap: 10px;
`;

const FlashSaleStyled = styled.h1`
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    color: red;

    @media only screen and (max-width: 1000px) {
        font-size: 22px;
    }
`;

const HeadingNameStyled = styled.h1`
    font-weight: 500;

    @media only screen and (max-width: 1000px) {
        font-size: 22px;
    }
`;

const DiscountStyled = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-bottom: 60px solid transparent;
    border-right: 100px solid red; /* Sử dụng màu sắc tùy ý */

    & p {
        font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
        position: absolute;
        color: white;
        right: -95px;
        font-size: 22px;
        font-weight: 500;
    }
`;

const PriceStyled = styled.div`
    margin-top: 40px;
    font-weight: 550;

    :nth-child(1) {
        text-decoration: line-through;
        font-size: 18px;
    }

    :nth-child(2) {
        color: red;
        font-size: 22px;
    }
`;

export default function TopSale() {
    const router = useRouter();
    const carouselRef: any = React.createRef();
    const [products, setProducts] = useState<IProduct[]>([]);

    const getProducts = async () => {
        try {
            const res = await request<any>("post", API_ENDPOINT.PRODUCT.TOP_SALE);
            setProducts(res.data.list);
        } catch (error) {}
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <ContainerStyled>
            <Carousel autoplay autoplaySpeed={3000} ref={carouselRef} dots={false}>
                {products.map((item) => (
                    <div
                        key={item._id}
                        onClick={() => router.push(`${ROUTERS.PRODUCTS}/${item._id}`)}
                    >
                        <ItemCarouselStyled>
                            <Image src={item.images[0]} preview={false} width={"30%"} />
                            <InfoStyled>
                                <NameStyled>
                                    <FlashSaleStyled>Flash Sale</FlashSaleStyled>
                                    <HeadingNameStyled>{item.name}</HeadingNameStyled>
                                </NameStyled>
                                {item.discount && (
                                    <CountDown deadline={item.discount?.end} />
                                )}
                                {item.discount && (
                                    <PriceStyled>
                                        <p>
                                            Giá gốc: {item.price.toLocaleString("vi")} vnđ
                                        </p>
                                        <p>
                                            Giảm còn:{" "}
                                            {(
                                                item.price -
                                                (item.price / 100) *
                                                    item.discount?.percent
                                            ).toLocaleString("vi")}{" "}
                                            đ
                                        </p>
                                    </PriceStyled>
                                )}
                            </InfoStyled>
                            <DiscountStyled>
                                {item.discount && <p>-{item.discount.percent}%</p>}
                            </DiscountStyled>
                        </ItemCarouselStyled>
                    </div>
                ))}
            </Carousel>
            <Button
                onClick={() => carouselRef.current.prev()}
                icon={<LeftOutlined />}
            ></Button>
            <Button
                onClick={() => carouselRef.current.next()}
                icon={<RightOutlined />}
                style={{ marginLeft: "10px" }}
            ></Button>
        </ContainerStyled>
    );
}
