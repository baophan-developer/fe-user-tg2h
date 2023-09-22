import type { MenuProps } from "antd";

type TMenuItem = Required<MenuProps>["items"][number];

function getItem(
    key: React.Key,
    label?: React.ReactNode,
    icon?: React.ReactNode,
    children?: TMenuItem[]
): TMenuItem {
    return {
        key,
        label,
        icon,
        children,
    };
}

export default getItem;
