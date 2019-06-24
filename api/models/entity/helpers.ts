export const removeUndefined = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') removeUndefined(obj[key]);
        else if (obj[key] === undefined) delete obj[key];
    });
    return obj;
};
