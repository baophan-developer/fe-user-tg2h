import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import MainLayout from "@/layouts/MainLayout";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <MainLayout>
            <Component {...pageProps} />
        </MainLayout>
    );
}
