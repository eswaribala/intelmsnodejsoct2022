const express=require("express");
const bodyParser=require('body-parser');
const cors=require('cors');
const config=require('config');
const fs = require("fs");
const swaggerUi = require('swagger-ui-express');
var { buildSchema } = require('graphql');
var mongoose=require('mongoose')
//const swaggerDocument = require('./swagger.json');
const swaggerFile=require('./swagger_output.json');
const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');
const app=express();
const db = require("./dbserver");
const {graphqlHTTP} = require("express-graphql");
const Customer = db.customers;




//rest methods get,post,put,delete,patch
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
//db connection
/*

const vault = require("node-vault")({
    apiVersion: "v1",
    endpoint: "http://localhost:8200",
});


const run = async () => {

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
*/
//mongoose.connect('127.0.0.1', 'happytripdb', 27017, options);

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
//step 1
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
     customers:[Customer]
     customer(customerId: ID):Customer
  }
  
  type Customer {
   id: Int,
   name: String,
   email: String,
   address: String,
   password: String,
   phoneNo: String
}
`);


//step 2
// The root provides a resolver function for each API endpoint
var root = {
    customers: async () => {

        let customers = await Customer.find();

        return customers;

    },
    customer:async (obj) => {
        console.log(obj.customerId);
       var id=mongoose.Types.ObjectId(obj.customerId);
       console.log(id);
        let customer = await Customer.findById(id)

        return customer;

    }

};

//step3 integrate graphql with express
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

const args=process.argv;
console.log(args[2]);

const host=config.get('server.host');
//const port=config.get('server.port');
var port=args[2].toString();
//layered call
require('./routes')(app);
//external configuration

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {customCss}));
//====================================eureka configuration================================

const Eureka = require('eureka-js-client').Eureka;

const eureka = new Eureka({
    instance: {
        app: 'customerapi',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        statusPageUrl: 'http://localhost:'+port,
        port: {
            '$': port,
            '@enabled': 'true',
        },
        vipAddress: 'localhost',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        }
    },
    eureka: {
        host: 'localhost',
        port: 8761,
        servicePath: '/eureka/apps/'
    }
});
eureka.logger.level('debug');
eureka.start(function(error){
    console.log(error || 'complete');
});






 //========================================Server config=================================


app.listen(port,host,function(){
    console.log(`Listening on Port ${port}`)
})
