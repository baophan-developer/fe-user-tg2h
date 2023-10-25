import React, { useEffect, useState } from "react";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";
import { Card, Image, List } from "antd";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";
import { IProduct } from "@/interfaces";
import { useRouter } from "next/router";
import ROUTERS from "@/constants/routers";
import useChangeSizeWindow from "@/hooks/useChangeSizeWindow";

const { Meta } = Card;

const getColumns = (width: number) => {
    if (width > 1000) return 4;
    if (width < 1000) return 2;
    return 1;
};

const getWidthImage = (width: number) => {
    return width < 500 ? 150 : 170;
};

export default function Favorites() {
    const user = useRecoilValue(UserAtom);
    const size = useChangeSizeWindow();
    const router = useRouter();
    const [favorites, setFavorites] = useState<IProduct[]>([]);

    useEffect(() => {
        user.favorites?.length > 0 && setFavorites(user.favorites);
    }, [user]);

    return (
        <List
            locale={{ emptyText: "Không có sản phẩm nào ở đây" }}
            grid={{ gutter: 4, column: getColumns(size.width) }}
            dataSource={favorites}
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

Favorites.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout title="Sản phẩm yêu thích">{page}</AccountLayout>
        </UserLayout>
    );
};
