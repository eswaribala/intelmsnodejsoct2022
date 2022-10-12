const controller = require("./controller.js");
module.exports = app => {
    const controller = require("./controller.js");
    var router = require("express").Router();
    // Create a new Customer
    router.post("/", controller.create);
    //Retrieve customers data
    router.get("/",controller.findAllCustomers);
   //Retrieve customer by id
    //path param
    router.get("/:id",controller.findByCustomerId);
    //path param
    router.get("/byName/:name",controller.findByCustomerName);

    //path param
    router.put("/:id",controller.updateCustomer);

    router.delete("/:id",controller.deleteByCustomerId);
    //versioning
    //app.use("/api/customers/v1.0", router);
    app.use("/api/customers/", router);
}
