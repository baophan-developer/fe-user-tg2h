export interface IMessage {
    chatId: string;
    senderId: string;
    content: string;
    createdAt: string;
}

export interface IChat {
    _id: string;
    members: IUser[];
}

export interface IComment {
    _id: string;
    user: {
        _id: string;
        name: string;
        avatar: string;
        bought: string[];
    };
    product: string;
    rating: number;
    content: string;
    createdAt: string;
}

export interface IItemOrder {
    product: IProduct;
    discount: { name: string; percent: number };
    quantity: number;
    price: number;
}

export interface IOrder {
    _id: string;
    code: string;
    owner: IUser;
    seller: IUser;
    items: IItemOrder[];
    payment: {
        name: string;
    };
    shipping: {
        name: string;
    };
    pickupAddress: string;
    deliveryAddress: string;
    statusOrder: string;
    statusPayment: boolean;
    statusShipping: string;
    totalPayment: number;
    reasonCancel: string;
    refund: boolean;
    createdAt: string;
    updatedAt: string;
    dayReceiveOrder: Date;
    received: boolean;
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
    owner: {
        _id: string;
        email: string;
        name: string;
        avatar: string;
        birthday: Date;
        phone: string;
        gender: boolean;
    };
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
        start: string;
        end: string;
        status: boolean;
    };
    reviews: number;
    rating: number;
    sold: number;
    quantity: number;
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
    bought: IProduct[];
}

export interface ISocketRealtime {
    userReceive: string;
}

export interface INotificationSocket extends ISocketRealtime {
    title: string;
    message: string;
}
