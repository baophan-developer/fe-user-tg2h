export interface IProduct {
    index: React.Key;
    _id: string;
    name: string;
    images: string[];
    desc: string;
    price: number;
    length: number;
    height: number;
    width: number;
    weight: number;
    betterCapacity: string;
    newness: number;
    owner: string;
    sizeScreen: { _id: string; size: string };
    scanFrequency: { _id: string; scanFrequency: string };
    resolutionScreen: { _id: string; name: string };
    typeRam: { _id: string; name: string };
    capacityRam: { _id: string; capacity: string };
    typeRom: { _id: string; name: string };
    capacityRom: { _id: string; capacity: string };
    gpu: { _id: string; name: string };
    cpu: { _id: string; name: string };
    os: { _id: string; name: string };
    brand: { _id: string; name: string };
    category: { _id: string; name: string };
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
    _id: string;
    email: string;
    name: string;
    birthday: Date;
    phone: string;
    gender: boolean;
    avatar: string;
    address: IAddress[];
    favorites: IProduct[];
}
