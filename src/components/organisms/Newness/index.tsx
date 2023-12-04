import React from "react";
import styled from "styled-components";

type TPops = {
    newness: string | number;
};

const getColor = (newness: number | string | undefined) => {
    switch (newness) {
        case 100:
            return "#a0d911";
        case 90:
            return "#1677ff";
        case 80:
            return "#fadb14";
        case 70:
            return "#fa8c16";
        case 60:
            return "#d4380d";
        case 50:
            return "#a8071a";
        default:
            return "#a0d911";
    }
};

const ItemStyled = styled.div<{ $newness?: number | string }>`
    width: fit-content;
    margin-top: 10px;
    padding: 0 10px;
    background-color: ${(props) => getColor(props.$newness)};
    color: white;
    font-weight: 550;
    border-radius: 10px;
`;

export default function Newness({ newness }: TPops) {
    switch (newness) {
        case 100:
            return (
                <ItemStyled $newness={newness}>
                    Tình trạng: Hoàn toàn mới 100% (New)
                </ItemStyled>
            );
        case 90:
            return (
                <ItemStyled $newness={newness}>
                    Tình trạng: Mới 90% - 99% (Like new/New in box)
                </ItemStyled>
            );
        case 80:
            return (
                <ItemStyled $newness={newness}>
                    Tình trạng: Rất tốt 80% - 89% (Excellent/Like new)
                </ItemStyled>
            );
        case 70:
            return (
                <ItemStyled $newness={newness}>
                    Tình trạng: Tốt 70% - 79% (Good/Very good)
                </ItemStyled>
            );
        case 60:
            return (
                <ItemStyled $newness={newness}>
                    Tình trạng: Khá 60% - 69% (Fair / Acceptable)
                </ItemStyled>
            );
        case 50:
            return (
                <ItemStyled $newness={newness}>
                    Tình trạng: Đã Sử Dụng 50% - 59% (Poor / For Parts or Not Working)
                </ItemStyled>
            );
        default:
            return (
                <ItemStyled $newness={newness}>
                    Tình trạng: Hoàn toàn mới 100% (New)
                </ItemStyled>
            );
    }
}
