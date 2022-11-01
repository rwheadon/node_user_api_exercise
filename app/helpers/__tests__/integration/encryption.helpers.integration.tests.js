const bcrypt = require('bcrypt');
const encryptionHelpers = require('../../encryption.helpers');
const assert = require("assert");

describe('Hashing integration tests', () => {
    test ('creates a hashed string differing from the original string', async () => {
        const unhashed = '1.4m.V4lu48l3';
        // console.log('unhashed : ', unhashed);
        const secureHashString = await encryptionHelpers.secureHashString(unhashed);
        // console.log('secureHashString : ', secureHashString);
        expect(secureHashString).not.toBe('PASSWORD_NOT_HASHED');
        expect(secureHashString).not.toBe(unhashed);
    })

    test ('creates a secure hash string and is able to pass a reverse comparison in bcrypt', async () => {
        const unhashed = '1.4m.V4lu48l3';
        const secureHashString = await encryptionHelpers.secureHashString(unhashed);
        const stringsMatched = await bcrypt.compare('1.4m.V4lu48l3', secureHashString);
        expect(secureHashString).not.toBe('PASSWORD_NOT_HASHED');
        expect(stringsMatched).toBeTruthy();
    })

    test ('creates a secure has string and is cannot pass a reverse comparison in bcrypt using a different \'original\' value', async () => {
        const unhashed = '1.4m.V4lu48l3';
        const secureHashString = await encryptionHelpers.secureHashString(unhashed);
        const stringsMatched = await bcrypt.compare('1.4m.N07.V4lu48l3', secureHashString);
        expect(secureHashString).not.toBe('PASSWORD_NOT_HASHED');
        expect(stringsMatched).not.toBeTruthy();
    })
})
