import {
    Form,
    Input,
    InputNumber,
    InputNumberProps,
    Radio,
    Select,
    Space,
    Switch,
    Upload,
} from "antd";
import { type InputProps, type FormItemProps } from "antd";
import { TextAreaProps } from "antd/es/input";
import styled from "styled-components";
import SelectApi from "../SelectApi";
import { API_ENDPOINT } from "@/constants/apis";

export const getInputNameProduct = (inputProps?: InputProps): FormItemProps => {
    return {
        name: "name",
        label: "Tên sản phẩm",
        rules: [
            {
                required: true,
                message: "Tên sản phẩm là bắt buộc",
            },
            {
                min: 5,
                message: "Tên sản phẩm không được dưới 5 ký tự.",
            },
            {
                max: 50,
                message: "Tên sản phẩm không được vượt quá 50 ký tự.",
            },
        ],
        children: <Input {...inputProps} placeholder="Nhập tên sản phẩm" />,
    };
};

const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
};

export const getInputImagesProduct = (): FormItemProps => {
    return {
        name: "images",
        label: "Hình ảnh sản phẩm",
        rules: [
            { required: true, message: "Hình ảnh sản phẩm là bắt buộc." },
            {
                validator(_, value) {
                    if (value && value.length > 5)
                        return Promise.reject("Chỉ được phép tối đa 5 hình ảnh.");
                    return Promise.resolve();
                },
            },
        ],
        valuePropName: "fileList",
        getValueFromEvent: normFile,
        children: <Upload listType="picture-card">+</Upload>,
    };
};

export const getInputDescProduct = (textAreaProps?: TextAreaProps): FormItemProps => {
    return {
        name: "desc",
        label: "Mô tả chi tiết sản phẩm",
        rules: [
            // { min: 0, message: "Mô tả chi tiết sản phẩm ít nhất 1000 ký tự." },
            {
                max: 999999999,
                message: "Mô tả chi tiết nhận vào tối đa 999999999 ký tự.",
            },
        ],
        children: (
            <Input.TextArea
                {...textAreaProps}
                placeholder="Nhập mô tả chi tiết sản phẩm"
                spellCheck="false"
            />
        ),
    };
};

export const SuffixStyled = styled.div`
    color: grey;
    padding-left: 7px;
    border-left: 1px solid #eee;
`;

export const getInputPriceProduct = (
    inputNumberProps?: InputNumberProps
): FormItemProps => {
    return {
        name: "price",
        label: "Nhập giá thành sản phẩm",
        rules: [
            { required: true, message: "Giá thành sản phẩm là bắt buộc." },
            {
                validator(_, value) {
                    if (value < 1000)
                        return Promise.reject("Giá thành sản phẩm ít nhất phải 1000vnd");
                    if (value > 999999999)
                        return Promise.reject(
                            "Giá thành sản phẩm không được vượt quá 1 tỷ vnd"
                        );

                    return Promise.resolve();
                },
            },
        ],
        children: (
            <InputNumber
                {...inputNumberProps}
                type="number"
                controls={false}
                style={{ width: "100%" }}
                placeholder="Nhập giá thành sản phẩm"
                suffix={<SuffixStyled>vnd</SuffixStyled>}
            />
        ),
    };
};

export const getInputLengthProduct = (
    inputNumberProps?: InputNumberProps
): FormItemProps => {
    return {
        name: "length",
        label: "Nhập chiều dài sản phẩm",
        rules: [
            { required: true, message: "Chiều dài sản phẩm là bắt buộc." },
            {
                validator(_, value) {
                    if (value > 1000)
                        return Promise.reject(
                            "Chiều dài sản phẩm không được vượt quá 1000mm"
                        );
                    return Promise.resolve();
                },
            },
        ],
        children: (
            <InputNumber
                {...inputNumberProps}
                type="number"
                controls={false}
                style={{ width: "100%" }}
                placeholder="Nhập chiều dài sản phẩm"
                suffix={<SuffixStyled>mm</SuffixStyled>}
            />
        ),
    };
};

export const getInputHeightProduct = (
    inputNumberProps?: InputNumberProps
): FormItemProps => {
    return {
        name: "height",
        label: "Nhập độ dày sản phẩm",
        rules: [
            { required: true, message: "Độ dày sản phẩm là bắt buộc." },
            {
                validator(_, value) {
                    if (value > 1000)
                        return Promise.reject(
                            "Độ dày sản phẩm không được vượt quá 1000mm"
                        );
                    return Promise.resolve();
                },
            },
        ],
        children: (
            <InputNumber
                {...inputNumberProps}
                type="number"
                controls={false}
                style={{ width: "100%" }}
                placeholder="Nhập độ dày sản phẩm"
                suffix={<SuffixStyled>mm</SuffixStyled>}
            />
        ),
    };
};

