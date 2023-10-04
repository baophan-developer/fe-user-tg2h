import React from "react";
import Link from "next/link";
import { Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { handleDataProduct } from "@/utils/handle-data";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";
import { IProduct } from "@/interfaces";
import { ManagementView } from "@/components/templates";
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
import { API_ENDPOINT } from "@/constants/apis";
import ROUTERS from "@/constants/routers";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";

const columns: ColumnsType<IProduct> = [
    {
        title: "STT",
        dataIndex: "key",
    },
    {
        title: "Tên sản phẩm",
        render: (_, record) => {
            return (
                <Link
                    style={{ color: "black" }}
                    href={`${ROUTERS.ACCOUNT.PRODUCT}/${record._id}`}
                >
                    {record.name}
                </Link>
            );
        },
    },
    {
        title: "Hình ảnh sản phẩm",
        render: (_, record) => {
            return (
                <>
                    {record.images.map((item, index) => (
                        <Image width={50} key={index} src={item} />
                    ))}
                </>
            );
        },
    },
    {
        title: "Giá thành",
        render: (_, record) => (
            <>
                {record.price.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                })}
            </>
        ),
    },
    {
        title: "Trạng thái",
        render: (_, record) => (
            <PendingStyled $approve={record.approve}>
                {record.approve ? "Đã duyệt" : "Đang chờ duyệt"}
            </PendingStyled>
        ),
    },
];

export default function Product() {
    return (
        <div>
            <ManagementView
                create={{
                    title: "Thêm mới sản phẩm",
                    func: handleDataProduct,
                    request: { method: "post", api: API_ENDPOINT.PRODUCT.CREATE },
                    fields: [
                        getInputNameProduct(),
                        getInputImagesProduct(),
                        getInputDescProduct(),
                        getInputNewnessProduct(),
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
                    ],
                    usingFormData: true,
                }}
                get={{
                    request: {
                        method: "post",
                        api: API_ENDPOINT.PRODUCT.GET,
                        filter: {},
                    },
                }}
                pubsub={PUBSUB_SUBSCRIBE_NAME.GET_PRODUCTS}
                columns={columns}
            />
        </div>
    );
}

Product.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout title="Danh sách sản phẩm của bạn">{page}</AccountLayout>
        </UserLayout>
    );
};
