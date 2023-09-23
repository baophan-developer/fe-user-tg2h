import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Layout, Menu } from "antd";
import { getItem } from "@/components/atoms";
import ROUTERS from "@/constants/routers";

const { Sider, Content } = Layout;

const LayoutStyled = styled(Layout)`
    padding: 20px;
    background-color: #fff;
    min-height: 500px;
`;

const ContentStyled = styled(Content)`
    padding: 0 20px;
    background-color: #fff;
`;

const TitleStyled = styled.h2`
    font-weight: 300;
    padding-bottom: 5px;
    border-bottom: 1px solid rgba(5, 5, 5, 0.06);
    margin-bottom: 10px;
`;

type TProps = {
    children: React.ReactNode;
    title?: React.ReactNode;
};

export default function AccountLayout({ children, title }: TProps) {
    const route = useRouter();
    const defaultKey = route.pathname;

    return (
        <LayoutStyled>
            <Sider style={{ backgroundColor: "#fff" }}>
                <Menu
                    defaultSelectedKeys={[defaultKey]}
                    items={[
                        getItem(ROUTERS.ACCOUNT.HOME, "Quản lý tài khoản"),
                        getItem(ROUTERS.ACCOUNT.MANAGEMENT_ADDRESS, "Quản lý địa chỉ"),
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

            <ContentStyled>
                <TitleStyled>{title}</TitleStyled>
                {children}
            </ContentStyled>
        </LayoutStyled>
    );
}
