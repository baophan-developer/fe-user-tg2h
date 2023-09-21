import React from "react";
import { Layout } from "antd";
import styled from "styled-components";

const { Header } = Layout;

type TProps = {
    children: React.ReactNode;
};

const HeaderStyled = styled(Header)`
    color: #fff;
`;

const LayoutStyled = styled(Layout)`
    display: grid;
    place-items: center;
    padding: 40px;
`;

const ContainerStyled = styled.div`
    background-color: #fff;
    padding: 40px;
    min-width: 390px;
`;

export default function AuthLayout({ children }: TProps) {
    return (
        <Layout>
            <HeaderStyled>
                <h2>TG2H</h2>
            </HeaderStyled>
            <LayoutStyled>
                <ContainerStyled>{children}</ContainerStyled>
            </LayoutStyled>
        </Layout>
    );
}