export const getInputWidthProduct = (
    inputNumberProps?: InputNumberProps
): FormItemProps => {
    return {
        name: "width",
        label: "Nhập độ rộng sản phẩm",
        rules: [
            { required: true, message: "Độ rộng sản phẩm là bắt buộc." },
            {
                validator(_, value) {
                    if (value > 1000)
                        return Promise.reject(
                            "Độ rộng sản phẩm không được vượt quá 1000mm"
                        );
                    return Promise.resolve();
                },
            },
        ],
        children: (
            <InputNumber
                {...inputNumberProps}
                type="number"
                controls={false}
                style={{ width: "100%" }}
                placeholder="Nhập độ rộng sản phẩm"
                suffix={<SuffixStyled>mm</SuffixStyled>}
            />
        ),
    };
};

export const getInputWeightProduct = (
    inputNumberProps?: InputNumberProps
): FormItemProps => {
    return {
        name: "weight",
        label: "Nhập cân nặng sản phẩm",
        rules: [
            { required: true, message: "Cân nặng sản phẩm là bắt buộc." },
            {
                validator(_, value) {
                    if (value > 10)
                        return Promise.reject(
                            "Cân nặng sản phẩm không được vượt quá 10kg"
                        );
                    return Promise.resolve();
                },
            },
        ],
        children: (
            <InputNumber
                {...inputNumberProps}
                type="number"
                controls={false}
                style={{ width: "100%" }}
                placeholder="Nhập cân nặng sản phẩm"
                suffix={<SuffixStyled>kg</SuffixStyled>}
            />
        ),
    };
};

export const getInputBetterCapacityProduct = (
    inputNumberProps?: InputNumberProps
): FormItemProps => {
    return {
        name: "betterCapacity",
        label: "Nhập dung lượng pin sản phẩm",
        rules: [
            { required: true, message: "Dung lượng pin sản phẩm là bắt buộc." },
            {
                validator(_, value) {
                    if (value > 1000)
                        return Promise.reject(
                            "Dung lượng pin sản phẩm không được vượt quá 1000wh"
                        );
                    return Promise.resolve();
                },
            },
        ],
        children: (
            <InputNumber
                {...inputNumberProps}
                type="number"
                controls={false}
                style={{ width: "100%" }}
                placeholder="Nhập dung lượng pin sản phẩm"
                suffix={<SuffixStyled>wh</SuffixStyled>}
            />
        ),
    };
};

const RadioCustomStyled = styled(Radio.Group)`
    width: 100%;

    & .ant-radio-wrapper {
        width: 100%;
        margin-bottom: 10px;
        border: 2px solid #dad5d5;
        border-radius: 4px;
        padding: 10px;
    }

    & .ant-radio-wrapper-checked {
        border: 2px solid #1677ff;
        background-color: #1677ff;
        color: white;
        font-weight: 550;
    }

    & .ant-radio {
        position: absolute;
        left: -9999px;
        overflow: hidden;
    }
`;

export const getInputNewnessProduct = (): FormItemProps => {
    return {
        name: "newness",
        label: "Tình trạng sản phẩm",
        rules: [{ required: true, message: "Tình trạng sản phẩm là bắt buộc." }],
        children: (
            <RadioCustomStyled>
                <Radio value={100}>Hoàn toàn mới 100% (New) </Radio>
                <Radio value={90}>Mới 90% - 99% (Like new/New in box)</Radio>
                <Radio value={80}>Rất tốt 80% - 89% (Excellent/Like new)</Radio>
                <Radio value={70}>Tốt 70% - 79% (Good/Very good)</Radio>
                <Radio value={60}>Khá 60% - 69% (Fair / Acceptable)</Radio>
                <Radio value={50}>
                    Đã Sử Dụng 50% - 59% (Poor / For Parts or Not Working)
                </Radio>
            </RadioCustomStyled>
        ),
    };
};

export const getInputQuantityProduct = (): FormItemProps => {
    return {
        name: "quantity",
        label: "Số lượng trong kho",
        rules: [{ required: true, message: "Số lượng sản phẩm trong kho là bắt buộc." }],
        children: (
            <InputNumber
                min={0}
                type="number"
                controls={false}
                placeholder="Nhập số lượng sản phẩm trong kho"
                style={{ width: "100%" }}
            />
        ),
    };
};

