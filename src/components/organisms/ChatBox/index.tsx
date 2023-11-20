import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Avatar, Input } from "antd";
import { format } from "timeago.js";
import request from "@/services/request";
import { IChat, IMessage, IUser } from "@/interfaces";
import { API_ENDPOINT } from "@/constants/apis";
import { SendOutlined } from "@ant-design/icons";
import { useSocket } from "@/contexts/SocketContext";
import { EVENTS } from "@/constants/events";

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
    padding: 1rem 1rem 0rem 1rem;
    display: flex;
    flex-direction: column;
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

type TProps = {
    chat: IChat | undefined;
    currentUserId: string;
};

export default function ChatBox({ chat, currentUserId }: TProps) {
    const socket = useSocket();
    /** The user's receiver */
    const [user, setUser] = useState<IUser | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [content, setContent] = useState<string>("");

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
            if (receiverId !== null)
                socket.emit(EVENTS.MESSAGE.EMIT, { ...message, receiverId });
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
            {chat ? (
                <>
                    <ChatHeaderStyled className="chat-header">
                        <div>
                            <Avatar size={"large"} src={user?.avatar} /> {user?.name}
                        </div>
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
