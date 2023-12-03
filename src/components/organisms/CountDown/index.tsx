import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;
    background-color: #fe9677;
    /* linear-gradient(-90deg, #f0451e 9%, #f32424 96%) */

    & p {
        font-size: 22px;
        color: white;
        font-weight: 550;
    }

    @media only screen and (max-width: 600px) {
        flex-direction: column;
        padding: 5px 20px 15px;
    }
`;

const TimerStyled = styled.div`
    display: flex;
    gap: 5px;

    & div {
        width: 40px;
        height: 40px;
        font-size: 24px;
        background-color: white;
        text-align: center;
        font-weight: 500;
    }
`;

type TProps = {
    title?: String;
    deadline: string;
};

export default function CountDown({ title, deadline }: TProps) {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const getTime = () => {
        const time = Date.parse(deadline) - Date.now();

        setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));
    };

    useEffect(() => {
        const interval = setInterval(() => getTime(), 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Container>
            <p>{title || "GIẢM GIÁ CÒN"}</p>
            <TimerStyled>
                <div>{days}</div>
                <p>Ngày</p>
                <div>{hours}</div>
                <p>:</p>
                <div>{minutes}</div>
                <p>:</p>
                <div>{seconds}</div>
            </TimerStyled>
        </Container>
    );
}
