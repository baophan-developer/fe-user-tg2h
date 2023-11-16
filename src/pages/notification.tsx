import React, { useState, useEffect } from "react";
import { Button, List } from "antd";
import styled from "styled-components";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import { useRouter } from "next/router";
import dayjs from "dayjs";

interface INotification {
    _id: string;
    userReceive: string;
    title: string;
    message: string;
    isSeen: boolean;
    action: string;
    createdAt: string;
}

const ContainerStyled = styled.div`
    background-color: white;
    padding: 10px 40px;
    min-height: 500px;

    & p,
    h2 {
        text-transform: uppercase;
        font-weight: 400;
    }

    & h2 {
        text-align: center;
        margin-bottom: 10px;
    }
`;

export default function Notification() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [total, setTotal] = useState<number>(100);
    const [pagination, setPagination] = useState<{ page: number; limit: number }>({
        page: 0,
        limit: 10,
    });

    const getAllNotifications = async () => {
        try {
            const res = await request<any>("post", API_ENDPOINT.NOTIFICATION.GET_ALL, {
                pagination,
            });
            setNotifications(res.data.list);
            setTotal(res.data.total);
        } catch (error) {}
    };

    const handleSeenNotification = async (id: string, action?: string) => {
        try {
            await request<any>("put", API_ENDPOINT.NOTIFICATION.MAIN, {
                notificationIds: [id],
            });
            /** action is url router to order or messages box */
            action && router.push(action);
        } catch (error) {}
    };

    useEffect(() => {
        getAllNotifications();
    }, [pagination]);

    return (
        <ContainerStyled>
            <h2>Thông báo</h2>
            <List
                locale={{ emptyText: "Không có thông báo mới nào" }}
                dataSource={notifications}
                renderItem={(item) => (
                    <List.Item
                        style={{
                            padding: "5px",
                            backgroundColor: `${item.isSeen ? "white" : "#fff1f0"}`,
                        }}
                    >
                        <List.Item.Meta
                            title={<p>{item.title}</p>}
                            description={
                                <div>
                                    <div>{item.message}</div>
                                    <div>
                                        {dayjs(item.createdAt).format("HH:mm DD-MM-YYYY")}
                                    </div>
                                </div>
                            }
                        />
                        <Button
                            type="link"
                            onClick={() => {
                                handleSeenNotification(item._id, item.action);
                            }}
                        >
                            Xem chi tiết
                        </Button>
                    </List.Item>
                )}
                pagination={{
                    size: "small",
                    total: total,
                    onChange: (page: number, pageSize: number) => {
                        setPagination({ page: page, limit: pageSize });
                    },
                }}
            />
        </ContainerStyled>
    );
}
