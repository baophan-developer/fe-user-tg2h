export interface IProduct {
    name: string;
}

export interface IAddress {
    provinceId: number | null;
    districtId: number | null;
    wardId: number | null;
    address?: string;
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
