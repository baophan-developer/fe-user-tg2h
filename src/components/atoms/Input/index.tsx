import { emailRegex, phoneRegex } from "@/regex";
import {
    Input,
    type FormItemProps,
    type InputProps,
    Checkbox,
    CheckboxProps,
    Switch,
    DatePicker,
    DatePickerProps,
} from "antd";
import InputAddress from "../InputAddress";

export const getInputEmail = (inputProps?: InputProps): FormItemProps => {
    return {
        name: "email",
        label: "Email",
        rules: [
            { required: true, message: "Email là bắt buộc." },
            { pattern: emailRegex, message: "Không đúng định dạng email." },
        ],
        children: <Input {...inputProps} placeholder="Nhập địa chỉ email" />,
    };
};

export const getInputName = (inputProps?: InputProps): FormItemProps => {
    return {
        name: "name",
        label: "Họ và tên",
        rules: [
            { required: true, message: "Chưa nhập họ và tên" },
            { min: 12, message: "Họ và tên không ít hơn 12 ký tự." },
            { max: 56, message: "Họ và tên không lớn hơn 56 ký tự." },
        ],
        children: <Input {...inputProps} placeholder="Nhập họ và tên" />,
    };
};

export const getInputPassword = (inputProps?: InputProps): FormItemProps => {
    return {
        name: "password",
        label: "Mật khẩu",
        rules: [
            { required: true, message: "Mật khẩu là bắt buộc." },
            { min: 6, message: "Mật khẩu không ít hơn 6 ký tự" },
            { max: 12, message: "Mật khẩu không lớn hơn 6 ký tự." },
        ],
        children: (
            <Input.Password {...inputProps} allowClear placeholder="Nhập mật khẩu" />
        ),
    };
};

export const getInputConfirmPassword = (inputProps?: InputProps): FormItemProps => {
    return {
        name: "confirm",
        label: "Xác nhận mật khẩu",
        dependencies: ["password"],
        rules: [
            { required: true, message: "Hãy xác nhận mật khẩu." },
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue("password") === value)
                        return Promise.resolve();
                    return Promise.reject(new Error("Mật khẩu không trùng khớp."));
                },
            }),
        ],
        children: (
            <Input.Password allowClear {...inputProps} placeholder="Xác nhận mật khẩu" />
        ),
    };
};

export const getInputRememberMe = (checkboxProps?: CheckboxProps): FormItemProps => {
    return {
        name: "remember",
        valuePropName: "checked",
        children: <Checkbox {...checkboxProps}>Nhớ tôi</Checkbox>,
    };
};

export const getInputPhoneNumber = (inputProps?: InputProps): FormItemProps => {
    return {
        name: "phone",
        label: "Số điện thoại",
        rules: [
            { required: true, message: "Bạn phải nhập số điện thoại." },
            { pattern: phoneRegex, message: "Chưa đúng định dạng số điện thoại." },
        ],
        children: <Input {...inputProps} placeholder="Nhập số điện thoại." />,
    };
};

export const getInputGender = (): FormItemProps => {
    return {
        name: "gender",
        label: "Giới tính",
        valuePropName: "checked",
        children: <Switch checkedChildren="Nam" unCheckedChildren="Nữ" />,
    };
};

export const getInputChooseDay = (dateProps?: DatePickerProps): FormItemProps => {
    return {
        name: "birthday",
        label: "Ngày sinh",
        children: <DatePicker {...dateProps} />,
    };
};

export const getInputAddress = (): FormItemProps => {
    return {
        name: "address",
        label: "Chọn địa chỉ",
        rules: [
            { required: true, message: "Chưa chọn thông tin địa chỉ." },
            {
                validator(_, value) {
                    if (!value.districtId)
                        return Promise.reject(new Error("Chưa chọn quận/huyện."));

                    if (!value.wardId)
                        return Promise.reject(new Error("Chưa chọn phường/xã."));

                    return Promise.resolve();
                },
            },
        ],
        children: <InputAddress />,
    };
};

export const getInputStreet = (inputProps?: InputProps): FormItemProps => {
    return {
        name: "street",
        label: "Nhập địa chỉ chi tiết",
        children: <Input {...inputProps} placeholder="Nhập địa chỉ chi tiết." />,
    };
};
