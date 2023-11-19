import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import request from "@/services/request";
import AccountLayout from "@/layouts/AccountLayout";
import UserLayout from "@/layouts/UserLayout";
import { API_ENDPOINT } from "@/constants/apis";
import { CreditCardOutlined } from "@ant-design/icons";

const ContainerStyled = styled.div`
    padding: 0 20px;

    & h2,
    h4 {
        font-weight: 500;
        margin-bottom: 10px;
    }
`;

const BoxInfoStyled = styled.div`
    font-size: 16px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);

    @media only screen and (max-width: 1000px) {
        flex-direction: column;
        gap: 40px;
    }
`;

const BoxInfoRightStyled = styled.div`
    width: 50%;
`;

const BoxInfoLeftStyled = styled.div`
    width: 50%;

    & div {
        display: flex;
        align-items: flex-start;

        @media only screen and (max-width: 1000px) {
            justify-content: space-between;
        }
    }

    @media only screen and (max-width: 1000px) {
        width: 100%;
    }
`;

const NumberStyled = styled.span`
    font-size: 24px;
    font-weight: 600;
    margin-right: 10px;
`;

interface IAccounting {
    owner: string;
    accountBalance: number;
}

export default function Accounting() {
    const [accounting, setAccounting] = useState<IAccounting | null>(null);

    const getAccounting = async () => {
        try {
            const res = await request<any>("get", API_ENDPOINT.ACCOUNTING);
            setAccounting(res.data);
        } catch (error) {}
    };

    useEffect(() => {
        getAccounting();
    }, []);

    return (
        <ContainerStyled>
            <h2>Tổng quan</h2>
            <BoxInfoStyled>
                <BoxInfoLeftStyled>
                    <h4>Số dư</h4>
                    <div>
                        <NumberStyled>
                            {accounting?.accountBalance.toLocaleString("vi") || 0} đ
                        </NumberStyled>
                        <Button disabled type="primary">
                            Yêu cầu thanh toán
                        </Button>
                    </div>
                </BoxInfoLeftStyled>
                <BoxInfoRightStyled>
                    <h4>Tài khoản ngân hàng</h4>
                    <Button>
                        <CreditCardOutlined /> Thêm tài khoản ngân hàng
                    </Button>
                </BoxInfoRightStyled>
            </BoxInfoStyled>
        </ContainerStyled>
    );
}

Accounting.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout title="Tài chính">{page}</AccountLayout>
        </UserLayout>
    );
};
