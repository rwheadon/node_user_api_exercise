const bcrypt = require('bcrypt');

async function generateRandomSalt() {
    // random number between 8 and 12
    const randSaltiness = 8;
    let salt = '';
    // generate the salt
    try {
        salt = await bcrypt.genSalt(randSaltiness);
    } catch (e) {
        console.error('salt could not be generated', e);
    }
    return salt;
}

async function secureHashString(stringToHash) {
    try {
        let saltString = await generateRandomSalt();
        return hashed = await bcrypt.hash(stringToHash, saltString);
    } catch (e) {
        console.error("Could not hash the password", e);
        return 'PASSWORD_NOT_HASHED';
    }
}

async function stringAndHashMatcher(plaintextString, hashString) {
    return bcrypt.compare(plaintextString, hashString);
}

module.exports = {
    secureHashString,
    stringAndHashMatcher,
}