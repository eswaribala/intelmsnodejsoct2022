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

app.get('/',function(req,res){
    res.send('Customer API Ready to jfvdsdskhfgsdf Rock');
})

app.post('/customers',function (req,res){
    console.log(req.body);
    res.send("Customer Data received");
})

app.listen(port,host,function(){
    console.log(`Listening on Port ${port}`)
})
