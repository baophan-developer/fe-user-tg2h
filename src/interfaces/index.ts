export interface IComment {
    _id: string;
    user: {
        _id: string;
        name: string;
        avatar: string;
    };
    product: string;
    rating: number;
    content: string;
}

export interface IOrder {
    _id: string;
    owner: IUser;
    seller: IUser;
    items: {
        product: IProduct;
        discount: { name: string; percent: number };
        quantity: number;
        price: number;
    }[];
    payment: {
        name: string;
    };
    shipping: {
        name: string;
    };
    pickupAddress: string;
    deliverAddress: string;
    statusOrder: string;
    statusPayment: boolean;
    statusShipping: string;
    totalPayment: number;
    reasonCancel: string;
    refund: boolean;
}

export interface ICartItemProduct {
    product: {
        _id: string;
        name: string;
        images: string[];
        price: number;
        newness: number;
        owner: string;
        discount?: {
            _id: string;
            code: string;
        };
    };
    quantity: number;
}

export interface ICartItem {
    _id: string;
    ownerCart: string;
    ownerProducts: {
        _id: string;
        name: string;
        avatar: string;
        address: {
            street: string;
            address: string;
        }[];
    };
    items: ICartItemProduct[];
}

export interface ICart {
    list: ICartItem[];
    total: number;
}

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
    discount?: {
        _id: string;
        code: string;
        amount: number;
        percent: number;
        start: Date;
        end: Date;
        status: boolean;
    };
    reviews: number;
    rating: number;
    sold: number;
}

export interface IProductRender extends Omit<IProduct, "owner"> {
    owner: {
        _id: string;
        name: string;
        gender: boolean;
        phone: string;
        birthday: string;
        avatar: string;
        email: string;
    };
}

export interface IAddress {
    _id?: string;
    provinceId: number | null | undefined;
    districtId: number | null | undefined;
    wardId: number | null | undefined;
    address?: string;
    street?: string;
    main?: boolean;
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
