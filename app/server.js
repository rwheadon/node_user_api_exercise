const makeApp = require('./app');
const port = 3082;

makeApp()
    .then(app => {
        // use app to do other express related configs here
        app.listen(port)
    })
    .then(() => {
        console.log(`App running on port ${port}...`)
    })
    .catch(err => {
        console.error('Caught an error', err)
    });
