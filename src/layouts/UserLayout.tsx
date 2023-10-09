import React, { useEffect } from "react";
import PubSub from "pubsub-js";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Layout, Input, Badge, Popover, Avatar, Button, message } from "antd";
import request from "@/services/request";
import UserAtom from "@/stores/UserStore";
import { API_ENDPOINT } from "@/constants/apis";
import ROUTERS from "@/constants/routers";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";
import Link from "next/link";

type TProps = {
    children: React.ReactNode;
};

const { Header, Content } = Layout;
const { Search } = Input;

const HeaderStyled = styled(Header)`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    color: #fff;
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

const ContentStyled = styled(Content)`
    padding: 1% 5%;

    @media only screen and (max-width: 500px) {
        padding: 1% 0;
    }
`;

export default function UserLayout({ children }: TProps) {
    const [user, setUser] = useRecoilState(UserAtom);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await request<any>("post", API_ENDPOINT.AUTH.LOGOUT);
            localStorage.removeItem("accessToken");
            message.success(res.data.message, 1);
            router.push(ROUTERS.LOGIN);
        } catch (error: any) {
            message.error(error.response.data.message, 1);
        }
    };

    const getUserInfo = async () => {
        try {
            const res = await request<any>("get", API_ENDPOINT.PROFILE.GET);
            setUser(res.data.item);
        } catch (error) {}
    };

    useEffect(() => {
        getUserInfo();
        PubSub.subscribe(PUBSUB_SUBSCRIBE_NAME.GET_INFO, getUserInfo);
        return () => {
            PubSub.unsubscribe(PUBSUB_SUBSCRIBE_NAME.GET_INFO);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout>
            <HeaderStyled>
                <h2>
                    <Link href={ROUTERS.HOME}>TG2H</Link>
                </h2>
                <SearchStyled
                    placeholder="Nhập trên sản phẩm cần tìm kiếm."
                    type="primary"
                    enterButton
                    allowClear
                    onSearch={(value) => router.push(`products?search=${value}`)}
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
                                <Button
                                    type="text"
                                    onClick={() => router.push(ROUTERS.ACCOUNT.HOME)}
                                >
                                    Tài khoản của tôi
                                </Button>
                                <Button type="text" onClick={handleLogout}>
                                    Đăng xuất
                                </Button>
                            </ContentPopoverStyled>
                        }
                        trigger="hover"
                        placement="bottomRight"
                    >
                        <Avatar size="large" src={user.avatar} alt={user.name} />
                        <p>{user.name}</p>
                    </UserBoxStyled>
                </BoxAvatarStyled>
            </HeaderStyled>
            <ContentStyled>{children}</ContentStyled>
        </Layout>
    );
}
