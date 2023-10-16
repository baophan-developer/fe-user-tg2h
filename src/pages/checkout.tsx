import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import {
    Button,
    Col,
    Image,
    Input,
    Layout,
    List,
    Modal,
    Radio,
    Row,
    message,
} from "antd";
import UserAtom from "@/stores/UserStore";
import CheckoutAtom from "@/stores/CheckoutStore";
import { CiLocationOn } from "react-icons/ci";
import { AddressModal, Choices } from "@/components/organisms";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import { IProduct } from "@/interfaces";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import ROUTERS from "@/constants/routers";
import CartAtom from "@/stores/CartStore";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";

const { Header } = Layout;
const { Search } = Input;

const LayoutStyled = styled(Layout)`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const HeaderStyled = styled(Header)`
    background-color: #fff;
    height: fit-content;

    & h2 {
        font-weight: 400;
    }

    @media only screen and (max-width: 500px) {
        padding: 0 20px;
    }
`;

const AddressStyled = styled(Header)`
    background-color: #fff;
    height: fit-content;

    & h2 {
        height: 32px;
    }

    @media only screen and (max-width: 500px) {
        padding: 0 20px;
    }
`;

const AddressItemStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    & h3 {
        font-weight: 400;
    }

    @media only screen and (max-width: 500px) {
        margin: 20px 0;
        flex-direction: column;
        align-items: last baseline;
        line-height: 20px;
        gap: 10px;
    }
`;

const ListItemStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px 0;
    padding: 15px 50px;
    background-color: #fff;

    @media only screen and (max-width: 500px) {
        padding: 20px;
    }
`;

const OrderStyled = styled.div`
    padding: 20px 50px;
    display: flex;
    justify-content: right;
    flex-direction: column;
    background-color: #fff;
    align-items: flex-end;

    @media only screen and (max-width: 500px) {
        align-items: flex-start;
        padding: 20px;
    }
`;

const RightItemStyled = styled.div`
    width: fit-content;
    display: flex;
    flex-direction: column;

    & div {
        font-size: 18px;
        margin-bottom: 10px;
        align-items: center;
        display: flex;
        gap: 20px;

        & p {
            font-size: 24px;
            color: #fa541c;
        }
    }
`;

const ItemListStyled = styled.div`
    width: 100%;
`;

const ItemProductStyled = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 30px;

    & div {
        text-align: right;
        line-height: 30px;
    }
`;

const ItemPriceStyled = styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    background-color: aliceblue;
    padding: 10px;
`;

const DiscountStyled = styled.div`
    margin-top: 10px;
    width: fit-content;

    & div {
        color: #fa541c;
        line-height: 30px;
    }
