import React, { useEffect, useState } from "react";
import { Select, SelectProps } from "antd";
import request from "@/services/request";

interface IOptions {
    label: React.ReactNode;
    value?: string | number | null;
}

type TProps = {
    value?: any;
    onChange?: (value: any) => void;
    api: string;
    attItem: string;
    mode?: SelectProps["mode"];
    placeholder?: string;
};

export default function SelectApi({
    value,
    onChange,
    api,
    attItem,
    mode,
    placeholder,
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

    const filterOption = (input: string, option?: IOptions): boolean =>
        ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase());

    useEffect(() => {
        getData();
    }, []);

    return (
        <Select
            style={{ width: "100%" }}
            showSearch
            filterOption={filterOption}
            value={typeof value === "object" ? value?._id : value}
            options={options}
            onChange={(value) => trigger(value)}
            mode={mode}
            placeholder={placeholder}
            allowClear
            maxTagCount={1}
        />
    );
}
