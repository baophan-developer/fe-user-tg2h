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