export const getInputScreenProduct = (): FormItemProps => {
    return {
        label: "Thông tin màn hình",
        children: (
            <Space style={{ width: "100%" }} styles={{ item: { width: "33%" } }}>
                <Form.Item
                    name="sizeScreen"
                    label="Kích cỡ màn hình"
                    rules={[{ required: true, message: "Kích cỡ màn hình là bắt buộc" }]}
                >
                    <SelectApi api={API_ENDPOINT.SIZE_SCREEN} attItem="size" />
                </Form.Item>
                <Form.Item
                    name="scanFrequency"
                    label="Tần số quét màn hình"
                    rules={[
                        { required: true, message: "Tần số quét màn hình là bắt buộc" },
                    ]}
                >
                    <SelectApi
                        api={API_ENDPOINT.SCAN_FREQUENCY_SCREEN}
                        attItem="scanFrequency"
                    />
                </Form.Item>
                <Form.Item
                    name="resolutionScreen"
                    label="Độ phân giải màn hình"
                    rules={[
                        { required: true, message: "Độ phân giải màn hình là bắt buộc" },
                    ]}
                >
                    <SelectApi api={API_ENDPOINT.RESOLUTION_SCREEN} attItem="name" />
                </Form.Item>
            </Space>
        ),
    };
};

export const getInputRamProduct = (): FormItemProps => {
    return {
        label: "Thông tin RAM",
        children: (
            <Space style={{ width: "100%" }} styles={{ item: { width: "50%" } }}>
                <Form.Item
                    name="typeRam"
                    label="Loại ram"
                    rules={[{ required: true, message: "Loại Ram là bắt buộc." }]}
                >
                    <SelectApi api={API_ENDPOINT.TYPE_RAM} attItem="name" />
                </Form.Item>
                <Form.Item
                    name="capacityRam"
                    label="Dung lượng ram"
                    rules={[{ required: true, message: "Dung lượng Ram là bắt buộc." }]}
                >
                    <SelectApi api={API_ENDPOINT.CAPACITY_RAM} attItem="capacity" />
                </Form.Item>
            </Space>
        ),
    };
};

export const getInputRomProduct = (): FormItemProps => {
    return {
        label: "Thông tin ROM",
        children: (
            <Space style={{ width: "100%" }} styles={{ item: { width: "50%" } }}>
                <Form.Item
                    name="typeRom"
                    label="Loại rom"
                    rules={[{ required: true, message: "Loại Rom là bắt buộc." }]}
                >
                    <SelectApi api={API_ENDPOINT.TYPE_ROM} attItem="name" />
                </Form.Item>
                <Form.Item
                    name="capacityRom"
                    label="Dung lượng rom"
                    rules={[{ required: true, message: "Dung lượng Rao là bắt buộc." }]}
                >
                    <SelectApi api={API_ENDPOINT.CAPACITY_ROM} attItem="capacity" />
                </Form.Item>
            </Space>
        ),
    };
};

export const getInputGpuProduct = (): FormItemProps => {
    return {
        name: "gpu",
        label: "Card đồ hoạ.",
        rules: [{ required: true, message: "Card đồ họa là bắt buộc." }],
        children: <SelectApi api={API_ENDPOINT.GPU} attItem="name" />,
    };
};

export const getInputCpuProduct = (): FormItemProps => {
    return {
        name: "cpu",
        label: "Chip xử lý",
        rules: [{ required: true, message: "Chip xử lý là bắt buộc." }],
        children: <SelectApi api={API_ENDPOINT.CPU} attItem="name" />,
    };
};

export const getInputOsProduct = (): FormItemProps => {
    return {
        name: "os",
        label: "Hệ điều hành",
        rules: [{ required: true, message: "Hệ điều hành là bắt buộc." }],
        children: <SelectApi api={API_ENDPOINT.OS} attItem="name" />,
    };
};

export const getInputCategoryProduct = (): FormItemProps => {
    return {
        name: "category",
        label: "Loại máy tính",
        rules: [{ required: true, message: "Loại máy tính là bắt buộc." }],
        children: <SelectApi api={API_ENDPOINT.CATEGORY} attItem="name" />,
    };
};

export const getInputBrandProduct = (): FormItemProps => {
    return {
        name: "brand",
        label: "Thương hiệu",
        rules: [{ required: true, message: "Thương hiệu là bắt buộc." }],
        children: <SelectApi api={API_ENDPOINT.BRAND} attItem="name" />,
    };
};

export const getInputStatusProduct = (): FormItemProps => {
    return {
        name: "status",
        label: "Trạng thái rao bán",
        valuePropName: "checked",
        children: (
            <Switch checkedChildren={"Đang rao bán"} unCheckedChildren={"Ngừng bán"} />
        ),
    };
};
