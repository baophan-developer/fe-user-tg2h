import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { Button, Col, DatePicker, Row, Tabs, TimeRangePickerProps } from "antd";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";
import { EOrder } from "@/enums/order-enums";
import { OrderList } from "@/components/organisms";
import handleExportDataToExcel from "@/utils/handle-export-to-excel";

const { RangePicker } = DatePicker;

const IntroStyled = styled.div`
    padding: 10px 20px;
    line-height: 30px;

    & h2,
    h3,
    h4 {
        font-weight: 500;
    }

    & h4 {
        color: #999;
    }

    @media only screen and (max-width: 500px) {
        padding: 0px;
    }
`;

const DetailStyled = styled.div`
    padding: 10px 20px;

    & h2 {
        font-weight: 500;
    }

    @media only screen and (max-width: 500px) {
        padding: 0px;
    }
`;

const ActionOrderStyled = styled.div`
    display: flex;
    justify-content: space-between;

    & div {
        display: flex;
        gap: 10px;
    }

    @media only screen and (max-width: 500px) {
        flex-direction: column;
        gap: 20px;
    }
`;

interface IRevenue {
    paid: number;
    awaitPayment: number;
    numberOrderCancel: number;
    numberOrderSuccess: number;
    numberOrderDelivering: number;
}

interface IQuery {
    filter: {
        seller?: string;
        updatedAt?: { $gte: string; $lte: string };
        statusPayment?: boolean;
        statusOrder?: { $in: string[] };
    };
}

interface IDefaultDate {
    start: Date | string;
    end: Date | string;
}

const formatDate = "YYYY-MM-DD HH:mm";

const rangePresets: TimeRangePickerProps["presets"] = [
    {
        label: "Hôm nay",
        value: [dayjs(), dayjs().endOf("day")],
    },
    { label: "7 ngày trước", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "14 ngày trước", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "30 ngày trước", value: [dayjs().add(-30, "d"), dayjs()] },
];

export default function Statistics() {
    const user = useRecoilValue(UserAtom);
    const [revenue, setRevenue] = useState<IRevenue>();
    const [orders, setOrders] = useState([]);
    const [query, setQuery] = useState<IQuery>();
    const [defaultDate, setDefaultDate] = useState<IDefaultDate>();

    const getOrders = async () => {
        try {
            const res = await request<any>("post", API_ENDPOINT.ORDER.GET, query);
            setOrders(res.data.list);
        } catch (error) {}
    };

    const getDataRevenue = async (start: string, end: string) => {
        try {
            const res = await request<any>("post", API_ENDPOINT.FINANCE, {
                filter: { start, end },
            });
            setRevenue(res.data);
        } catch (error: any) {}
    };

    useEffect(() => {
        const today = new Date();
        const startDay = `${dayjs(today).format("YYYY-MM-DD")} 00:00`;
        const endDay = `${dayjs(today).format("YYYY-MM-DD")} 23:59`;
        setDefaultDate({ start: startDay, end: endDay });
        getDataRevenue(startDay, endDay);
        setQuery({
            filter: {
                seller: user._id,
                updatedAt: { $gte: startDay, $lte: endDay },
                statusOrder: { $in: [EOrder.DELIVERING, EOrder.FINISH, EOrder.ORDERED] },
                statusPayment: false,
            },
        });
    }, [user]);

    useEffect(() => {
        getOrders();
    }, [query]);

    return (
        <div>
            <IntroStyled>
                <h2>Tổng quan tháng {dayjs().month() + 1}</h2>
                <Row>
                    <Col span={12}>
                        <h3>Đã thanh toán</h3>
                        <h4>Tháng này</h4>
                        <div>{revenue?.paid.toLocaleString("vi")} đ</div>
                        <h3>Chờ thanh toán</h3>
                        <h4>Tổng</h4>
                        <div>{revenue?.awaitPayment.toLocaleString("vi")} đ</div>
                    </Col>
                    <Col span={12}>
                        <h3>Tổng đơn đã giao</h3>
                        <h4>Tháng này</h4>
                        <div>{revenue?.numberOrderSuccess}</div>
                        <h3>Tổng đơn đang giao</h3>
                        <h4>Tháng này</h4>
                        <div>{revenue?.numberOrderDelivering}</div>
                        <h3>Tổng đơn đã hủy</h3>
                        <h4>Tháng này</h4>
                        <div>{revenue?.numberOrderCancel}</div>
                    </Col>
                </Row>
            </IntroStyled>
            <DetailStyled>
                <ActionOrderStyled>
                    <h2>Chi tiết</h2>
                    <div>
                        <RangePicker
                            format="YYYY/MM/DD"
                            defaultValue={[
                                dayjs(defaultDate?.start),
                                dayjs(defaultDate?.end),
                            ]}
                            presets={rangePresets}
                            onChange={(value) => {
                                if (value) {
                                    const start = `${dayjs(value[0]).format(
                                        "YYYY-MM-DD"
                                    )} 00:00`;
                                    const end = dayjs(value[1]).format(
                                        "YYYY-MM-DD HH:mm"
                                    );
                                    setQuery((prev) => ({
                                        ...prev,
                                        filter: {
                                            ...prev?.filter,
                                            updatedAt: {
                                                $gte: start,
                                                $lte: end,
                                            },
                                        },
                                    }));
                                }
                            }}
                        />
                        <Button onClick={() => handleExportDataToExcel(orders)}>
                            Xuất
                        </Button>
                    </div>
                </ActionOrderStyled>
                <Tabs
                    defaultActiveKey="chua_thanh_toan"
                    items={[
                        {
                            key: "chua_thanh_toan",
                            label: "Chưa thanh toán",
                            children: <OrderList orders={orders} isSeller />,
                        },
                        {
                            key: "da_thanh_toan",
                            label: "Đã thanh toán",
                            children: (
                                <div>
                                    <OrderList orders={orders} isSeller />
                                </div>
                            ),
                        },
                    ]}
                    onChange={(value) => {
                        value === "chua_thanh_toan"
                            ? setQuery((prev) => ({
                                  ...prev,
                                  filter: { ...prev?.filter, statusPayment: false },
                              }))
                            : setQuery((prev) => ({
                                  ...prev,
                                  filter: { ...prev?.filter, statusPayment: true },
                              }));
                    }}
                />
            </DetailStyled>
        </div>
    );
}

Statistics.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout title="Thống kê">{page}</AccountLayout>
        </UserLayout>
    );
};
