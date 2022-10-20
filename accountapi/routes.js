const controller = require("./controller.js");
const db = require("./dbserver");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth=require('./auth')
const User = db.users;
module.exports = app => {
    const controller = require("./controller.js");
    var router = require("express").Router();
    // Create a new Account
    router.post("/", controller.create);
    //Retrieve customers data
    router.get("/",controller.findAllAccounts);
   //Retrieve customer by id
    //path param
    router.get("/:accountNo",controller.findByAccountNo);


    //path param
    router.put("/:accountNo",controller.updateAccount);

    router.delete("/:accountNo",controller.deleteByAccountNo);

    router.post("/publish",controller.publishData);
    router.post("/publishkafka",controller.publishDataOnKafka);

    //versioning
    //app.use("/api/customers/v1.0", router);
    app.use("/api/accounts/", router);
}
