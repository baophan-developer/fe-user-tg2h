import {
    Input,
    type FormItemProps,
    type InputProps,
    Form,
    Checkbox,
    CheckboxProps,
} from "antd";

export const getInputEmail = (inputProps?: InputProps): FormItemProps => {
    return {
        name: "email",
        label: "Email",
        children: <Input {...inputProps} placeholder="Nhập địa chỉ email" />,
    };
};

export const getInputPassword = (inputProps?: InputProps): FormItemProps => {
    return {
        name: "password",
        label: "Mật khẩu",
        children: <Input.Password {...inputProps} placeholder="Nhập mật khẩu" />,
    };
};

export const getInputRememberMe = (checkboxProps?: CheckboxProps): FormItemProps => {
    return {
        name: "remember",
        valuePropName: "checked",
        children: <Checkbox {...checkboxProps}>Nhớ tôi</Checkbox>,
    };
};
