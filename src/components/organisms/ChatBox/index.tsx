import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Avatar, Input, Modal, message } from "antd";
import { format } from "timeago.js";
import request from "@/services/request";
import { IChat, IMessage, IUser } from "@/interfaces";
import { API_ENDPOINT } from "@/constants/apis";
import { DeleteOutlined, SendOutlined } from "@ant-design/icons";
import { useSocket } from "@/contexts/SocketContext";
import { EVENTS } from "@/constants/events";
import { useRouter } from "next/router";
import ROUTERS from "@/constants/routers";

const ChatBoxEmptyStyled = styled.span`
    display: flex;
    align-self: center;
    justify-content: center;
    font-size: 20px;
`;

const ChatBoxContainerStyled = styled.div`
    border-radius: 1rem;
    display: grid;
    grid-template-rows: 10vh 60vh 10vh;

    @media only screen and (max-height: 500px) {
        grid-template-rows: 16vh 70vh 7vh;
    }

    @media only screen and (max-width: 500px) {
        grid-template-rows: 7vh 60vh 7vh;
    }
`;

const ChatHeaderStyled = styled.div`
    padding: 1rem 1rem 1rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #d9d9d9;

    @media only screen and (max-width: 500px) {
        padding: 10px;
    }
`;

const ChatBodyStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    overflow-y: scroll;
`;

const MessageStyled = styled.div<{ $isOwner: boolean }>`
    background: ${(props) => (props.$isOwner ? "#242d49" : "#434343")};
    align-self: ${(props) => props.$isOwner && "flex-end"};
    border-radius: ${(props) =>
        props.$isOwner ? "1rem 1rem 0 1rem" : "1rem 1rem 1rem 0"};

    color: white;
    padding: 0.7rem;
    max-width: 20rem;
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    & span:nth-child(2) {
        font-size: 0.7rem;
        color: var(--textColor);
        align-self: end;
    }
`;

const ChatSenderStyled = styled.div`
    background: white;
    display: flex;
    justify-content: space-between;
    height: 3.5rem;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem;
    align-self: end;
`;

const SendStyled = styled.div`
    padding: 8px 20px;
    background-color: #242d49;
    font-size: 16px;
    color: white;

    &:hover {
        background-color: #56514b;
        cursor: pointer;
    }
`;

const ActionStyled = styled.div`
    cursor: pointer;
`;

const DeleteButtonStyled = styled.div`
    font-size: 20px;

    &:hover {
        cursor: pointer;
    }
`;

type TProps = {
    chat: IChat | undefined;
    currentUserId: string;
    handleDeleteChat: () => Promise<any>;
};

export default function ChatBox({ chat, currentUserId, handleDeleteChat }: TProps) {
    const socket = useSocket();
    const router = useRouter();
    /** The user's receiver */
    const [user, setUser] = useState<IUser | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [content, setContent] = useState<string>("");
    const [isChat, setIsChat] = useState<boolean>(false);

    const scroll = useRef<any>();

    useEffect(() => {
        if (chat) {
            const user = chat.members.filter((item) => item._id !== currentUserId)[0];
            setUser(user);
        }
    }, [chat, currentUserId]);

    const getMessages = async () => {
        try {
            const res = await request<any>("get", `${API_ENDPOINT.MESSAGE}/${chat?._id}`);
            setMessages(res.data);
        } catch (error: any) {}
    };

    useEffect(() => {
        chat && getMessages();
        if (chat) setIsChat(true);
        else setIsChat(false);
    }, [chat]);

    const handleSendMess = async () => {
        try {
            if (!content) return;

            const message = {
                chatId: chat?._id,
                senderId: currentUserId,
                content: content,
            };

            // Send to save database
            const res = await request<any>("post", API_ENDPOINT.MESSAGE, message);
            setContent("");
            setMessages((prev) => [...prev, res.data]);

            // Send message to socket server
            const receiverId = user?._id;
            const userSend = chat?.members.filter((user) => user._id !== receiverId)[0];
            if (receiverId !== null)
                socket.emit(EVENTS.MESSAGE.EMIT, {
                    ...message,
                    receiverId,
                    userSend: userSend?.name,
                });
        } catch (error: any) {}
    };

    useEffect(() => {
        if (chat?._id)
            socket.on(EVENTS.MESSAGE.ON, () => {
                getMessages();
            });

        return () => socket.off(EVENTS.MESSAGE.ON);
    }, [chat]);

    // scroll
    useEffect(() => {
        scroll.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
        });
    }, [messages]);

    return (
        <ChatBoxContainerStyled>
            {isChat ? (
                <>
                    <ChatHeaderStyled>
                        <ActionStyled
                            onClick={() =>
                                router.push(`${ROUTERS.SHOP_DETAIL}?shopId=${user?._id}`)
                            }
                        >
                            <Avatar size={"large"} src={user?.avatar} /> {user?.name}
                        </ActionStyled>
                        <DeleteButtonStyled
                            onClick={() =>
                                Modal.confirm({
                                    title: "Bạn có muốn xóa tất cả tin nhắn",
                                    onOk: handleDeleteChat,
                                    okText: "Xác nhận",
                                    cancelText: "Hủy",
                                })
                            }
                        >
                            <DeleteOutlined />
                        </DeleteButtonStyled>
                    </ChatHeaderStyled>

                    {/* Chat box messages */}
                    <ChatBodyStyled>
                        {messages.map((mess, index) => (
                            <MessageStyled
                                ref={scroll}
                                key={index}
                                $isOwner={mess.senderId === currentUserId}
                            >
                                <span>{mess.content}</span>
                                <span>{format(mess.createdAt)}</span>
                            </MessageStyled>
                        ))}
                    </ChatBodyStyled>

                    {/* Chat sender */}
                    <ChatSenderStyled>
                        <Input
                            style={{ padding: "7px" }}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Aa"
                        />
                        <SendStyled onClick={handleSendMess}>
                            <SendOutlined />
                        </SendStyled>
                    </ChatSenderStyled>
                </>
            ) : (
                <ChatBoxEmptyStyled className="chatbox-empty-message">
                    Nhấn vào cuộc trò chuyện...
                </ChatBoxEmptyStyled>
            )}
        </ChatBoxContainerStyled>
    );
}
