import { IProductRender } from "@/interfaces";

export const getLayoutDescriptionProduct = (product: IProductRender) => {
    return [
        {
            key: "1",
            label: "Thương hiệu",
            children: product?.brand.name,
            span: 3,
        },
        {
            key: "2",
            label: "Loại sản phẩm",
            children: product?.category.name,
            span: 3,
        },
        {
            key: "3",
            label: "Hệ điều hành",
            children: product?.os.name,
            span: 3,
        },
        {
            key: "4",
            label: "Chip xử lý",
            children: product?.cpu.name,
            span: 3,
        },
        {
            key: "5",
            label: "Chip xử lý đồ họa",
            children: product?.gpu.name,
            span: 3,
        },
        {
            key: "6",
            label: "Công nghệ Ram",
            children: product?.typeRam.name,
            span: 3,
        },
        {
            key: "7",
            label: "Dung lượng Ram",
            children: product?.capacityRam.capacity,
            span: 3,
        },
        {
            key: "8",
            label: "Công nghệ ổ nhớ",
            children: product?.typeRom.name,
            span: 3,
        },
        {
            key: "9",
            label: "Dung lượng ổ nhớ",
            children: product?.capacityRom.capacity,
            span: 3,
        },
        {
            key: "10",
            label: "Dung lượng pin",
            children: `${product?.betterCapacity} WH`,
            span: 3,
        },
        {
            key: "11",
            label: "Kích thước màn hình",
            children: product?.sizeScreen.size,
            span: 3,
        },
        {
            key: "12",
            label: "Độ phân giải màn hình",
            children: product?.resolutionScreen.name,
            span: 3,
        },
        {
            key: "13",
            label: "Tần số quét màn hình",
            children: product?.scanFrequency.scanFrequency,
            span: 3,
        },
        {
            key: "14",
            label: "Chiều dài",
            children: ` ${product?.length} mm`,
            span: 3,
        },
        {
            key: "15",
            label: "Chiều rộng",
            children: ` ${product?.width} mm`,
            span: 3,
        },
        {
            key: "16",
            label: "Độ dài",
            children: ` ${product?.height} mm`,
            span: 3,
        },
        {
            key: "17",
            label: "Cân nặng",
            children: ` ${product?.weight} kg`,
            span: 3,
        },
        {
            key: "17",
            label: "Độ mới",
            children: ` ${product?.newness} %`,
            span: 3,
        },
    ];
};
