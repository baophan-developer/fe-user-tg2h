import {
    getInputAmountDiscount,
    getInputCodeDiscount,
    getInputPercentDiscount,
    getInputRangeDateDiscount,
} from "@/components/atoms";
import { ButtonFormModel } from "@/components/molecules";
import { API_ENDPOINT } from "@/constants/apis";
import { TRequest } from "@/services/request";
import dayjs from "dayjs";

type TProps = {
    title: string;
    button: string;
    method: TRequest;
    defaultValue?: any;
    discountId?: string;
    productId: string;
    pubsub: string;
};

export default function DiscountComponent({
    title,
    button,
    method,
    defaultValue,
    discountId,
    productId,
    pubsub,
}: TProps) {
    const handleDiscountValue = (value: any) => {
        if (!value) return value;

        const newValue = {
            ...value,
            start: dayjs(value["range-picker"][0]).format("YYYY-MM-DD"),
            end: dayjs(value["range-picker"][1]).format("YYYY-MM-DD"),
        };
        delete newValue["range-picker"];
        return {
            ...newValue,
            productId: productId,
        };
    };

    return (
        <ButtonFormModel
            title={title}
            button={{
                type: "primary",
                children: button,
            }}
            funcHandleData={handleDiscountValue}
            req={{ method: method, api: API_ENDPOINT.DISCOUNT.MAIN }}
            fields={[
                getInputCodeDiscount(),
                getInputAmountDiscount(),
                getInputPercentDiscount(),
                getInputRangeDateDiscount(),
            ]}
            data={{ id: discountId, initialValueForm: defaultValue }}
            keyPubsub={pubsub}
            dataPubsub={productId}
        />
    );
}
