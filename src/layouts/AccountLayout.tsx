import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Avatar, Layout, Menu } from "antd";
import { getItem } from "@/components/atoms";
import ROUTERS from "@/constants/routers";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";

const { Sider, Content } = Layout;

const LayoutStyled = styled(Layout)`
    padding: 20px;
    background-color: #fff;
    display: flex;
    flex-direction: column !important;
`;

const ContentStyled = styled(Content)`
    padding: 10px;
    background-color: #fff;
`;

const HeaderStyled = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(5, 5, 5, 0.06);
`;

const BoxAvatarStyled = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 0 10px;
    width: 200px;

    & b {
        font-size: 16px;
    }
`;

const TitleStyled = styled.h2`
    font-weight: 400;
`;

const ContainerStyled = styled.div`
    display: flex;
    min-height: 500px;
`;

type TProps = {
    children: React.ReactNode;
    title?: React.ReactNode;
};

export default function AccountLayout({ children, title }: TProps) {
    const route = useRouter();
    const defaultKey = route.pathname;
    const user = useRecoilValue(UserAtom);

    return (
        <LayoutStyled>
            <HeaderStyled>
                <BoxAvatarStyled>
                    <Avatar src={user?.avatar} alt={user?.name} size="large" />
                    <b>{user?.name}</b>
                </BoxAvatarStyled>
                <TitleStyled>{title}</TitleStyled>
            </HeaderStyled>
            <ContainerStyled>
                <Sider style={{ backgroundColor: "#fff" }}>
                    <Menu
                        defaultSelectedKeys={[defaultKey]}
                        items={[
                            getItem(ROUTERS.ACCOUNT.HOME, "Quản lý tài khoản"),
                            getItem(
                                ROUTERS.ACCOUNT.MANAGEMENT_ADDRESS,
                                "Quản lý địa chỉ"
                            ),
                        ]}
                        onClick={({ key }) => {
                            switch (key) {
                                case ROUTERS.ACCOUNT.HOME:
                                    route.push(ROUTERS.ACCOUNT.HOME);
                                    break;
                                case ROUTERS.ACCOUNT.MANAGEMENT_ADDRESS:
                                    route.push(ROUTERS.ACCOUNT.MANAGEMENT_ADDRESS);
                                    break;
                                default:
                                    route.push(ROUTERS.HOME);
                                    break;
                            }
                        }}
                        style={{ height: "100%" }}
                    />
                </Sider>
                <ContentStyled>{children}</ContentStyled>
            </ContainerStyled>
        </LayoutStyled>
    );
}
