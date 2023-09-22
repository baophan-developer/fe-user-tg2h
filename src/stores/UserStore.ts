import { atom } from "recoil";
import { IUser } from "@/interfaces";

const UserAtom = atom({
    key: "user_atom",
    default: {} as IUser,
});

export default UserAtom;
