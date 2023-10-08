import { styled } from "styled-components";

const PendingStyled = styled.div<{ $approve?: boolean }>`
    color: ${(props) => (props.$approve ? "#a0d911" : "#fa541c")};
`;

export default PendingStyled;
