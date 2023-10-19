import React from "react";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";
import UserAtom from "@/stores/UserStore";
import { useRecoilValue } from "recoil";
import { OrderView } from "@/components/templates";

export default function OrderRequest() {
    const user = useRecoilValue(UserAtom);

    return <OrderView filter={{ seller: user._id }} isAccept={true} isSeller={true} />;
}

OrderRequest.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout title="Quản lý đơn bán">{page}</AccountLayout>
        </UserLayout>
    );
};
