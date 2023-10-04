import React from "react";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import { ButtonFormModel } from "@/components/molecules";
import { API_ENDPOINT } from "@/constants/apis";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";
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
} from "@/components/atoms";
import { handleDataProduct } from "@/utils/handle-data";

const ActionStyled = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export default function Product() {
    return (
        <div>
            <ActionStyled>
                <ButtonFormModel
                    title="Thêm mới sản phẩm"
                    button={{ children: "Thêm mới", icon: <PlusOutlined /> }}
                    req={{ method: "post", api: API_ENDPOINT.PRODUCT.CREATE }}
                    fields={[
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
                    ]}
                    keyPubsub={PUBSUB_SUBSCRIBE_NAME.GET_PRODUCTS}
                    width={"50%"}
                    funcHandleData={handleDataProduct}
                    usingFormData={true}
                />
            </ActionStyled>
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
