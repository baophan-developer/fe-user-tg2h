import AccountLayout from "@/layouts/AccountLayout";
import UserLayout from "@/layouts/UserLayout";
import React from "react";

export default function DetailProduct() {
    return <div>This is page detail products</div>;
}

DetailProduct.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout title="Chi tiết sản phẩm">{page}</AccountLayout>
        </UserLayout>
    );
};
