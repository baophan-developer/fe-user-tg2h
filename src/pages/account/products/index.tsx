import React from "react";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";

export default function Product() {
    return <div>product</div>;
}

Product.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout title="Danh sách sản phẩm của bạn">{page}</AccountLayout>
        </UserLayout>
    );
};
