module.exports = app => {
    const controller = require("./controller.js");
    var router = require("express").Router();
    // Create a new Customer
    router.post("/", controller.create);
    //Retrieve customers data
    router.get("/",controller.findAllCustomers);

    app.use("/api/customers", router);
}
