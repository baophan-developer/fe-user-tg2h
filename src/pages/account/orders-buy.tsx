import React from "react";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";
import { OrderView } from "@/components/templates";
import { useRecoilValue } from "recoil";
import UserAtom from "@/stores/UserStore";

export default function OrderBuy() {
    const user = useRecoilValue(UserAtom);

    return <OrderView filter={{ owner: user._id }} />;
}

OrderBuy.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout title="Quản lý đơn mua">{page}</AccountLayout>
        </UserLayout>
    );
};
