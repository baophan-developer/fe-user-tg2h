import { Blob, File } from "buffer";

export interface IProduct {
    id: string;
    name: string;
    images: any[];
    desc: string;
    price: number;
    length: number;
    height: number;
    width: number;
    weight: number;
    betterCapacity: string;
    newness: number;
    owner: string;
    sizeScreen: string;
    scanFrequency: string;
    resolutionScreen: string;
    typeRam: string;
    capacityRam: string;
    typeRom: string;
    capacityRom: string;
    gpu: string;
    cpu: string;
    os: string;
    brand: string;
    category: string;
    approve: boolean;
    status: boolean;
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
