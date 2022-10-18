const db = require("./dbserver");
const Customer = db.customers;
const axios=require('axios')
const config=require('config')
//const axiosRetry = require("axios-retry");

const serviceUrl=config.get('service.accountServiceUrl');

// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body.id) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Customer
    const customer = new Customer({
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        password: req.body.password,
        phoneNo: req.body.phoneNo
    });

    // Save Customer in the database
    customer
        .save(customer)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Customer."
            });
        });
};

//retrieve data from database
exports.findAllCustomers=(req,res)=>{
   Customer.find().then(data=>{
       res.send(data);
    }).catch(err=>{
       res.status(500).send({
           message:
            err.message || 'Some error occurred while reading customer data'
       });
   });
}
exports.findByCustomerId=(req,res)=>{
    const id=req.params.id;
    Customer.findById(id).then(data=>{
        if(!data){
            res.status(404).send({
                message:
                    data.message || 'customer data not found'
            })
        }
        else
         res.send(data);
    }).catch(err=>{
        res.status(500).send({
            message:
                err.message || 'Some error occurred while reading customer data'
        });
    });
}


exports.findByCustomerName=(req,res)=>{
    const nameData=req.params.name;
    Customer.findOne({'name':nameData})
        .then(data=>{
        if(!data){
            res.status(404).send({
                message:
                    data.message || 'customer data not found'
            })
        }
        else
            res.send(data);
    }).catch(err=>{
        res.status(500).send({
            message:
                err.message || 'Some error occurred while reading customer data'
        });
    });
}

//update
exports.updateCustomer = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    const id=req.params.id;
    Customer.findByIdAndUpdate(id,req.body).then(data=>{
        if(!data){
            res.status(404).send({
                message:
                    data.message || 'customer data not found and not updated'
            })
        }
        else
        {
            res.send(`Customer updated for ${id}`)
        }
    }).catch(err=>{

        res.status(500).send({
            message:
                err.message || 'Some error occurred while reading customer data'
        });
    })


};

exports.deleteByCustomerId=(req,res)=>{
    const id=req.params.id;
    Customer.findByIdAndDelete(id)
        .then(data=>{
        if(!data){
            res.status(404).send(`Customer ${id} not found`)
        }
        else
            res.send(`Customer ${id} deleted successfully`);
    }).catch(err=>{
        res.status(500).send({
            message:
                err.message || 'Some error occurred while reading customer data'
        });
    });
}
//retry and circuit breaker-- > pending

require('es6-promise').polyfill();

var originalFetch = require('isomorphic-fetch');
var fetch = require('fetch-retry')(originalFetch);

exports.getByAccountNo=(req,res)=>{
    console.log(req.params.accountNo);
    console.log(serviceUrl)

    /*
  axios.get(serviceUrl+ "/"+req.params.accountNo ).then(response => {
        console.log(response.data);
       // res.send(response.data)
      res.send(response.data);
    }).catch(error => {
        //res.send(error);
       res.send(error);
    });
*/
fetch(serviceUrl+ "/"+req.params.accountNo, {
        retries: 3,
        retryDelay: 1000,
    retryOn: async function(attempt, error, response) {
        // retry on any network error, or 4xx or 5xx status codes
        if (attempt > 3) return false;

        if (error !== null || response.status >= 400) {
            console.log(`retrying, attempt number ${attempt + 1}`);
            return true;
        }
    }
    })
        .then(function(response) {
            console.log("retrying");
            return response.json();
        })
        .then(function(json) {
            // do something with the result
            console.log(json);
            res.send(json);
        });


}





