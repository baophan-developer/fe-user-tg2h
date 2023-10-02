import React, { useEffect, useState } from "react";
import { Select, SelectProps } from "antd";
import request from "@/services/request";

interface IOptions {
    value: string | number | undefined;
    label: string | number | undefined;
}

type TProps = {
    value?: any;
    onChange?: (value: any) => void;
    api: string;
    selectProps?: SelectProps;
    attItem: string;
};

export default function SelectApi({
    value,
    onChange,
    api,
    selectProps,
    attItem,
}: TProps) {
    const [options, setOptions] = useState<IOptions[]>([]);

    const getData = async () => {
        try {
            const res = await request<any>("get", api);
            const options = res.data.list.map((item: any) => ({
                value: item._id,
                label: item[attItem],
            }));
            setOptions(options);
        } catch (error) {}
    };

    const trigger = (value: any) => {
        onChange?.(value);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Select {...selectProps} options={options} onChange={(value) => trigger(value)} />
    );
}
