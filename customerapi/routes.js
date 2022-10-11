//layered architecture
module.exports=function(app){
    app.get('/',function(req,res){
        res.send('Customer API Ready to jfvdsdskhfgsdf Rock');
    })

    app.post('/customers',function (req,res){
        console.log(req.body);
        //access the model and save the data

        res.send("Customer Data received");
    })

}
