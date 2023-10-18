import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AccountLayout from "@/layouts/AccountLayout";
import UserLayout from "@/layouts/UserLayout";
import request from "@/services/request";
import { IProduct } from "@/interfaces";
import { API_ENDPOINT } from "@/constants/apis";
import { FormCustom } from "@/components/templates";
import {
    getInputNameProduct,
    getInputImagesProduct,
    getInputDescProduct,
    getInputPriceProduct,
    getInputLengthProduct,
    getInputHeightProduct,
    getInputWidthProduct,
    getInputWeightProduct,
    getInputBetterCapacityProduct,
    getInputScreenProduct,
    getInputRamProduct,
    getInputRomProduct,
    getInputGpuProduct,
    getInputCpuProduct,
    getInputOsProduct,
    getInputCategoryProduct,
    getInputBrandProduct,
    getInputNewnessProduct,
    PendingStyled,
    getInputStatusProduct,
} from "@/components/atoms";
import { Descriptions, Form, message } from "antd";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";
import { isEmpty } from "lodash";
import dayjs from "dayjs";
import { DiscountComponent } from "@/components/organisms";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";

export default function DetailProduct() {
    const router = useRouter();
    const id = router.query.id;
    const user = useRecoilValue(UserAtom);
    const [form] = Form.useForm();
    const [data, setData] = useState<IProduct>();
    const [loading, setLoading] = useState<boolean>(false);

    const getProduct = async (topic?: any, id?: string) => {
        try {
            const res = await request<any>("get", `${API_ENDPOINT.PRODUCT.GET}/${id}`);
            const images = res.data.item.images.map((item: string, index: number) => ({
                uid: -index,
                url: item,
            }));
            setData({ ...res.data.item, images });
        } catch (error) {}
    };

    const updateProduct = async (value: any) => {
        setLoading(true);
        try {
            const form = new FormData();
            for (const key in value) {
                if (key === "images") {
                    for (const index of value[key]) {
                        if (index.originFileObj) {
                            form.append(key, index.originFileObj);
                            continue;
                        }
                        form.append(key, index.url);
                    }
                    continue;
                }
                if (typeof value[key] === "string") {
                    form.append(key, value[key]);
                    continue;
                }
                if (!isEmpty(value[key])) {
                    form.append(key, value[key]._id);
                    continue;
                }
                form.append(key, value[key]);
            }
            form.append("owner", user._id);
            form.append("id", id as string);

            const res = await request<any>("put", API_ENDPOINT.PRODUCT.GET, form);
            getProduct("", id as string);
            message.success(res.data.message, 1);
        } catch (error: any) {
            message.error(error.response.data.message, 1);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (id) getProduct("", id as string);
        PubSub.subscribe(PUBSUB_SUBSCRIBE_NAME.GET_DETAIL_PRODUCT, getProduct);
        return () => {
            PubSub.unsubscribe(PUBSUB_SUBSCRIBE_NAME.GET_DETAIL_PRODUCT);
        };
    }, [id]);

    useEffect(() => {
        form.setFieldsValue(data);
    }, [data]);

    return (
        <div>
            <PendingStyled $approve={data?.approve}>
                {data?.approve ? (
                    <h3>Sản phẩm đã được duyệt</h3>
                ) : (
                    <h3>Sản phẩm đang chờ duyệt, nên bạn không thể cập nhật sản phẩm.</h3>
                )}
            </PendingStyled>
            <FormCustom
                form={{
                    layout: "vertical",
                    initialValues: data,
                    form: form,
                    disabled: !data?.approve,
                    onFinish: updateProduct,
                }}
                fields={[
                    getInputStatusProduct(),
                    getInputNameProduct(),
                    getInputImagesProduct(),
                    getInputNewnessProduct(),
                    getInputDescProduct(),
                    getInputPriceProduct(),
                    getInputLengthProduct(),
                    getInputHeightProduct(),
                    getInputWidthProduct(),
                    getInputWeightProduct(),
                    getInputBetterCapacityProduct(),
                    getInputScreenProduct(),
                    getInputRamProduct(),
                    getInputRomProduct(),
                    getInputGpuProduct(),
                    getInputCpuProduct(),
                    getInputOsProduct(),
                    getInputCategoryProduct(),
                    getInputBrandProduct(),
                ]}
                bottom={{
                    buttons: [
                        {
                            children: "Cập nhật",
                            htmlType: "submit",
                            type: "primary",
                            style: { marginRight: "10px" },
                            loading: loading,
                        },
                        {
                            children: "Hủy",
                            onClick: () => {
                                form.resetFields();
                            },
                        },
                    ],
                }}
            />
            <div>
                {!data?.discount && (
                    <DiscountComponent
                        key="1"
                        title="Thêm mã giảm giá cho sản phẩm"
                        button="Thêm mã giảm giá"
                        method="post"
                        productId={data?._id as string}
                        pubsub={PUBSUB_SUBSCRIBE_NAME.GET_DETAIL_PRODUCT}
                    />
                )}
                {data?.discount && (
                    <Descriptions
                        title="Thông tin khuyến mại"
                        items={[
                            {
                                key: "1",
                                label: "Mã giảm giá",
                                children: data?.discount?.code,
                                span: 3,
                            },
                            {
                                key: "2",
                                label: "Số lượng còn lại",
                                children: data?.discount?.amount,
                                span: 3,
                            },
                            {
                                key: "3",
                                label: "Phần trăm khuyến mãi",
                                children: `${data?.discount?.percent} %`,
                                span: 3,
                            },
                            {
                                key: "4",
                                label: "Ngày có hiệu lực",
                                children: dayjs(data?.discount?.start).format(
                                    "hh:mm - DD/MM/YYYY"
                                ),
                                span: 3,
                            },
                            {
                                key: "5",
                                label: "Ngày hết hiệu lực",
                                children: dayjs(data?.discount?.end).format(
                                    "hh:mm - DD/MM/YYYY"
                                ),
                                span: 3,
                            },
                            {
                                key: "6",
                                label: "Trạng thái",
                                children: data.status ? "Có hiệu lực" : "Hết hiệu lực",
                            },
                        ]}
                    />
                )}
                {data?.discount && (
                    <DiscountComponent
                        key="2"
                        title="Cập nhật thông tin mã giảm giá"
                        button="Cập nhật"
                        method="put"
                        defaultValue={{
                            ...data.discount,
                            "range-picker": [
                                dayjs(data.discount.start),
                                dayjs(data.discount.end),
                            ],
                        }}
                        discountId={data.discount._id}
                        productId={data._id as string}
                        pubsub={PUBSUB_SUBSCRIBE_NAME.GET_DETAIL_PRODUCT}
                    />
                )}
            </div>
        </div>
    );
}

DetailProduct.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout title="Chi tiết sản phẩm">{page}</AccountLayout>
        </UserLayout>
    );
};
