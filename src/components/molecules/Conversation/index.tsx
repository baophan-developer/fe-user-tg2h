import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "antd";
import { IChat, IUser } from "@/interfaces";

const ConversationStyled = styled.div<{ $active?: boolean }>`
    display: flex;
    border-radius: 0.5rem;
    padding: 10px;
    align-items: center;
    gap: 10px;

    background-color: ${(props) => props.$active && "#80808038"};

    &:hover {
        background: #80808038;
        cursor: pointer;
    }

    @media only screen and (max-width: 1000px) {
        padding: 5px;
    }

    @media only screen and (max-width: 500px) {
        justify-content: center;
        padding: 5px;

        & p {
            display: none;
        }
    }
`;

type TProps = {
    chat: IChat;
    currentUserId: string;
    active?: boolean;
};

export default function Conversation({ chat, currentUserId, active }: TProps) {
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const user = chat.members.filter((item) => item._id !== currentUserId)[0];
        setUser(user);
    }, [chat, currentUserId]);

    return (
        <ConversationStyled $active={active}>
            <Avatar src={user?.avatar} /> <p>{user?.name}</p>
        </ConversationStyled>
    );
}
