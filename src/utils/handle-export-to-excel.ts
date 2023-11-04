import { IOrder } from "@/interfaces";
import { message } from "antd";
import dayjs from "dayjs";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";

const handleExportDataToExcel = (apiData: IOrder[]) => {
    if (apiData?.length === 0) {
        message.error("Lỗi, không có dữ liệu thực hiện thống kê.", 1);
        return;
    }

    const newData = apiData.map((item: IOrder, index: number) => {
        let productString = "";

        item.items.forEach((item) => {
            productString += `${item.product.name} sl: x${item.quantity} \n`;
        });

        return {
            STT: index + 1,
            "Mã đơn hàng": item.code,
            "Người mua": item.owner.name,
            "Phương thức thanh toán": item.payment.name,
            "Phương thức vận chuyển": item.shipping.name,
            "Địa chỉ người nhận hàng": item.pickupAddress,
            "Địa chỉ gửi hàng": item.deliveryAddress,
            "Sản phẩm": productString,
            "Trạng thái vận chuyển": item.statusShipping,
            "Trạng thái thanh toán": item.statusPayment
                ? "Đã thanh toán"
                : "Chưa thanh toán",
            "Trạng thái đơn hàng": item.statusOrder,
            "Ngày tạo đơn": dayjs(item.createdAt).format("YYYY-MM-DD hh:mm"),
            "Ngày cập nhật gần đây": dayjs(item.updatedAt).format("YYYY-MM-DD hh:mm"),
            "Tổng đơn": item.totalPayment.toLocaleString("vi"),
        };
    });

    /** +1 for bottom */
    const rows = newData.length + 1;

    const sum = apiData.reduce((value: any, curr: any) => curr.totalPayment + value, 0);

    const toDay = dayjs().format("YYYY-MM-DD hh:mm");

    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([
        ...newData,
        {
            STT: "Tổng",
            "Mã đơn hàng": "",
            "Người mua": "",
            "Phương thức thanh toán": "",
            "Phương thức vận chuyển": "",
            "Địa chỉ người nhận hàng": "",
            "Địa chỉ gửi hàng": "",
            "Trạng thái thanh toán": "",
            "Ngày tạo đơn": "",
            "Ngày cập nhật gần đây": "",
            "Trạng thái vận chuyển": "",
            "Trạng thái đơn hàng": "",
            "Sản phẩm": "",
            "Tổng đơn": sum.toLocaleString("vi"),
        },
    ]);

    // set width for cols
    if (!ws["!cols"]) ws["!cols"] = [];
    ws["!cols"][0] = { wch: 5 };
    ws["!cols"][1] = { wch: 15 };
    ws["!cols"][2] = { wch: 25 };
    ws["!cols"][3] = { wch: 25 };
    ws["!cols"][4] = { wch: 25 };
    ws["!cols"][5] = { wch: 40 };
    ws["!cols"][6] = { wch: 40 };
    ws["!cols"][7] = { wch: 40 };
    ws["!cols"][8] = { wch: 22 };
    ws["!cols"][9] = { wch: 20 };
    ws["!cols"][10] = { wch: 20 };
    ws["!cols"][11] = { wch: 20 };
    ws["!cols"][12] = { wch: 25 };
    ws["!cols"][13] = { wch: 20 };

    // set height row
    ws["!rows"] = [];
    for (let row = 0; row <= rows; row++) {
        ws["!rows"][row] = { hpt: 50, hpx: 50 };
    }

    // style for header
    const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
    for (let i = 0; i < cols.length; i++) {
        ws[cols[i] + 1].s = {
            font: {
                name: "Times New Roman",
                bold: true,
            },
            alignment: {
                vertical: "center",
                horizontal: "center",
            },
            border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
            },
        };
    }

    // style for all cells
    for (let row = 1; row <= rows - 1; row++) {
        for (let col = 0; col <= cols.length; col++) {
            const cell = XLSX.utils.encode_cell({ r: row, c: col });
            if (!ws[cell]) ws[cell] = {};
            ws[cell].s = {
                font: { name: "Times New Roman" },
                alignment: {
                    vertical: "center",
                    horizontal: "left",
                },
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                },
            };
        }
    }

    // style for columns D and E
    for (let row = 2; row <= rows; row++) {
        ws["E" + row].s = {
            font: { name: "Times New Roman" },
            alignment: {
                wrapText: true,
                vertical: "center",
            },
            border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
            },
        };
        ws["F" + row].s = {
            font: { name: "Times New Roman" },
            alignment: {
                wrapText: true,
                vertical: "center",
            },
            border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
            },
        };
        ws["G" + row].s = {
            font: { name: "Times New Roman" },
            alignment: {
                wrapText: true,
                vertical: "center",
            },
            border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
            },
        };
    }

    // create total bottom
    ws["!merges"] = [];
    ws["!merges"].push({
        s: { r: newData.length + 1, c: 0 },
        e: { r: newData.length + 1, c: cols.length - 2 },
    });

    // style bottom row
    for (let col = 0; col < cols.length - 1; col++) {
        const cell = XLSX.utils.encode_cell({ r: rows, c: col });
        if (!ws[cell]) ws[cell] = {};
        ws[cell].s = {
            font: {
                name: "Times New Roman",
                bold: true,
                sz: 14,
            },
            alignment: {
                vertical: "center",
                horizontal: "left",
            },
            border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
            },
        };
    }
    const cellTotalNumber = XLSX.utils.encode_cell({ r: rows, c: cols.length - 1 });
    if (!ws[cellTotalNumber]) ws[cellTotalNumber] = {};
    ws[cellTotalNumber].s = {
        font: {
            name: "Times New Roman",
            bold: true,
            sz: 14,
        },
        alignment: {
            vertical: "center",
            horizontal: "left",
        },
        border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
        },
    };

    XLSX.utils.book_append_sheet(wb, ws, "sheet1");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(data, `Report ${toDay}` + fileExtension);
};

export default handleExportDataToExcel;
