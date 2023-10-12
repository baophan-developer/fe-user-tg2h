import { atom } from "recoil";
import { ICart } from "@/interfaces";

const CartAtom = atom({
    key: "cart_atom",
    default: { list: [], total: 0 } as ICart,
});

export default CartAtom;
