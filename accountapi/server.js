const tracer = require("./tracing")("account-service");
const express=require("express");
const bodyParser=require('body-parser');
const cors=require('cors');
const config=require('config');
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config(`${process.env.SECRET_KEY}`);
//db connection
const db = require("./dbserver");
const User = db.users;
const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
const swaggerFile=require('./swagger_output.json');
const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');
const app=express();

//rest methods get,post,put,delete,patch
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const elasticsearch = require("elasticsearch");

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });
app.post("/register", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
           //console.log(token);
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
app.get("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});
/*
// This should be the last route else any after it won't work
app.use("*", (req, res) => {
    res.status(404).json({
        success: "false",
        message: "Page not found",
        error: {
            statusCode: 404,
            message: "You reached a route that is not defined on this server",
        },
    });
});
 */



const host=config.get('server.host');
const port=config.get('server.port');
//layered call
require('./routes')(app);
//external configuration
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {customCss}));

app.listen(port,host,function(){
    console.log(`Listening on Port ${port}`)
})
