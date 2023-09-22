import React from "react";
import AuthLayout from "@/layouts/AuthLayout";

export default function Register() {
    return <div>This is page register user</div>;
}
Register.getLayout = function getLayout(page: React.ReactElement) {
    return <AuthLayout>{page}</AuthLayout>;
};
