const controller = require("./controller.js");
module.exports = app => {
    const controller = require("./controller.js");
    var router = require("express").Router();
    // Create a new Customer
    router.post("/", controller.create);
    //Retrieve customers data
    router.get("/",controller.findAllCustomers);
   //Retrieve customer by id
    router.get("/:id/:name?",controller.findByCustomerId);
    app.use("/api/customers", router);
}
