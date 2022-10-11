const db = require("./dbserver");
const Customer = db.customers;

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body.id) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Customer
    const customer = new Customer({
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        password: req.body.password,
        phoneNo: req.body.phoneNo
    });

    // Save Tutorial in the database
    customer
        .save(customer)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Customer."
            });
        });
};