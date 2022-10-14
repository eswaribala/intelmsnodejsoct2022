const controller = require("./controller.js");
const db = require("./dbserver");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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


    router.post("/register", async (req, res) => {
        let encryptedPassword;
        try {
            // Get user input
            const {userName, password, email} = req.body;

            // Validate user input
            if (!(email && password && userName)) {
                res.status(400).send("All input is required");
            }

            // check if user already exist
            // Validate if user exist in our database
            const oldUser = await User.findOne({email});

            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }

            //Encrypt user password
            encryptedPassword = await bcrypt.hash(password, 10);

            // Create user in our database
            const user = await User.create({
                userName,
                email: email.toLowerCase(), // sanitize: convert email to lowercase
                password: encryptedPassword,
            });

            // Create token
            const token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            // save user token
            user.token = token;

            // return new user
            res.status(201).json(user);
        } catch (err) {
            console.log(err);
        }
    });


    //versioning
    //app.use("/api/customers/v1.0", router);
    app.use("/api/accounts/", router);
}
