import { atom } from "recoil";
import { ICartItem } from "@/interfaces";

const CheckoutAtom = atom({
    key: "checkout_atom",
    default: {} as ICartItem,
});

export default CheckoutAtom;
