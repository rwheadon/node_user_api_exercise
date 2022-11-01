

async function maskData(jsonData) {
    if (jsonData.password) {
        jsonData.password = '**********';
    }
    return jsonData;
}

module.exports = {
    maskData,
}