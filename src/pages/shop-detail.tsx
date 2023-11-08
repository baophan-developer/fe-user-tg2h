import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { ViewProducts } from "@/components/templates";
import { API_ENDPOINT } from "@/constants/apis";
import { IUser } from "@/interfaces";
import request from "@/services/request";
import { Avatar } from "antd";

const TitleStyled = styled.h2`
    font-weight: 400;
    text-align: center;
    margin: 20px 0;
`;

const ShopInfoStyled = styled.div`
    padding: 30px;
    background-color: #ffff;
    display: flex;

    @media only screen and (max-width: 500px) {
        padding: 20px;
    }
`;

const BoxAvatarStyled = styled.div`
    padding: 0 30px;
    height: auto;
    display: flex;
    align-items: center;
`;

const InfoStyled = styled.div`
    line-height: 25px;
`;

export default function ShopDetail() {
    const router = useRouter();
    const [shop, setShop] = useState<IUser>();

    const getDetailInfoUser = async (shopId: string) => {
        try {
            const res = await request<any>(
                "get",
                `${API_ENDPOINT.USER_DETAIL}/${shopId}`
            );
            setShop(res.data.item);
        } catch (error: any) {}
    };

    useEffect(() => {
        if (router.query.shopId) getDetailInfoUser(router.query.shopId as string);
    }, []);

    return (
        <div>
            <ShopInfoStyled>
                <BoxAvatarStyled>
                    <Avatar
                        style={{ width: "60px", height: "60px" }}
                        src={shop?.avatar}
                    />
                </BoxAvatarStyled>
                <InfoStyled>
                    <h4>{shop?.name}</h4>
                    <p>Email: {shop?.email}</p>
                    <p>Số điện thoại: {shop?.phone}</p>
                </InfoStyled>
            </ShopInfoStyled>
            <div>
                <TitleStyled>Các sản phẩm của shop</TitleStyled>
                {shop?._id && (
                    <ViewProducts
                        filters={{ owner: shop?._id }}
                        requestApi={{ method: "post", api: API_ENDPOINT.PRODUCT.GET }}
                    />
                )}
            </div>
        </div>
    );
}
