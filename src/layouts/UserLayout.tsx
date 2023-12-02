import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import {
    FacebookFilled,
    InstagramFilled,
    NotificationOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import {
    Layout,
    Input,
    Badge,
    Popover,
    Avatar,
    Button,
    message,
    notification,
} from "antd";
import request from "@/services/request";
import UserAtom from "@/stores/UserStore";
import { API_ENDPOINT } from "@/constants/apis";
import ROUTERS from "@/constants/routers";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";
import Link from "next/link";
import CartAtom from "@/stores/CartStore";
import { useSocket } from "@/contexts/SocketContext";
import { INotificationSocket } from "@/interfaces";
import { EVENTS } from "@/constants/events";

type TProps = {
    children: React.ReactNode;
};

const { Header, Content } = Layout;
const { Search } = Input;

const HeaderStyled = styled(Header)`
    padding: 2px 10%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;

    @media screen and (max-width: 500px) {
        padding: 10px;
    }
`;

const SearchStyled = styled(Search)`
    width: 50%;

    @media screen and (max-width: 500px) {
        width: 230px;
    }
`;

const BoxAvatarStyled = styled.div`
    gap: 20px;
    display: flex;
    color: white;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: 500px) {
        justify-content: space-evenly;
    }
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
    cursor: pointer;
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

const NotificationHeaderStyled = styled.div`
    padding: 4px 10%;
    background-color: #434343;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;

    @media only screen and (max-width: 500px) {
        padding: 8px;
    }
`;

const NotificationStyled = styled.p`
    color: white;
    cursor: pointer;
`;

export default function UserLayout({ children }: TProps) {
    const router = useRouter();
    const [user, setUser] = useRecoilState(UserAtom);
    const [cart, setCart] = useRecoilState(CartAtom);
    const [countNotification, setCountNotification] = useState<number>(0);

    // Notification real-time
    const socket = useSocket();
    const [api, contextHolder] = notification.useNotification();

    const handleLogout = async () => {
        try {
            const res = await request<any>("post", API_ENDPOINT.AUTH.LOGOUT);
            localStorage.removeItem("accessToken");
            message.success(res.data.message, 1);

            // Emit event log out of user
            socket.emit("userLogout", { socketId: socket.id, userId: user._id });

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

    const getCart = async () => {
        try {
            const res = await request<any>("get", API_ENDPOINT.CART.GET);
            setCart({ list: res.data.item.list, total: res.data.item.total });
        } catch (error) {}
    };

    const getCountNotification = async () => {
        try {
            const res = await request<any>("get", API_ENDPOINT.NOTIFICATION.MAIN);
            setCountNotification(res.data.count);
        } catch (error) {}
    };

    const handleSearch = (value: string) => {
        // regex special characters
        const specialCharacterPattern = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

        if (!String(value).match(specialCharacterPattern)) {
            router.push(`${ROUTERS.PRODUCTS}?search=${value}`);
        }
    };

    useEffect(() => {
        getUserInfo();
        getCart();
        getCountNotification();
        PubSub.subscribe(PUBSUB_SUBSCRIBE_NAME.GET_INFO, getUserInfo);
        PubSub.subscribe(PUBSUB_SUBSCRIBE_NAME.GET_CART, getCart);
        PubSub.subscribe(
            PUBSUB_SUBSCRIBE_NAME.GET_COUNT_NOTIFICATION,
            getCountNotification
        );
        return () => {
            PubSub.unsubscribe(PUBSUB_SUBSCRIBE_NAME.GET_INFO);
            PubSub.unsubscribe(PUBSUB_SUBSCRIBE_NAME.GET_CART);
            PubSub.unsubscribe(PUBSUB_SUBSCRIBE_NAME.GET_COUNT_NOTIFICATION);
            PubSub.unsubscribe(PUBSUB_SUBSCRIBE_NAME.GET_COUNT_NOTIFICATION);
        };
    }, []);

    useEffect(() => {
        if (user._id && socket.connected) {
            socket.emit("userOnline", { socketId: socket.id, userId: user._id });
        }
    }, [socket, user]);

    useEffect(() => {
        socket.on(EVENTS.NOTIFICATION.ON, (data: INotificationSocket) => {
            getCountNotification();
            data.title &&
                api.open({
                    message: data.title,
                    description: data.message,
                });
        });

        return () => socket.off(EVENTS.NOTIFICATION.ON);
    }, []);

    return (
        <Layout>
            {contextHolder}
            <NotificationHeaderStyled>
                <div>
                    Kết nối <FacebookFilled /> <InstagramFilled />
                </div>
                <BoxAvatarStyled>
                    <Badge
                        count={countNotification}
                        overflowCount={99}
                        size="small"
                        showZero={false}
                    >
                        <NotificationStyled
                            onClick={() => router.push(ROUTERS.NOTIFICATION)}
                        >
                            <NotificationOutlined /> Thông báo
                        </NotificationStyled>
                    </Badge>
                    |
                    <UserBoxStyled
                        content={
                            <ContentPopoverStyled>
                                <Button
                                    type="text"
                                    onClick={() => router.push(ROUTERS.ACCOUNT.HOME)}
                                >
                                    Tài khoản của tôi
                                </Button>
                                <Button
                                    type="text"
                                    onClick={() => router.push(ROUTERS.CHAT)}
                                >
                                    Tin nhắn
                                </Button>
                                <Button type="text" onClick={handleLogout}>
                                    Đăng xuất
                                </Button>
                            </ContentPopoverStyled>
                        }
                        trigger="hover"
                        placement="bottomRight"
                    >
                        <Avatar size="small" src={user.avatar} alt={user.name} />
                        <p>{user.name}</p>
                    </UserBoxStyled>
                </BoxAvatarStyled>
            </NotificationHeaderStyled>
            <HeaderStyled>
                <h2>
                    <Link href={ROUTERS.HOME}>TG2H</Link>
                </h2>
                <SearchStyled
                    placeholder="Nhập trên sản phẩm cần tìm kiếm."
                    type="primary"
                    enterButton
                    allowClear
                    onSearch={(value) => handleSearch(value)}
                />
                <Badge
                    count={cart.total}
                    size="small"
                    overflowCount={99}
                    showZero={false}
                >
                    <ShoppingCartStyled
                        style={{ cursor: "pointer" }}
                        onClick={() => router.push(ROUTERS.CART)}
                    >
                        <ShoppingCartOutlined />
                    </ShoppingCartStyled>
                </Badge>
            </HeaderStyled>
            <ContentStyled>{children}</ContentStyled>
        </Layout>
    );
}