`;

interface IItemsForCalculator {
    product: IProduct;
    discount: {
        _id: string;
        code: string;
    };
    quantity: number;
    price: number;
}

export default function Checkout() {
    const user = useRecoilValue(UserAtom);
    const checkout = useRecoilValue(CheckoutAtom);
    const router = useRouter();

    // item and totalPayment
    const [items, setItems] = useState<IItemsForCalculator[]>([]);
    const [totalPayment, setTotalPayment] = useState<number>(0);

    // address
    const [open, setOpen] = useState<boolean>(false);
    const [address, setAddress] = useState<string>();
    const [defaultAddress, setDefaultAddress] = useState<number>(0);

    // shipping and payment
    const shipping = useRef<{ value: { _id: string } }>();
    const payment = useRef<{ value: { _id: string } }>();

    const calculatorOrder = async (items: any) => {
        try {
            const res = await request<any>("post", API_ENDPOINT.ORDER.CALCULATOR, {
                items: items,
            });
            setItems(res.data.items);
            setTotalPayment(res.data.totalPayment);
        } catch (error) {}
    };

    const handleApplyDiscount = async (code: string, product: IProduct) => {
        try {
            const res = await request<any>("post", API_ENDPOINT.DISCOUNT.APPLY, {
                code: code,
            });
            const newItems = items.map((item) => {
                if (!item.product.discount) return item;
                if (item.product.discount.code === code) {
                    return {
                        ...item,
                        discount: item.product.discount,
                    };
                }
                return item;
            });
            calculatorOrder(newItems);
            message.success(res.data.message);
        } catch (error: any) {
            message.error(error.response.data.message);
        }
    };

    const handleOrder = async () => {
        try {
            if (shipping.current && payment.current) {
                const newItems = items.map((item) => {
                    if (item.discount)
                        return {
                            product: item.product._id,
                            discount: item.discount._id,
                            quantity: item.quantity,
                            price: item.price,
                        };
                    return item;
                });
                const order = {
                    cartId: checkout._id,
                    seller: checkout.ownerProducts._id,
                    shipping: shipping.current.value._id,
                    payment: payment.current.value._id,
                    items: newItems,
                    statusPayment: false,
                    totalPayment: totalPayment,
                    deliveryAddress: address,
                };
                const res = await request<any>("post", API_ENDPOINT.ORDER.CREATE, order);
                message.success(res.data.message);
                PubSub.publishSync(PUBSUB_SUBSCRIBE_NAME.GET_CART);
                router.push(ROUTERS.HOME);
            }
        } catch (error: any) {
            message.error(error.response.data.message);
        }
    };

    useEffect(() => {
        if (checkout.items) {
            const items = checkout.items.map((item) => ({
                product: item.product,
                quantity: item.quantity,
            }));
            calculatorOrder(items);
        }
    }, [checkout]);

    useEffect(() => {
        user.address &&
            setAddress(
                `${user.address[defaultAddress].street} - ${user.address[defaultAddress].address}`
            );
    }, [user]);

    return (
        <LayoutStyled>
            <HeaderStyled>
                <h2>ĐẶT HÀNG - THANH TOÁN</h2>
            </HeaderStyled>
            <AddressStyled>
                <h2>
                    Địa chỉ của bạn <CiLocationOn />
                </h2>
                <AddressItemStyled>
                    <div>
                        <h3>{address}</h3>
                    </div>
                    <Button onClick={() => setOpen(!open)}>Thay đổi</Button>
                    <Modal
                        title="Địa chỉ của tôi"
                        open={open}
                        onOk={() => setOpen(!open)}
                        onCancel={() => setOpen(!open)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Radio.Group
                            style={{ width: "100%" }}
                            onChange={(e) => {
                                setAddress(
                                    `${user.address[e.target.value].street} - ${
                                        user.address[e.target.value].address
                                    }`
                                );
                                setDefaultAddress(e.target.value);
                            }}
                            value={defaultAddress}
                        >
                            <List
                                dataSource={user.address}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <Radio
                                            value={index}
                                            style={{ marginRight: "20px" }}
                                        />
                                        <List.Item.Meta
                                            title={item.address}
                                            description={item.street}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Radio.Group>
                        <AddressModal />
                    </Modal>
                </AddressItemStyled>
            </AddressStyled>
            <ListItemStyled>
                <h2>Sản phẩm</h2>
                <List
                    dataSource={items}
                    renderItem={(item, index) => (
                        <List.Item>
                            <ItemListStyled>
                                <ItemProductStyled>
                                    <Image src={item.product.images[0]} width={100} />
                                    <div>
                                        <p>{item.product.name}</p>
                                        <p>{item.product.price.toLocaleString("vi")}</p>
                                    </div>
                                </ItemProductStyled>
                                <ItemPriceStyled>
                                    <div>{item.price.toLocaleString("vi")}</div>
                                    <div>x{item.quantity}</div>
                                </ItemPriceStyled>
                                <DiscountStyled>
                                    {item.product.discount && (
                                        <Search
                                            disabled={item.hasOwnProperty("discount")}
                                            placeholder="Nhập mã giảm giá"
                                            enterButton="Áp dụng"
                                            allowClear
                                            onSearch={(value) =>
                                                handleApplyDiscount(value, item.product)
                                            }
                                        />
                                    )}
                                    <div>
                                        {item.hasOwnProperty("discount") &&
                                            "Đã áp mã giảm giá"}
                                    </div>
                                </DiscountStyled>
                            </ItemListStyled>
                        </List.Item>
                    )}
                />
                <Choices
                    key={1}
                    ref={shipping}
                    req={{ method: "get", api: API_ENDPOINT.SHIPPING }}
                    title="Chọn phương thức vận chuyển"
                />
                <Choices
                    key={2}
                    ref={payment}
                    req={{ method: "get", api: API_ENDPOINT.PAYMENT }}
                    title="Chọn phương thức thanh toán"
                />
            </ListItemStyled>
            <OrderStyled>
                <RightItemStyled>
                    <div>
                        Tổng thanh toán: <p>{totalPayment.toLocaleString("vi")} đ</p>
                    </div>
                    <Button size="large" type="primary" onClick={() => handleOrder()}>
                        Thanh toán
                    </Button>
                </RightItemStyled>
            </OrderStyled>
        </LayoutStyled>
    );
}
