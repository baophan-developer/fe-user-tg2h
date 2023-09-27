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

export { handleDataWithAddress };
