import React from "react";
import { Button, Image, Layout, Space, Table, message } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import CartAtom from "@/stores/CartStore";
import styled from "styled-components";
import { ColumnsType } from "antd/es/table";
import { ICartItemProduct } from "@/interfaces";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";
import CheckoutAtom from "@/stores/CheckoutStore";
import { useRouter } from "next/router";
import ROUTERS from "@/constants/routers";

const { Header } = Layout;

const HeaderStyled = styled(Header)`
    background-color: #fff;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 20px;

    & h2,
    h3 {
        font-weight: 400;
    }
`;

const LayoutStyled = styled(Layout)`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const WhiteStyled = styled.div`
    background-color: #fff;
`;

const QuantityStyled = styled.div`
    width: 40px;
    height: auto;
    text-align: center;
    display: grid;
    place-items: center;
`;

const FooterStyled = styled.div`
    display: flex;
    justify-content: right;
`;

const handleActionCart = async (ownerProducts: string, product: string, api: string) => {
    try {
        await request<any>("post", api, {
            ownerProducts: ownerProducts,
            product: product,
        });
        PubSub.publishSync(PUBSUB_SUBSCRIBE_NAME.GET_CART);
    } catch (error: any) {
        message.error(error.response.data.message);
    }
};

const columns: ColumnsType<ICartItemProduct> = [
    {
        title: "Sản phẩm",
        render: (_, record) => (
            <div>
                <Image preview={false} src={record.product.images[0]} width={50} />{" "}
                {record.product.name}
            </div>
        ),
    },
    {
        title: "Giá thành",
        render: (_, record) => <div>{record.product.price.toLocaleString("vi")}</div>,
    },
    {
        title: "Số lượng",
        render: (_, record) => (
            <Space.Compact block>
                <Button
                    size="small"
                    onClick={() =>
                        handleActionCart(
                            record.product.owner,
                            record.product._id,
                            API_ENDPOINT.CART.ADD_TO_CART
                        )
                    }
                >
                    <PlusOutlined />
                </Button>
                <QuantityStyled>
                    <div>{record.quantity}</div>
                </QuantityStyled>
                <Button
                    size="small"
                    onClick={() =>
                        handleActionCart(
                            record.product.owner,
                            record.product._id,
                            API_ENDPOINT.CART.DECREASE_TO_CART
                        )
                    }
                >
                    <MinusOutlined />
                </Button>
            </Space.Compact>
        ),
        width: 120,
    },
    {
        title: "Thao tác",
        width: 100,
        render: (_, record) => (
            <div>
                <Button
                    danger
                    type="primary"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() =>
                        handleActionCart(
                            record.product.owner,
                            record.product._id,
                            API_ENDPOINT.CART.REMOVE_TO_CART
                        )
                    }
                >
                    Xóa
                </Button>
            </div>
        ),
    },
];

export default function Cart() {
    const router = useRouter();
    const cart = useRecoilValue(CartAtom);
    const [checkout, setCheckout] = useRecoilState(CheckoutAtom);

    return (
        <Layout>
            <HeaderStyled>
                <h2>GIỎ HÀNG CỦA BẠN</h2>
            </HeaderStyled>
            <LayoutStyled>
                {cart.list.map((item, index) => (
                    <WhiteStyled>
                        <Table
                            scroll={{ x: "max-content" }}
                            key={index}
                            title={() => (
                                <div>
                                    <Image
                                        preview={false}
                                        width={50}
                                        src={item.ownerProducts.avatar}
                                    />{" "}
                                    {item.ownerProducts.name}
                                </div>
                            )}
                            columns={columns}
                            dataSource={item?.items.map((item, index) => ({
                                key: index,
                                ...item,
                            }))}
                            pagination={false}
                            footer={() => (
                                <FooterStyled>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setCheckout(item);
                                            router.push(ROUTERS.CHECKOUT);
                                        }}
                                    >
                                        Mua hàng
                                    </Button>
                                </FooterStyled>
                            )}
                        />
                    </WhiteStyled>
                ))}
            </LayoutStyled>
        </Layout>
    );
}
