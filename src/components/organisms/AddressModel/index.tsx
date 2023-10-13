import React from "react";
import { ButtonFormModel } from "@/components/molecules";
import { PlusOutlined } from "@ant-design/icons";
import { getInputAddress, getInputStreet } from "@/components/atoms";
import { API_ENDPOINT } from "@/constants/apis";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";
import { handleDataWithAddress } from "@/utils/handle-data";

export default function AddressModal() {
    return (
        <ButtonFormModel
            title="Thêm địa chỉ mới"
            button={{
                children: "Thêm địa chỉ mới",
                icon: <PlusOutlined />,
            }}
            fields={[getInputAddress(), getInputStreet()]}
            req={{
                method: "post",
                api: API_ENDPOINT.PROFILE.CREATE_ADDRESS,
            }}
            keyPubsub={PUBSUB_SUBSCRIBE_NAME.GET_INFO}
            funcHandleData={handleDataWithAddress}
        />
    );
}
