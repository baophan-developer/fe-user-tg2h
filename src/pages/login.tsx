import AuthLayout from "@/layouts/AuthLayout";
import React from "react";

export default function Login() {
    return <div>Login page</div>;
}

Login.getLayout = function getLayout(page: React.ReactElement) {
    return <AuthLayout>{page}</AuthLayout>;
};
