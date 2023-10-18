import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Select } from "antd";
import { IAddress } from "@/interfaces";
import { API_ENDPOINT_PROVINCE_VIETNAM } from "@/constants/apis";
import requestProvinceVietnam from "@/services/request-province";
import useChangeSizeWindow from "@/hooks/useChangeSizeWindow";

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
    const size = useChangeSizeWindow();

    const [provinceOptions, setProvinceOptions] = useState<IOptions[]>([]);
    const [districtOptions, setDistrictOptions] = useState<IOptions[]>([]);
    const [wardOptions, setWardOptions] = useState<IOptions[]>([]);

    const [provinceId, setProvinceId] = useState<number | null | undefined>(
        value?.provinceId
    );
    const [districtId, setDistrictId] = useState<number | null | undefined>(
        value?.districtId
    );

    const [result, setResult] = useState<IAddress>({
        provinceId: value?.provinceId,
        districtId: value?.districtId,
        wardId: value?.wardId,
    });

    const [loading, setLoading] = useState<boolean>(false);

    const triggerChange = (changeValue: IAddress) => {
        const province = provinceOptions.filter(
            (item: IOptions) => item.value === changeValue.provinceId
        )[0]?.label;

        const district = districtOptions.filter(
            (item: IOptions) => item.value === changeValue.districtId
        )[0]?.label;

        const ward = wardOptions.filter(
            (item: IOptions) => item.value === changeValue.wardId
        )[0]?.label;

        const obj = {
            provinceId: changeValue.provinceId,
            districtId: changeValue.districtId,
            wardId: changeValue.wardId,
            address: province ? `${ward}, ${district}, ${province}` : value?.address,
        };
        onChange?.({ ...obj });
    };

    const getProvinces = async () => {
        setLoading(true);
        try {
            const provinceOptions = await createOptions(
                API_ENDPOINT_PROVINCE_VIETNAM.LIST_PROVINCE,
                ["province_id", "province_name"]
            );
            setProvinceOptions(provinceOptions);
        } catch (error: any) {}
        setLoading(false);
    };

    const getDistricts = async (provinceId: number | null | undefined) => {
        try {
            const districtOptions = await createOptions(
                `${API_ENDPOINT_PROVINCE_VIETNAM.LIST_DISTRICT}/${provinceId}`,
                ["district_id", "district_name"]
            );
            setDistrictOptions(districtOptions);
        } catch (error: any) {}
    };

    const getWards = async (districtId: number | null | undefined) => {
        try {
            const wardOptions = await createOptions(
                `${API_ENDPOINT_PROVINCE_VIETNAM.LIST_WARD}/${districtId}`,
                ["ward_id", "ward_name"]
            );
            setWardOptions(wardOptions);
        } catch (error: any) {}
    };

    useEffect(() => {
        getProvinces();
    }, []);

    useEffect(() => {
        getDistricts(provinceId);
        setWardOptions([]);
    }, [provinceId]);

    useEffect(() => {
        getWards(districtId);
    }, [districtId]);

    useEffect(() => {
        triggerChange(result);
    }, [result]);

    return (
        <GroupSelectStyled>
            <Select
                loading={loading}
                style={{ width: `${size.width < 500 ? "100%" : "32%"}` }}
                options={provinceOptions}
                value={result.provinceId}
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
                style={{ width: `${size.width < 500 ? "100%" : "32%"}` }}
                value={result.districtId}
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
                style={{ width: `${size.width < 500 ? "100%" : "32%"}` }}
                value={result.wardId}
                options={wardOptions}
                placeholder="Chọn tỉnh/thành phố"
                onChange={(value) => {
                    setResult((prev) => ({ ...prev, wardId: value }));
                }}
            />
        </GroupSelectStyled>
    );
}
