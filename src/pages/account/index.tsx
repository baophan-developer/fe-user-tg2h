import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import dayjs from "dayjs";
import styled from "styled-components";
import { Form, UploadFile, message, Upload, Image, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";
import { FormCustom } from "@/components/templates";
import {
    getInputChooseDay,
    getInputEmail,
    getInputGender,
    getInputName,
    getInputPhoneNumber,
} from "@/components/atoms";
import request from "@/services/request";
import PUBSUB_SUBSCRIBE_NAME from "@/constants/pubsub";
import { API_ENDPOINT } from "@/constants/apis";
import { ACCEPT_IMAGE_SIZE, IMAGE_TYPE } from "@/constants/image";
import useChangeSizeWindow from "@/hooks/useChangeSizeWindow";

const ContentStyled = styled.div`
    width: 100%;
    display: flex;
    padding: 20px;

    @media only screen and (max-width: 500px) {
        flex-direction: column-reverse;
        align-items: center;
    }
`;

const BoxAvatarStyled = styled.div`
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px 0;
`;

const UploadButtonStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

export default function Account() {
    const user = useRecoilValue(UserAtom);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [file, setFile] = useState<UploadFile | Blob>();
    const [imgUrl, setImgUrl] = useState<string>();
    const size = useChangeSizeWindow();

    const handleUploadAvatar = async () => {
        setLoading(true);
        try {
            if (file) {
                const form = new FormData();
                form.append("avatar", file as Blob);
                const res = await request<any>(
                    "put",
                    API_ENDPOINT.PROFILE.UPDATE_AVATAR,
                    form
                );
                message.success(res.data.message, 1);
                PubSub.publishSync(PUBSUB_SUBSCRIBE_NAME.GET_INFO);
            } else {
                message.info("Bạn chưa chọn ảnh đại diện mới.");
            }
        } catch (error: any) {
            message.error(error.response.data.message, 1);
        }
        setLoading(false);
    };

    const handleOnChangeUpload = (info: UploadChangeParam<UploadFile>) => {
        const file = info.fileList[0];
        let checkSize = false;
        let checkType = false;

        if (file.size && file.type) {
            checkSize = file.size < ACCEPT_IMAGE_SIZE;
            checkType = [IMAGE_TYPE.JPEG, IMAGE_TYPE.PNG].includes(file.type);
        }

        if (!checkSize) {
            message.error(
                `Hình ảnh chỉ được phép dưới ${ACCEPT_IMAGE_SIZE / (1024 * 2)}MB`
            );
            info.fileList.pop();
            return;
        }

        if (!checkType) {
            message.error(
                `Chỉ chấp nhận các tệp ảnh có định dạng là ${IMAGE_TYPE.JPEG} và ${IMAGE_TYPE.PNG}`
            );
            info.fileList.pop();
            return;
        }

        if (file.originFileObj) {
            getBase64(file.originFileObj as RcFile, (url) => {
                setImgUrl(url);
            });
        }
        setFile(file.originFileObj);
        info.fileList.pop();
    };

    const updateInfo = async (value: any) => {
        setLoading(true);
        try {
            const res = await request("put", API_ENDPOINT.PROFILE.UPDATE_PROFILE, {
                ...value,
                birthday: dayjs(value.birthday).format("YYYY-MM-DD"),
            });
            message.success(res.data.message);
            PubSub.publishSync(PUBSUB_SUBSCRIBE_NAME.GET_INFO);
        } catch (error: any) {
            message.error(error.response.data.message, 1);
        }
        setLoading(false);
    };

    const handleResetForm = () => {
        form.setFieldsValue({ ...user, birthday: dayjs(user.birthday) });
    };

    useEffect(() => {
        form.setFieldsValue({ ...user, birthday: dayjs(user.birthday) });
        setImgUrl(user.avatar);
    }, [user]);

    return (
        <ContentStyled>
            <FormCustom
                form={{
                    form: form,
                    onFinish: updateInfo,
                    labelCol: { span: size.width < 900 ? 20 : 5 },
                    wrapperCol: { span: size.width < 900 ? 20 : 16 },
                    style: { width: "100%" },
                    layout: size.width < 900 ? "vertical" : "horizontal",
                }}
                fields={[
                    getInputEmail({ disabled: true }),
                    getInputName(),
                    getInputPhoneNumber(),
                    getInputChooseDay(),
                    getInputGender(),
                ]}
                bottom={{
                    item: { wrapperCol: { offset: size.width < 500 ? 0 : 5 } },
                    buttons: [
                        {
                            htmlType: "submit",
                            children: "Cập nhật",
                            type: "primary",
                            loading: loading,
                        },
                        {
                            type: "default",
                            children: "Hủy",
                            style: { marginLeft: "5px" },
                            onClick: handleResetForm,
                        },
                    ],
                }}
            />
            <BoxAvatarStyled>
                <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleOnChangeUpload}
                    accept="image/*"
                >
                    <UploadButtonStyled>
                        <Image
                            src={imgUrl}
                            alt={user.name}
                            width={200}
                            height={200}
                            preview={false}
                            style={{ cursor: "pointer", objectFit: "cover" }}
                        />
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </UploadButtonStyled>
                </Upload>
                <Button loading={loading} type="primary" onClick={handleUploadAvatar}>
                    Lưu
                </Button>
            </BoxAvatarStyled>
        </ContentStyled>
    );
}

Account.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout title="Quản lý thông tin cá nhân của bạn">
                {page}
            </AccountLayout>
        </UserLayout>
    );
};
