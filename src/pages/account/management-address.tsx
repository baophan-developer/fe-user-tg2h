import React from "react";
import UserLayout from "@/layouts/UserLayout";
import AccountLayout from "@/layouts/AccountLayout";

export default function Address() {
    return <div>address</div>;
}

Address.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout>{page}</AccountLayout>
        </UserLayout>
    );
};
