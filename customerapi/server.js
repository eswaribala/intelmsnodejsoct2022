const express=require("express");
const bodyParser=require('body-parser');
const cors=require('cors');
const config=require('config');
const fs = require("fs");
const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
const swaggerFile=require('./swagger_output.json');
const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');
const app=express();

//rest methods get,post,put,delete,patch
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
//db connection
const db = require("./dbserver");

const vault = require("node-vault")({
    apiVersion: "v1",
    endpoint: "http://127.0.0.1:8200",
});

//const roleId = process.env.ROLE_ID;
//const secretId = process.env.SECRET_ID;

const run = async () => {
    /*
    const result = await vault.approleLogin({
       // role_id: roleId,
        //secret_id: secretId,
    });
*/
    vault.token = "s.7a1lmH5XuRV3LsLbmcVE23fh"; // Add token to vault object for subsequent requests.

    const { data } = await vault.read("secret/mongodb"); // Retrieve the secret stored in previous steps.

    //const databaseName = data.data.db_name;
    const username = data.username;
    const password = data.password;

    console.log({

        username,
        password,
    });

    var obj={
        "username":username,
        "password":password,
    }
    return obj;
    //  console.log("Attempt to delete the secret");

    // await vault.delete("secret/data/mysql/webapp"); // This attempt will fail as the AppRole node-app-role doesn't have delete permissions.
};

run().then(data=>{
    console.log(data);
    const db = require("./dbserver");
    const Customer = db.customers;
    
    var options = {
        user: data.username,
        pass: data.password,
        auth: {
            authdb: 'admin'
        }
    }

//mongoose.connect('127.0.0.1', 'happytripdb', 27017, options);
    db.mongoose
        .connect(db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },options)
        .then(() => {
            console.log("Connected to the database!");
        })
        .catch(err => {
            console.log("Cannot connect to the database!", err);
            process.exit();
        });
})


const host=config.get('server.host');
const port=config.get('server.port');
//layered call
require('./routes')(app);
//external configuration

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {customCss}));

app.listen(port,host,function(){
    console.log(`Listening on Port ${port}`)
})
