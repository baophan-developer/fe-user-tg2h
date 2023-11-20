import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "antd";
import { IChat, IUser } from "@/interfaces";

const ConversationStyled = styled.div`
    border-radius: 0.5rem;
    padding: 10px;

    &:hover {
        background: #80808038;
        cursor: pointer;
    }
`;

type TProps = {
    chat: IChat;
    currentUserId: string;
};

export default function Conversation({ chat, currentUserId }: TProps) {
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const user = chat.members.filter((item) => item._id !== currentUserId)[0];
        setUser(user);
    }, [chat, currentUserId]);

    return (
        <ConversationStyled>
            <Avatar src={user?.avatar} /> {user?.name}
        </ConversationStyled>
    );
}
