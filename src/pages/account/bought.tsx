import React, { useEffect, useState } from "react";
import { Card, Image, List } from "antd";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";
import request from "@/services/request";
import { API_ENDPOINT } from "@/constants/apis";
import useChangeSizeWindow from "@/hooks/useChangeSizeWindow";
import ROUTERS from "@/constants/routers";
import { useRouter } from "next/router";
import { IProduct } from "@/interfaces";

const { Meta } = Card;

const getColumns = (width: number) => {
    if (width > 1000) return 4;
    if (width < 1000) return 2;
    return 1;
};

const getWidthImage = (width: number) => {
    return width < 500 ? 150 : 200;
};

export default function Bought() {
    const user = useRecoilValue(UserAtom);
    const size = useChangeSizeWindow();
    const router = useRouter();
    const [bought, setBought] = useState<IProduct[]>([]);

    const getBought = async () => {
        try {
            const res = await request<any>("post", API_ENDPOINT.BOUGHT, {
                filters: {
                    owner: user._id,
                },
            });
            setBought(res.data.item.products);
        } catch (error) {}
    };

    useEffect(() => {
        user && getBought();
    }, [user]);

    return (
        <List
            grid={{ gutter: 4, column: getColumns(size.width) }}
            dataSource={bought}
            renderItem={(item) => (
                <List.Item>
                    <Card>
                        <div
                            onClick={() => router.push(`${ROUTERS.PRODUCTS}/${item._id}`)}
                        >
                            <Image
                                src={item.images[0]}
                                preview={false}
                                width={getWidthImage(size.width)}
                            />
                            <Meta
                                title={item.name}
                                description={item.price.toLocaleString("vi")}
                            />
                            <br />
                        </div>
                    </Card>
                </List.Item>
            )}
        />
    );
}

Bought.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout title="Các sản phẩm đã mua">{page}</AccountLayout>
        </UserLayout>
    );
};
