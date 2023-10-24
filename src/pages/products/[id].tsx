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
import { DeleteOutlined, HeartOutlined } from "@ant-design/icons";
import { getLayoutDescriptionProduct } from "@/configs/product.config";

const { TextArea } = Input;

const ProductBriefingStyled = styled.div`
    padding: 10px;
    display: flex;
    gap: 0 40px;
    background-color: #fff;
    justify-content: center;

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

    @media only screen and (max-width: 500px) {
        flex-direction: column;
        align-items: flex-start;
        line-height: 30px;
    }
`;

const ButtonStyled = styled(Button)`
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    height: 38px;
    font-size: 16px;

    @media only screen and (max-width: 1000px) {
        bottom: 0;
    }

    @media only screen and (max-width: 500px) {
        position: relative;
        bottom: 0;
    }
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
        background-color: antiquewhite;
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

interface IQuery {
    filter?: any;
    pagination?: any;
}

export default function DetailProduct() {
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
            message.success(res.data.message);
            getComment();
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
                                width={100}
                                preview={false}
                                onClick={() => carouselRef.current.goTo(index)}
                            />
                        ))}
                    </ListImageStyled>
                </ContainerImageStyled>
                <BriefingInfoStyled>
                    <h2>{product?.name}</h2>
                    <EvaluateStyled>
                        <div>
                            <Rate
                                value={product?.rating}
                                disabled
                                style={{ fontSize: "16px" }}
                                allowHalf
                            />
                        </div>
                        <div>Lượt đánh giá {product?.reviews}</div>
                        <div>Lượt mua {product?.sold}</div>
                        <div>
                            <Tooltip
                                title={`${
                                    checkFavorites
                                        ? "Xóa khỏi yêu thích"
                                        : "Thêm vào yêu thích"
                                }`}
                            >
                                <IConHeartStyled
                                    style={{ color: "red", cursor: "pointer" }}
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
                        </div>
                    </EvaluateStyled>
                    <h2>{product?.price.toLocaleString("vi")} vnđ</h2>
                    <ButtonStyled
                        icon={<AiOutlineShoppingCart />}
                        type="primary"
                        disabled={product?.owner?._id === user._id}
                        onClick={() =>
                            handleAddToCart(
                                product?.owner._id as string,
                                product?._id as string
                            )
                        }
                    >
                        Thêm vào giỏ hàng
                    </ButtonStyled>
                </BriefingInfoStyled>
            </ProductBriefingStyled>
            <BoxInformationStyled>
                <h3>Thông tin chi tiết sản phẩm</h3>
                <Descriptions
                    bordered
                    items={product && getLayoutDescriptionProduct(product)}
                />
                <h3>Mô tả sản phẩm</h3>
                <p>{product?.desc}</p>
            </BoxInformationStyled>
            <BoxInformationStyled>
                <div>
                    <Form layout="vertical" onFinish={addComment} form={form}>
                        <Form.Item name="content" label={<Avatar src={user.avatar} />}>
                            <TextArea
                                showCount
                                maxLength={1000}
                                style={{ height: 120, resize: "none" }}
                                placeholder="Đánh giá"
                            />
                        </Form.Item>
                        <Form.Item name="rating">
                            <Rate />
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
                    dataSource={comments}
                    pagination={{
                        total: total,
                        size: "small",
                        onChange(page) {
                            setQuery((prev) => ({
                                ...prev,
                                pagination: { ...prev?.pagination, page: page - 1 },
                            }));
                        },
                    }}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={item.user.avatar} />}
                                title={
                                    <CommentStyled>
                                        <div>{item.user.name}</div>
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
                                        style={{ fontSize: "14px" }}
                                        disabled
                                        defaultValue={item.rating}
                                    />
                                }
                            />
                            {item.content}
                        </List.Item>
                    )}
                />
            </BoxInformationStyled>
        </div>
    );
}
