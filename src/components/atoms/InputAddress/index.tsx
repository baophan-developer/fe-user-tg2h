import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Select } from "antd";
import { IAddress } from "@/interfaces";
import { API_ENDPOINT_PROVINCE_VIETNAM } from "@/constants/apis";
import requestProvinceVietnam from "@/services/request-province";

const GroupSelectStyled = styled.span`
    width: 100%;
    display: flex;
    gap: 0 10px;

    @media (max-width: 500px) {
        flex-direction: column;
        gap: 10px 0;
    }
`;

interface IInputAddress {
    value?: IAddress;
    onChange?: (value: IAddress) => void;
}

interface IOptions {
    value: number;
    label: string;
}

type TAttributes =
    | ["province_id", "province_name"]
    | ["district_id", "district_name"]
    | ["ward_id", "ward_name"];

const createOptions = async (
    api: string,
    attributes: TAttributes
): Promise<IOptions[]> => {
    const res = await requestProvinceVietnam("get", api);
    const options = res.data.results.map((item: any) => {
        return {
            value: +item[attributes[0]],
            label: item[attributes[1]],
        };
    });
    return options;
};

export default function InputAddress({ value, onChange }: IInputAddress) {
    const [provinceOptions, setProvinceOptions] = useState<IOptions[]>([]);
    const [districtOptions, setDistrictOptions] = useState<IOptions[]>([]);
    const [wardOptions, setWardOptions] = useState<IOptions[]>([]);

    const [provinceId, setProvinceId] = useState<number>();
    const [districtId, setDistrictId] = useState<number>();

    const [result, setResult] = useState<IAddress>({
        provinceId: null,
        districtId: null,
        wardId: null,
    });

    const triggerChange = (changeValue: IAddress) => {
        const provinceId = provinceOptions.filter(
            (item) => item.value === changeValue.provinceId
        );
        const districtId = districtOptions.filter(
            (item) => item.value === changeValue.districtId
        );
        const wardId = wardOptions.filter((item) => item.value === changeValue.wardId);

        onChange?.({
            provinceId: provinceId[0]?.value,
            districtId: districtId[0]?.value,
            wardId: wardId[0]?.value,
        });
    };

    useEffect(() => {
        triggerChange(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result]);

    useEffect(() => {
        (async () => {
            try {
                const provinceOptions = await createOptions(
                    API_ENDPOINT_PROVINCE_VIETNAM.LIST_PROVINCE,
                    ["province_id", "province_name"]
                );
                setProvinceOptions(provinceOptions);
            } catch (error: any) {}
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const districtOptions = await createOptions(
                    `${API_ENDPOINT_PROVINCE_VIETNAM.LIST_DISTRICT}/${provinceId}`,
                    ["district_id", "district_name"]
                );
                setDistrictOptions(districtOptions);
            } catch (error: any) {}
        })();
    }, [provinceId]);

    useEffect(() => {
        (async () => {
            try {
                const wardOptions = await createOptions(
                    `${API_ENDPOINT_PROVINCE_VIETNAM.LIST_WARD}/${districtId}`,
                    ["ward_id", "ward_name"]
                );
                setWardOptions(wardOptions);
            } catch (error: any) {}
        })();
    }, [districtId]);

    return (
        <GroupSelectStyled>
            <Select
                style={{ width: "33%" }}
                options={provinceOptions}
                placeholder="Chọn tỉnh/thành phố"
                onChange={(value) => {
                    setProvinceId(value);
                    setResult({
                        provinceId: value,
                        districtId: null,
                        wardId: null,
                    });
                }}
            />
            <Select
                style={{ width: "33%" }}
                options={districtOptions}
                placeholder="Chọn tỉnh/thành phố"
                onChange={(value) => {
                    setDistrictId(value);
                    setResult((prev) => ({
                        ...prev,
                        districtId: value,
                        wardId: null,
                    }));
                }}
            />
            <Select
                style={{ width: "33%" }}
                options={wardOptions}
                placeholder="Chọn tỉnh/thành phố"
                onChange={(value) => {
                    setResult((prev) => ({ ...prev, wardId: value }));
                }}
            />
        </GroupSelectStyled>
    );
}
