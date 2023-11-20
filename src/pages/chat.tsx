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
    gap: 0;
    background-color: white;

    @media screen and (max-width: 1200px) {
        grid-template-columns: 25% auto;
    }

    @media screen and (max-width: 500px) {
        grid-template-columns: 13% auto;
    }
`;

const LeftSideStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-right: 1px solid #d9d9d9;
`;

const ChatContainerStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    height: auto;
    min-height: 70vh;
    overflow: auto;

    @media only screen and (max-width: 1000px) {
        padding: 0.5rem;

        & h2 {
            padding: 0.5rem;
        }
    }

    @media only screen and (max-width: 500px) {
        padding: 2px;

        & h2 {
            display: none;
        }
    }
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
    const [isActive, setIsActive] = useState<string>();

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
                            <div
                                key={index}
                                onClick={() => {
                                    setCurrentChat(chat);
                                    setIsActive(chat._id);
                                }}
                            >
                                <Conversation
                                    chat={chat}
                                    currentUserId={user._id}
                                    active={chat._id === isActive}
                                />
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
