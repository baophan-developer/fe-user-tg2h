import "@/styles/globals.scss";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import MainLayout from "@/layouts/MainLayout";
import UserLayout from "@/layouts/UserLayout";
import { PrivateRoutes } from "@/components/templates";

type TNextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type TAppPropsWithLayout = AppProps & {
    Component: TNextPageWithLayout;
};

export default function App({ Component, pageProps }: TAppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => <UserLayout>{page}</UserLayout>);
    return (
        <MainLayout>
            <PrivateRoutes>{getLayout(<Component {...pageProps} />)}</PrivateRoutes>
        </MainLayout>
    );
}
