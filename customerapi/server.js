const express=require("express");
const bodyParser=require('body-parser');
const cors=require('cors');
const config=require('config');
const app=express();
//rest methods get,post,put,delete,patch
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
//db connection
const db = require("./dbserver");
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

const host=config.get('server.host');
const port=config.get('server.port');
//layered call
require('./routes')(app);
//external configuration
app.listen(port,host,function(){
    console.log(`Listening on Port ${port}`)
})
