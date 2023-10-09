import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IProduct } from "@/interfaces";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import { Button, Carousel, Descriptions, Image, Rate } from "antd";
import styled from "styled-components";

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
    }
`;

const ButtonStyled = styled(Button)`
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 100px;
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

export default function DetailProduct() {
    const router = useRouter();
    const id = router.query.id;
    const carouselRef: any = React.createRef();
    const [product, setProduct] = useState<IProduct>();

    const getProduct = async (id: string) => {
        try {
            const res = await request<any>("get", `${API_ENDPOINT.PRODUCT.GET}/${id}`);
            setProduct(res.data.item);
        } catch (error) {}
    };

    useEffect(() => {
        id && getProduct(id as string);
    }, [id]);

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
                        <Rate value={5} disabled style={{ fontSize: "16px" }} />
                        <div>Lượt đánh giá 1.787</div>
                        <div>Lượt mua 1.888</div>
                    </EvaluateStyled>
                    <h2>{product?.price.toLocaleString("vi")} vnđ</h2>
                    <h3>Độ mới {product?.newness} %</h3>
                    <ButtonStyled icon={<AiOutlineShoppingCart />} type="primary">
                        Thêm vào giỏ hàng
                    </ButtonStyled>
                </BriefingInfoStyled>
            </ProductBriefingStyled>
            <BoxInformationStyled>
                <h3>Thông tin chi tiết sản phẩm</h3>
                <Descriptions
                    bordered
                    items={[
                        {
                            key: "1",
                            label: "Thương hiệu",
                            children: product?.brand.name,
                        },
                        {
                            key: "2",
                            label: "Loại sản phẩm",
                            children: product?.category.name,
                        },
                        {
                            key: "3",
                            label: "Hệ điều hành",
                            children: product?.os.name,
                        },
                        {
                            key: "4",
                            label: "Chip xử lý",
                            children: product?.cpu.name,
                        },
                        {
                            key: "5",
                            label: "Chip xử lý đồ họa",
                            children: product?.gpu.name,
                        },
                        {
                            key: "6",
                            label: "Công nghệ Ram",
                            children: product?.typeRam.name,
                        },
                        {
                            key: "7",
                            label: "Dung lượng Ram",
                            children: product?.capacityRam.capacity,
                        },
                        {
                            key: "8",
                            label: "Công nghệ ổ nhớ",
                            children: product?.typeRom.name,
                        },
                        {
                            key: "9",
                            label: "Dung lượng ổ nhớ",
                            children: product?.capacityRom.capacity,
                        },
                        {
                            key: "6",
                            label: "Dung lượng pin",
                            children: `${product?.betterCapacity} WH`,
                        },
                        {
                            key: "10",
                            label: "Thông tin màn hình",
                            children: (
                                <div>
                                    Kích thước: {product?.sizeScreen.size} <br />
                                    Độ phân giải: {product?.resolutionScreen.name} <br />
                                    Tần số quét: {product?.scanFrequency.scanFrequency}
                                </div>
                            ),
                        },
                        {
                            key: "10",
                            label: "Thông tin kích thước sản phẩm",
                            children: (
                                <div>
                                    Chiều dài: {product?.length} mm <br />
                                    Chiều rộng: {product?.width} mm <br />
                                    Độ dày: {product?.height} mm <br />
                                    Cân nặng: {product?.weight} kg
                                </div>
                            ),
                        },
                    ]}
                />
                <h3>Mô tả sản phẩm</h3>
                <p>{product?.desc}</p>
            </BoxInformationStyled>
            <BoxInformationStyled>Position for comments</BoxInformationStyled>
        </div>
    );
}
