import AccountLayout from "@/layouts/AccountLayout";
import UserLayout from "@/layouts/UserLayout";
import React from "react";

export default function Account() {
    return <div>This is page account</div>;
}

Account.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <UserLayout>
            <AccountLayout>{page}</AccountLayout>
        </UserLayout>
    );
};
