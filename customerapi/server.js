const express=require("express");
const app=express();
//rest methods get,post,put,delete,patch

app.get('/',function(req,res){
    res.send('Customer API Ready');
})


app.listen(3000,function(){
    console.log("Listening on Port 3000")
})
