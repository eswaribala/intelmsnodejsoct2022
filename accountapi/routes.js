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

    router.post("/login", async (req, res) => {
        try {
            // Get user input
            const { email, password } = req.body;

            // Validate user input
            if (!(email && password)) {
                res.status(400).send("All input is required");
            }
            // Validate if user exist in our database
            const user = await User.findOne({ email });
            console.log(user.password);
            //if (user && (await bcrypt.compare(password, user.password))) {
            if (user && (password, user.password)) {
                // Create token
                const token = jwt.sign(
                    { user_id: user._id, email },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );

                // save user token
                user.token = token;

                // user
                res.status(200).json(user);
            }

            res.status(400).send("Invalid Credentials");
        } catch (err) {
            console.log(err);
        }
    });
//secured endpoint
    router.get("/welcome", auth, (req, res) => {
        res.status(200).send("Welcome 🙌 ");
    });

// This should be the last route else any after it won't work
    router.use("*", (req, res) => {
        res.status(404).json({
            success: "false",
            message: "Page not found",
            error: {
                statusCode: 404,
                message: "You reached a route that is not defined on this server",
            },
        });
    });

    //versioning
    //app.use("/api/customers/v1.0", router);
    app.use("/api/accounts/", router);
}
