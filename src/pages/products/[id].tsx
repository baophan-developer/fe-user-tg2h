import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IComment, IProductRender } from "@/interfaces";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import {
    Avatar,
    Button,
    Carousel,
    Descriptions,
    Form,
    Image,
    Input,
    List,
    Rate,
    Tooltip,
    message,
} from "antd";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";
import { CheckCircleOutlined, DeleteOutlined, HeartOutlined } from "@ant-design/icons";
import { getLayoutDescriptionProduct } from "@/configs/product.config";
import ROUTERS from "@/constants/routers";
import { useSocket } from "@/contexts/SocketContext";
import dayjs from "dayjs";
import { EVENTS } from "@/constants/events";
import { discount } from "@/components/templates/ViewProducts";
import { CountDown } from "@/components/organisms";
import Newness from "@/components/organisms/Newness";

const { TextArea } = Input;

const ProductBriefingStyled = styled.div`
    min-height: 550px;
    padding: 20px;
    display: flex;
    gap: 0 40px;
    background-color: #fff;
    justify-content: space-evenly;

    @media only screen and (max-width: 500px) {
        flex-direction: column;
    }
`;

const ContainerImageStyled = styled.div`
    width: 600px;

    @media only screen and (max-width: 1000px) {
        width: 300px;
    }

    @media only screen and (max-width: 500px) {
        width: 400px;
    }
`;

const ListImageStyled = styled.div`
    margin-top: 10px;
`;

const BriefingInfoStyled = styled.div`
    width: 600px;
    position: relative;
    line-height: 40px;

    & h2,
    h3 {
        font-weight: 400;
    }

    & h2:nth-child(3) {
        color: #fa541c;
    }

    & h3 {
        color: #f5222d;
        text-decoration: underline;
    }

    @media only screen and (max-width: 1000px) {
        width: 500px;
    }

    @media only screen and (max-width: 500px) {
        width: 400px;
    }
`;

const EvaluateStyled = styled.div`
    display: flex;
    gap: 0 30px;
    align-items: center;
    font-size: 16px;

    @media only screen and (max-width: 900px) {
        flex-direction: column;
        align-items: flex-start;
        line-height: 30px;
    }

    @media only screen and (max-width: 500px) {
        flex-direction: column;
        align-items: flex-start;
        line-height: 30px;
    }
`;

const BottomStyled = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0;
    font-size: 14px;

    @media only screen and (max-width: 1000px) {
        bottom: 0;
    }

    @media only screen and (max-width: 500px) {
        position: relative;
        bottom: 0;
    }
`;

const BottomItemStyled = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const BoxInformationStyled = styled.div`
    margin-top: 20px;
    padding: 20px 40px;
    background-color: #fff;
    line-height: 25px;

    & h3 {
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 5px 10px;
        background-color: rgba(0, 0, 0, 0.02);
        font-weight: 400;
    }

    & p {
        font-size: 16px;
    }
`;

const IConHeartStyled = styled.div`
    display: flex;
    align-items: center;
`;

const CommentStyled = styled.div`
    display: flex;
    justify-content: space-between;
`;

const DeleteCommentStyled = styled.div`
    cursor: pointer;
`;

const BoxShopStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const DayStyled = styled.div`
    margin-top: 5px;
    font-size: 12px;
`;

const RatingStyled = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    & p {
        text-decoration: underline 1px;
        color: red;
    }
`;

const QuantityStyled = styled.span`
    display: flex;
    gap: 6px;

    :nth-child(1) {
        text-decoration: underline 1px;
    }

    :nth-child(2) {
        color: #767676;
    }
`;

const PriceStyled = styled.div`
    /* margin-top: 10px; */
    padding: 5px 20px;
    background-color: #f1f1f1;

    @media only screen and (max-width: 500px) {
        width: 375px;
    }
`;

const PriceItemStyled = styled.div`
    display: flex;
    gap: 10px;
`;

const DiscountStyled = styled.p<{ $discount?: any }>`
    display: ${(props) => !props.$discount && "none"};
    text-decoration: ${(props) => props.$discount && "line-through"};
    font-size: 18px;
`;

const NameUserCommentStyled = styled.div`
    font-weight: 550;
    display: flex;
    gap: 20px;

    :nth-child(2) {
        font-size: 14px;
        font-weight: 400;
        color: #a0d911;
    }
`;

interface IQuery {
    filter?: any;
    pagination?: any;
}

