export enum EOrder {
    ORDERED = "Đã đặt",
    CANCEL = "Đã hủy",
    DELIVERING = "Đang vận chuyển",
    FINISH = "Hoàn thành",
}

export enum EStatusShipping {
    PENDING = "Đang chờ xác nhận",
    PREPARING = "Đang chuẩn bị hàng",
    IN_STORE = "Đang ở kho",
    DELIVER_RECEIVE_ITEM = "Người giao hàng đang lấy hàng",
    DELIVERING = "Đang giao tới chổ bạn",
    DELIVERED = "Đã giao",
}
