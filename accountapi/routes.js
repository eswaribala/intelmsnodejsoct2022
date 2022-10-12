const controller = require("./controller.js");
module.exports = app => {
    const controller = require("./controller.js");
    var router = require("express").Router();
    // Create a new Account
    router.post("/", controller.create);
    //Retrieve customers data
    router.get("/",controller.findAllAccounts);
   //Retrieve customer by id
    //path param
    router.get("/:id",controller.findByAccountNo);


    //path param
    router.put("/:id",controller.updateAccount);

    router.delete("/:id",controller.deleteByAccountNo);
    //versioning
    //app.use("/api/customers/v1.0", router);
    app.use("/api/accounts/", router);
}
