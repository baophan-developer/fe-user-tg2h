import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { ViewProducts } from "@/components/templates";
import { API_ENDPOINT } from "@/constants/apis";
import { IUser } from "@/interfaces";
import request from "@/services/request";
import { Button, Image } from "antd";
import { HomeOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";
import ROUTERS from "@/constants/routers";

const ContainerStyled = styled.div`
    padding: 0 5%;

    @media only screen and (max-width: 500px) {
        padding: 0;
    }
`;

const TitleStyled = styled.h2`
    font-weight: 400;
    text-align: center;
    margin: 20px 0;
`;

const ShopInfoStyled = styled.div`
    padding: 20px;
    background-color: #ffff;
    display: flex;

    @media only screen and (max-width: 500px) {
        padding: 30px 5px;
        flex-direction: column;
        gap: 50px;
    }
`;

const BoxAvatarStyled = styled.div`
    padding: 0 30px;
    height: auto;
    display: flex;
    align-items: center;

    @media only screen and (max-width: 500px) {
        justify-content: center;
    }
`;

const InfoStyled = styled.div`
    padding: 0 10px;
    line-height: 25px;
    width: 100%;

    & h2 {
        font-weight: 500;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

const InfoItemStyled = styled.div`
    padding-left: 20px;
    display: flex;
    align-items: center;
    gap: 10px;

    @media only screen and (max-width: 500px) {
        padding-left: 0;
    }
`;

export default function ShopDetail() {
    const router = useRouter();
    const user = useRecoilValue(UserAtom);
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

    const handleChat = async () => {
        try {
            await request<any>("post", API_ENDPOINT.CHAT.MAIN, {
                senderId: user._id,
                receiverId: shop?._id,
            });
            router.push(ROUTERS.CHAT);
        } catch (error) {}
    };

    useEffect(() => {
        if (router.query.shopId) getDetailInfoUser(router.query.shopId as string);
    }, [router.query.shopId]);

    return (
        <ContainerStyled>
            <ShopInfoStyled>
                <BoxAvatarStyled>
                    <Image
                        src={shop?.avatar}
                        width={200}
                        height={200}
                        preview={false}
                        style={{ objectFit: "fill" }}
                    />
                </BoxAvatarStyled>
                <InfoStyled>
                    <h2>
                        {shop?.name} <Button onClick={handleChat}>Chat ngay</Button>
                    </h2>
                    <div>
                        <InfoItemStyled>
                            <MailOutlined /> {shop?.email}
                        </InfoItemStyled>
                        <InfoItemStyled>
                            <PhoneOutlined /> {shop?.phone}
                        </InfoItemStyled>
                        <InfoItemStyled>
                            <HomeOutlined />
                            {shop?.address[0].address}
                        </InfoItemStyled>
                    </div>
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
        </ContainerStyled>
    );
}
