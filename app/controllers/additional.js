async function fetchSomething(req, res) {
    if (req.method && req.method === 'GET') {
        const dataList = [
            { property1: 'some-string', property3: {id: 333, color: "red"}, property2: "hello"},
            { property1: 'Frimpong', property4: 3124, property2: "world"},
        ];
        res.json(dataList);
    } else {
        res.json({"message": "We don't like your method type", "method-type": req.method});
    }
}

module.exports = {
    fetchSomething,
}
