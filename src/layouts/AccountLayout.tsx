import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Avatar, Layout, Menu } from "antd";
import { getItem } from "@/components/atoms";
import ROUTERS from "@/constants/routers";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";
import useChangeSizeWindow from "@/hooks/useChangeSizeWindow";

const { Sider, Content } = Layout;

const LayoutStyled = styled(Layout)`
    padding: 20px;
    background-color: #fff;
    display: flex;
    flex-direction: column !important;

    @media only screen and (max-width: 500px) {
        padding: 0;
    }
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

    @media only screen and (max-width: 500px) {
        display: none;
    }
`;

const ContainerStyled = styled.div`
    display: flex;
    min-height: 500px;
    position: relative;
`;

const SiderStyled = styled.div<{ $left?: boolean }>`
    background-color: #fff;
    width: 200px;

    @media only screen and (max-width: 500px) {
        width: 100vw;
        position: absolute;
        z-index: 2;
        height: 100%;
        left: ${(props) => (props.$left ? "0" : "-100vw")};
    }
`;

type TProps = {
    children: React.ReactNode;
    title?: React.ReactNode;
};

const items = [
    getItem(ROUTERS.ACCOUNT.HOME, "Quản lý tài khoản"),
    getItem(ROUTERS.ACCOUNT.ADDRESS, "Quản lý địa chỉ"),
    getItem(ROUTERS.ACCOUNT.PRODUCT, "Quản lý sản phẩm"),
];
export default function AccountLayout({ children, title }: TProps) {
    const router = useRouter();
    const defaultKey = router.pathname;
    const user = useRecoilValue(UserAtom);
    const size = useChangeSizeWindow();
    const [displayMenu, setDisplayMenu] = useState<boolean>(false);

    return (
        <LayoutStyled>
            <HeaderStyled>
                <BoxAvatarStyled
                    onClick={() => size.width < 500 && setDisplayMenu(!displayMenu)}
                >
                    <Avatar src={user?.avatar} alt={user?.name} size="large" />
                    <b>{user?.name}</b>
                </BoxAvatarStyled>
                <TitleStyled>{title}</TitleStyled>
            </HeaderStyled>
            <ContainerStyled>
                <SiderStyled $left={displayMenu}>
                    <Menu
                        defaultSelectedKeys={[defaultKey]}
                        items={items}
                        onClick={({ key }) => {
                            router.push(key);
                            size.width < 500 && setDisplayMenu(!displayMenu);
                        }}
                        style={{ height: "100%" }}
                    />
                </SiderStyled>
                <ContentStyled>{children}</ContentStyled>
            </ContainerStyled>
        </LayoutStyled>
    );
}
