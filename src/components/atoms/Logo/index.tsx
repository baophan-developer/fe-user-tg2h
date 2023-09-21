import React from "react";
import Link from "next/link";
import ROUTERS from "@/constants/routers";

export default function Logo() {
    return (
        <h2>
            <Link href={ROUTERS.HOME}>TG2H</Link>
        </h2>
    );
}
