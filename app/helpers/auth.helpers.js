// use this module to verify authenticated user has proper access to data

async function dataAcessible(userObject, dataObject) {
    // not implemented so always passes
    return true;
}

async function isUserAdmin(userObject) {
    return true;
}

module.exports = {
    dataAcessible,
    isUserAdmin,
}