export default function DetailProduct() {
    const socket = useSocket();

    const router = useRouter();
    const productId = router.query.id as string;
    const user = useRecoilValue(UserAtom);
    const carouselRef: any = React.createRef();
    const [product, setProduct] = useState<IProductRender>();
    const [comments, setComments] = useState<IComment[]>([]);
    const [query, setQuery] = useState<IQuery>({ pagination: { limit: 10 } });
    const [total, setTotal] = useState<number>(0);
    const [form] = Form.useForm();

    const [checkFavorites, setCheckFavorites] = useState<boolean>(false);

    const getProduct = async () => {
        try {
            const res = await request<any>(
                "get",
                `${API_ENDPOINT.PRODUCT.GET}/${productId}`
            );
            setProduct(res.data.item);
        } catch (error) {}
    };

    const handleAddToCart = async (ownerProducts: string, product: string) => {
        try {
            const res = await request<any>("post", API_ENDPOINT.CART.ADD_TO_CART, {
                ownerProducts: ownerProducts,
                product: product,
            });
            message.success(res.data.message, 1);
            PubSub.publishSync(PUBSUB_SUBSCRIBE_NAME.GET_CART);
        } catch (error: any) {
            message.error(error.response.data.message);
        }
    };

    const getComment = async () => {
        try {
            const res = await request<any>("post", API_ENDPOINT.COMMENTS.MAIN, query);
            setComments(res.data.comments);
            setTotal(res.data.total);
            getProduct();
        } catch (error) {}
    };

    const addComment = async (value: any) => {
        try {
            const res = await request("post", API_ENDPOINT.COMMENTS.ADD, {
                ...value,
                product: productId,
            });

            // Create notification for seller is here
            if (user._id !== product?.owner._id)
                socket.emit(EVENTS.NOTIFICATION.EMIT, {
                    title: "Đánh giá sản phẩm",
                    message: `Người dùng ${user.name} đã đánh giá sản phẩm ${product?.name} của bạn.`,
                    userReceive: product?.owner._id,
                });

            socket.emit(EVENTS.NOTIFICATION.EMIT, {});

            form.resetFields();
            message.success(res.data.message);
            getComment();
        } catch (error: any) {
            message.error(error.response.data.message);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            const res = await request<any>(
                "delete",
                `${API_ENDPOINT.COMMENTS.MAIN}/?id=${commentId}&productId=${productId}`
            );
            socket.emit(EVENTS.NOTIFICATION.EMIT, {});
            message.success(res.data.message);
            // getComment();
        } catch (error: any) {
            message.error(error.response.data.message);
        }
    };

    const handleAddOrRemoveProductToFavorites = async (api: string) => {
        try {
            const res = await request<any>("put", api, {
                product: productId,
            });
            message.success(res.data.message);
            PubSub.publishSync(PUBSUB_SUBSCRIBE_NAME.GET_INFO);
        } catch (error: any) {
            message.error(error.response.data.message);
        }
    };

    useEffect(() => {
        productId && getProduct();
        setQuery((prev) => ({
            ...prev,
            filter: { ...prev?.filter, product: productId },
        }));
    }, [productId]);

    useEffect(() => {
        getComment();
    }, [query]);

    useEffect(() => {
        if (user) {
            const findProductInFavorites = user?.favorites?.findIndex(
                (item) => item._id === productId
            );
            if (findProductInFavorites !== -1 && findProductInFavorites !== undefined) {
                setCheckFavorites(true);
            } else {
                setCheckFavorites(false);
            }
        }
    }, [user]);

    // Catch comment realtime
    useEffect(() => {
        socket.on(EVENTS.NOTIFICATION.ON, () => {
            setQuery((prev) => ({
                ...prev,
                filter: { ...prev?.filter, product: productId },
            }));
        });
    }, [query]);

    return (
        <div>
            <ProductBriefingStyled>
                <ContainerImageStyled>
                    <Carousel ref={carouselRef}>
                        {product?.images.map((item, index) => (
                            <Image key={index} src={item} />
                        ))}
                    </Carousel>
                    <ListImageStyled>
                        {product?.images.map((item, index) => (
                            <Image
                                key={index}
                                src={item}
                                width={70}
                                preview={false}
                                onClick={() => carouselRef.current.goTo(index)}
                            />
                        ))}
                    </ListImageStyled>
                </ContainerImageStyled>
                <BriefingInfoStyled>
                    <h2>{product?.name}</h2>
                    <EvaluateStyled>
                        <RatingStyled>
                            <p>{product?.rating.toFixed(1)}</p>
                            <Rate
                                value={product?.rating}
                                disabled
                                style={{ fontSize: "14px", color: "red" }}
                                allowHalf
                            />
                        </RatingStyled>
                        <QuantityStyled>
                            <p>{product?.reviews}</p>
                            <p>Lượt đánh giá</p>
                        </QuantityStyled>
                        <QuantityStyled>
                            <p>{product?.sold}</p>
                            <p>Đã bán</p>
                        </QuantityStyled>
                    </EvaluateStyled>
                    <div>
                        {product?.discount &&
                            Date.parse(product?.discount?.start) < Date.now() && (
                                <>
                                    <CountDown deadline={product?.discount?.end} />
                                </>
                            )}

                        {product?.discount &&
                            Date.parse(product?.discount?.start) > Date.now() && (
                                <div>
                                    Giảm giá bắt đầu từ:{" "}
                                    {dayjs(product.discount.start).format(
                                        "HH:mm DD-MM-YYYY"
                                    )}
                                </div>
                            )}
                    </div>
                    <PriceStyled>
                        <PriceItemStyled>
                            <DiscountStyled $discount={product?.discount}>
                                {product?.price.toLocaleString("vi") + " đ"}
                            </DiscountStyled>
                            <p
                                style={{
                                    fontSize: "22px",
                                    color: "red",
                                    fontWeight: "500",
                                }}
                            >
                                {product &&
                                    discount(product?.price, product?.discount?.percent)}
                            </p>
                        </PriceItemStyled>
                        <div>
                            {product?.discount &&
                                `Mã giảm giá: ${product?.discount?.code}`}
                        </div>
                    </PriceStyled>
                    {product && <Newness newness={product?.newness} />}
                    <BottomStyled>
                        <div>{product?.quantity} sản phẩm hiện có</div>
                        <BottomItemStyled>
                            <Button
                                icon={<AiOutlineShoppingCart />}
                                type="primary"
                                disabled={
                                    product?.owner?._id === user._id ||
                                    product?.quantity === 0
                                }
                                onClick={() =>
                                    handleAddToCart(
                                        product?.owner._id as string,
                                        product?._id as string
                                    )
                                }
                            >
                                Thêm vào giỏ hàng
                            </Button>
                            <div>
                                {user._id !== product?.owner._id && (
                                    <Tooltip
                                        title={`${
                                            checkFavorites
                                                ? "Xóa khỏi yêu thích"
                                                : "Thêm vào yêu thích"
                                        }`}
                                    >
                                        <IConHeartStyled
                                            style={{
                                                color: "red",
                                                cursor: "pointer",
                                                fontSize: "22px",
                                            }}
                                            onClick={() => {
                                                checkFavorites
                                                    ? handleAddOrRemoveProductToFavorites(
                                                          API_ENDPOINT.PROFILE
                                                              .REMOVE_PRODUCT_TO_FAVORITES
                                                      )
                                                    : handleAddOrRemoveProductToFavorites(
                                                          API_ENDPOINT.PROFILE
                                                              .ADD_PRODUCT_TO_FAVORITES
                                                      );
                                            }}
                                        >
                                            {checkFavorites ? (
                                                <AiFillHeart />
                                            ) : (
                                                <AiOutlineHeart />
                                            )}
                                        </IConHeartStyled>
                                    </Tooltip>
                                )}
                            </div>
                        </BottomItemStyled>
                    </BottomStyled>
                </BriefingInfoStyled>
            </ProductBriefingStyled>
            <BoxInformationStyled>
                <BoxShopStyled>
                    <div>
                        <Avatar src={product?.owner.avatar} alt={product?.owner.name} />{" "}
                        {product?.owner.name}
                    </div>
                    <div>
                        <Button
                            onClick={() =>
                                router.push(
                                    `${ROUTERS.SHOP_DETAIL}?shopId=${product?.owner._id}`
                                )
                            }
                        >
                            Xem Shop
                        </Button>
                    </div>
                </BoxShopStyled>
            </BoxInformationStyled>
            <BoxInformationStyled>
                <h3>Thông tin chi tiết sản phẩm</h3>
                <Descriptions
                    // bordered
                    items={product && getLayoutDescriptionProduct(product)}
                />
                <h3>Mô tả sản phẩm</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{product?.desc}</p>
            </BoxInformationStyled>
            <BoxInformationStyled>
                <div>
                    <Form layout="vertical" onFinish={addComment} form={form}>
                        <Form.Item name="content" label={<Avatar src={user.avatar} />}>
                            <TextArea
                                showCount
                                maxLength={1000}
                                style={{ height: 50, resize: "none" }}
                                placeholder="Đánh giá"
                            />
                        </Form.Item>
                        <Form.Item name="rating">
                            <Rate style={{ color: "red", fontSize: "16px" }} />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">
                                Gửi
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                {/* Comments */}
                <List
                    locale={{ emptyText: "Không có đánh giá nào ở đây." }}
                    dataSource={comments}
                    pagination={
                        total > 10 && {
                            total: total,
                            size: "small",
                            onChange(page) {
                                setQuery((prev) => ({
                                    ...prev,
                                    pagination: { ...prev?.pagination, page: page - 1 },
                                }));
                            },
                        }
                    }
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={item.user.avatar} />}
                                title={
                                    <CommentStyled>
                                        <NameUserCommentStyled>
                                            <p>{item.user.name}</p>
                                            {product &&
                                                item.user.bought.includes(
                                                    product?._id
                                                ) && (
                                                    <p>
                                                        Đã mua <CheckCircleOutlined />
                                                    </p>
                                                )}
                                        </NameUserCommentStyled>
                                        <div>
                                            {item.user._id === user._id && (
                                                <DeleteCommentStyled
                                                    onClick={() =>
                                                        handleDeleteComment(item._id)
                                                    }
                                                >
                                                    <DeleteOutlined />
                                                </DeleteCommentStyled>
                                            )}
                                        </div>
                                    </CommentStyled>
                                }
                                description={
                                    <Rate
                                        style={{ fontSize: "14px", color: "red" }}
                                        disabled
                                        value={item.rating}
                                    />
                                }
                            />
                            {item.content}
                            <DayStyled>
                                {dayjs(item.createdAt).format("HH:mm DD-MM-YYYY")}
                            </DayStyled>
                        </List.Item>
                    )}
                />
            </BoxInformationStyled>
        </div>
    );
}
