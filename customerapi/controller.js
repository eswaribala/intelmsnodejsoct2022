const db = require("./dbserver");
const Customer = db.customers;

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
