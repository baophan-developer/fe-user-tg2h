const handleDataWithAddress = (value: any) => {
    const newValue: any = {};
    for (const key in value) {
        if (key === "address") {
            for (const keyAddress in value[key]) {
                newValue[keyAddress] = value[key][keyAddress];
            }
            continue;
        }
        newValue[key] = value[key];
    }
    return newValue;
};

const handleDataProduct = (value: any) => {
    const formData = new FormData();
    /**
     * into component ButtonFormModel has compare two object, in case
     * create new Item, between oldValue and newValue will has one empty obj
     */
    const images = value?.images?.map((item: any) => item.originFileObj);
    const newValue = { ...value };
    images?.length > 0 && (newValue["images"] = images);
    for (const key in newValue) {
        if (key === "images") {
            for (const item of newValue[key]) {
                formData.append(key, item);
            }
            continue;
        }
        formData.append(key, newValue[key]);
    }
    formData.append("approve", "false");
    formData.append("status", "true");
    return formData;
};

export { handleDataWithAddress, handleDataProduct };
