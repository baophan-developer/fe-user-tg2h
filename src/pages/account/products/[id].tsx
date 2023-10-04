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
} from "@/components/atoms";
import { Form } from "antd";

export default function DetailProduct() {
    const router = useRouter();
    const id = router.query.id;
    const [form] = Form.useForm();
    const [data, setData] = useState<IProduct | any>({});

    const getProduct = async (id: string) => {
        try {
            const res = await request<any>("get", `${API_ENDPOINT.PRODUCT.GET}/${id}`);
            const images = res.data.item.images.map((item: string, index: number) => ({
                uid: -index,
                url: item,
            }));
            setData({ ...res.data.item, images });
        } catch (error) {}
    };

    useEffect(() => {
        if (id) getProduct(id as string);
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
                }}
                fields={[
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
