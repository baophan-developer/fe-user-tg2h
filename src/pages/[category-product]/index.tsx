import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Layout, Select } from "antd";
import { ViewProducts } from "@/components/templates";
import { API_ENDPOINT } from "@/constants/apis";
import styled from "styled-components";
import SelectApi from "@/components/atoms/SelectApi";

const TitleStyled = styled.h2`
    text-align: center;
    padding: 0 0 10px 0;
`;

const FilterStyled = styled.div`
    padding: 0 5%;
    display: flex;
    margin-bottom: 10px;

    @media only screen and (max-width: 900px) {
        flex-direction: column;
        gap: 10px;
    }
`;

const ActionStyled = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 5px;
`;

const SelectStyled = styled.div`
    width: 170px;
`;

export default function CategoryProduct() {
    const router = useRouter();
    const [filters, setFilter] = useState<any>({});
    const [sort, setSort] = useState<{ price: 1 | -1 }>();

    const handleChangeFilter = (value: any, att: string) => {
        if (value.length === 0) {
            setFilter((prev: any) => ({ ...prev, [att]: undefined }));
            return;
        }
        setFilter((prev: any) => ({
            ...prev,
            [att]: { $in: value },
        }));
    };

    return (
        <Layout>
            <TitleStyled>{router.query["category-product"]}</TitleStyled>
            <FilterStyled>
                <h2 style={{ width: "100px", fontWeight: 400 }}>Bộ lọc: </h2>
                <ActionStyled>
                    <SelectStyled>
                        <SelectApi
                            api={API_ENDPOINT.CPU}
                            attItem="name"
                            mode="tags"
                            onChange={(value) => handleChangeFilter(value, "cpu")}
                            placeholder="Vi xử lý"
                        />
                    </SelectStyled>
                    <SelectStyled>
                        <SelectApi
                            api={API_ENDPOINT.OS}
                            attItem="name"
                            mode="tags"
                            onChange={(value) => handleChangeFilter(value, "os")}
                            placeholder="Hệ điều hành"
                        />
                    </SelectStyled>
                    <SelectStyled>
                        <SelectApi
                            api={API_ENDPOINT.CAPACITY_RAM}
                            attItem="capacity"
                            mode="tags"
                            onChange={(value) => handleChangeFilter(value, "capacityRam")}
                            placeholder="Dung lượng RAM"
                        />
                    </SelectStyled>
                    <SelectStyled>
                        <SelectApi
                            api={API_ENDPOINT.TYPE_RAM}
                            attItem="name"
                            mode="tags"
                            onChange={(value) => handleChangeFilter(value, "typeRam")}
                            placeholder="Loại Ram"
                        />
                    </SelectStyled>
                    <SelectStyled>
                        <SelectApi
                            api={API_ENDPOINT.CAPACITY_ROM}
                            attItem="capacity"
                            mode="tags"
                            onChange={(value) => handleChangeFilter(value, "capacityRom")}
                            placeholder="Dung lượng ROM"
                        />
                    </SelectStyled>
                    <SelectStyled>
                        <SelectApi
                            api={API_ENDPOINT.TYPE_ROM}
                            attItem="name"
                            mode="tags"
                            onChange={(value) => handleChangeFilter(value, "typeRom")}
                            placeholder="Loại Rom"
                        />
                    </SelectStyled>
                    <SelectStyled>
                        <SelectApi
                            api={API_ENDPOINT.BRAND}
                            attItem="name"
                            mode="tags"
                            onChange={(value) => handleChangeFilter(value, "brand")}
                            placeholder="Thương hiệu"
                        />
                    </SelectStyled>
                    <Select
                        style={{ width: "170px" }}
                        placeholder="Giá"
                        onChange={(value: 1 | -1) => setSort({ price: value })}
                        options={[
                            { label: "Giá từ thấp đến cao", value: 1 },
                            { label: "Giá từ cao tới thấp", value: -1 },
                        ]}
                    />
                </ActionStyled>
            </FilterStyled>
            <ViewProducts
                requestApi={{ method: "post", api: API_ENDPOINT.PRODUCT.GET }}
                filters={{ category: router.query.id, ...filters }}
                sort={sort}
            />
        </Layout>
    );
}
