const express=require("express");
const bodyParser=require('body-parser');
const cors=require('cors');
const config=require('config');
const app=express();
//rest methods get,post,put,delete,patch
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

const host=config.get('server.host');
const port=config.get('server.port');

require('./routes')(app);
//external configuration
app.listen(port,host,function(){
    console.log(`Listening on Port ${port}`)
})
