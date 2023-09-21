import React from "react";
import styled from "styled-components";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Layout, Input, Badge, Popover, Avatar, Button } from "antd";
import { Logo } from "@/components/atoms";

type TProps = {
    children: React.ReactNode;
};

const { Header, Content } = Layout;
const { Search } = Input;

const HeaderStyled = styled(Header)`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`;

const SearchStyled = styled(Search)`
    width: 50%;
`;

const BoxAvatarStyled = styled.div`
    width: 200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
`;

const ShoppingCartStyled = styled.div`
    color: #ffff;
    font-size: 26px;
`;

const UserBoxStyled = styled(Popover)`
    display: flex;
    align-items: center;
    gap: 0 10px;
    color: white;
`;

const ContentPopoverStyled = styled.div`
    display: flex;
    flex-direction: column;

    & span {
        width: 100%;
        text-align: left;
    }
`;

export default function UserLayout({ children }: TProps) {
    return (
        <Layout>
            <HeaderStyled>
                <Logo />
                <SearchStyled
                    placeholder="Nhập trên sản phẩm cần tìm kiếm."
                    type="primary"
                    enterButton
                    allowClear
                />
                <BoxAvatarStyled>
                    <Badge count={10} size="small" overflowCount={99} showZero={false}>
                        <ShoppingCartStyled>
                            <ShoppingCartOutlined />
                        </ShoppingCartStyled>
                    </Badge>
                    <UserBoxStyled
                        content={
                            <ContentPopoverStyled>
                                <Button type="text">Tài khoản của tôi</Button>
                                <Button type="text">Đăng xuất</Button>
                            </ContentPopoverStyled>
                        }
                        trigger="hover"
                        placement="bottomRight"
                    >
                        <Avatar
                            size="large"
                            src="https://images2.thanhnien.vn/Uploaded/thynhm/2020_09_24/chag5728_BQVQ.jpeg?width=500"
                            alt="avatar"
                        />
                        <p>Phan Hoai Bao</p>
                    </UserBoxStyled>
                </BoxAvatarStyled>
            </HeaderStyled>
            <Content>{children}</Content>
        </Layout>
    );
}
