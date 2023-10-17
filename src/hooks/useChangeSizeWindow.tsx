import React, { useEffect, useState } from "react";

export default function useChangeSizeWindow() {
    const [size, setSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    function handleChangeSize() {
        setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    useEffect(() => {
        window.addEventListener("resize", handleChangeSize);

        return () => {
            window.removeEventListener("resize", handleChangeSize);
        };
    }, [size]);

    return size;
}
