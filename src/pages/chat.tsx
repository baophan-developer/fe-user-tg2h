import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import { Conversation } from "@/components/molecules";
import { IChat } from "@/interfaces";
import { ChatBox } from "@/components/organisms";
import styled from "styled-components";

const ChatStyled = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 22% auto;
    gap: 1rem;
    background-color: white;

    @media screen and (max-width: 768px) {
        grid-template-columns: 18% auto;
    }
`;

const LeftSideStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const ChatContainerStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: 1rem;
    padding: 1rem;
    height: auto;
    min-height: 80vh;
    overflow: auto;
`;

const ChatListStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const RightSideStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export default function Chat() {
    const user = useRecoilValue(UserAtom);
    const [chats, setChats] = useState<IChat[]>([]);
    const [currentChat, setCurrentChat] = useState<IChat>();

    const getChats = async () => {
        try {
            const res = await request<any>(
                "get",
                `${API_ENDPOINT.CHAT.MAIN}/${user._id}`
            );
            setChats(res.data);
        } catch (error: any) {}
    };

    useEffect(() => {
        user._id && getChats();
    }, [user]);

    return (
        <ChatStyled>
            {/* Left side */}
            <LeftSideStyled>
                <ChatContainerStyled>
                    <h2>Tin nhắn</h2>
                    <ChatListStyled>
                        {chats.map((chat, index) => (
                            <div key={index} onClick={() => setCurrentChat(chat)}>
                                <Conversation chat={chat} currentUserId={user._id} />
                            </div>
                        ))}
                    </ChatListStyled>
                </ChatContainerStyled>
            </LeftSideStyled>

            {/* Right side */}
            <RightSideStyled>
                {/* Chat body */}
                <ChatBox chat={currentChat} currentUserId={user._id} />
            </RightSideStyled>
        </ChatStyled>
    );
}
