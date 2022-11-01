const db = require('../../database');

async function testDBConnection() {
    try {
        await db.authenticate();
        db.close();
        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        db.close();
        return false;
    }
}
describe('MySQL database integration tests', () => {
    test('Checks that the database is accepting connections', async () => {
        const connected = await testDBConnection();
        expect(connected).toBeTruthy();
    })
})

