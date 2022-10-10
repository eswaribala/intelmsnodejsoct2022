const express=require("express");
const bodyParser=require('body-parser');
const cors=require('cors');

const app=express();
//rest methods get,post,put,delete,patch
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.get('/',function(req,res){
    res.send('Customer API Ready to jfvdsdskhfgsdf Rock');
})

app.post('/customers',function (req,res){
    console.log(req.body);
})

app.listen(3000,function(){
    console.log("Listening on Port 3000")
})
