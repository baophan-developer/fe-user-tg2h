export interface IProduct {
    name: string;
}

export interface IAddress {
    _id?: string;
    provinceId: number | null | undefined;
    districtId: number | null | undefined;
    wardId: number | null | undefined;
    address?: string;
    street?: string;
}

export interface IUser {
    email: string;
    name: string;
    birthday: Date;
    phone: string;
    gender: boolean;
    avatar: string;
    address: IAddress[];
    favorites: IProduct[];
}
