import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ROUTERS from "@/constants/routers";

type TProps = {
    children?: React.ReactNode;
};

export default function PrivateRoutes({ children }: TProps) {
    const route = useRouter();
    const [authorized, setAuthorized] = useState(false);

    let token: string | null | undefined = null;

    if (typeof window !== "undefined") token = localStorage.getItem("accessToken");

    const authCheck = (url: string) => {
        const publicPaths = [
            ROUTERS.LOGIN,
            ROUTERS.REGISTER,
            ROUTERS.RESET_PASSWORD,
            ROUTERS.FORGOT_PASSWORD,
        ];

        const path = url.split("?")[0];

        if (!token && !publicPaths.includes(path)) {
            route.push({
                pathname: ROUTERS.LOGIN,
            });
        } else {
            setAuthorized(true);
        }
    };

    useEffect(() => {
        // check auth
        authCheck(route.asPath);

        // on route change completed
        route.events.on("routeChangeComplete", authCheck);

        return () => {
            route.events.off("routeChangeComplete", authCheck);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return authorized && children;
}
