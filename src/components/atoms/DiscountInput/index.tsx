import {
    DatePicker,
    FormItemProps,
    Input,
    InputNumberProps,
    InputNumber,
    InputProps,
} from "antd";
import { SuffixStyled } from "../ProductsInput";
import { RangePickerProps } from "antd/es/date-picker";

export const getInputCodeDiscount = (inputProps?: InputProps): FormItemProps => {
    return {
        name: "code",
        label: "Mã giảm giá",
        rules: [
            { required: true, message: "Mã giảm giá là bắt buộc" },
            { min: 4, message: "Tối thiểu phải từ 4 ký tự." },
            { max: 6, message: "Tối đa chỉ được phép 6 ký tự." },
        ],
        children: <Input placeholder="Nhập mã giảm giá." {...inputProps} />,
    };
};

export const getInputAmountDiscount = (
    inputNumberProps?: InputNumberProps
): FormItemProps => {
    return {
        name: "amount",
        label: "Số lượng mã giảm giá",
        rules: [
            { required: true, message: "Số lượng mã giảm giá là bắt buộc" },
            {
                validator(_, value) {
                    if (value > 1000)
                        return Promise.reject(
                            "Số lượng tối thiểu phải chỉ nhận dưới 1000 mã giảm giá."
                        );
                    return Promise.resolve();
                },
            },
        ],
        children: (
            <InputNumber
                {...inputNumberProps}
                style={{ width: "100%" }}
                type="number"
                controls={false}
                placeholder="Số lượng mã giảm giá"
            />
        ),
    };
};

export const getInputPercentDiscount = (
    inputNumberProps?: InputNumberProps
): FormItemProps => {
    return {
        name: "percent",
        label: "Tỉ lệ giảm giá",
        rules: [
            { required: true, message: "Tỉ lệ mã giảm giá là bắt buộc." },
            {
                validator(_, value) {
                    if (value > 50)
                        return Promise.reject("Tỉ lệ giảm giá không được vượt quá 50%.");
                    return Promise.resolve();
                },
            },
        ],
        children: (
            <InputNumber
                {...inputNumberProps}
                style={{ width: "100%" }}
                type="number"
                controls={false}
                placeholder="Nhập tỉ lệ giảm giá"
                suffix={<SuffixStyled>%</SuffixStyled>}
            />
        ),
    };
};

const { RangePicker } = DatePicker;

export const getInputRangeDateDiscount = (
    rangePicker?: RangePickerProps
): FormItemProps => {
    return {
        name: "range-picker",
        label: "Chọn ngày bắt đầu và kết thúc mã giảm giá.",
        rules: [
            { required: true, message: "Ngày bắt đầu và ngày kết thúc là bắt buộc." },
        ],
        children: <RangePicker style={{ width: "100%" }} {...rangePicker} />,
    };
};
