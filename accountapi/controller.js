const db = require("./dbserver");
const Account = db.accounts;

// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body.id) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Account
    const account = new Account({
        accountNo: req.body.accountNo,
        dateOfOpening: req.body.dateOfOpening,
        accountType: req.body.accountType,
        balance: req.body.balance,
        roi: req.body.roi

    });

    // Save Account in the database
    account
        .save(account)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Account."
            });
        });
};

//retrieve data from database
exports.findAllAccounts=(req,res)=>{
   Account.find().then(data=>{
       res.send(data);
    }).catch(err=>{
       res.status(500).send({
           message:
            err.message || 'Some error occurred while reading account data'
       });
   });
}
exports.findByAccountNo=(req,res)=>{
    const accountNo=req.params.accountNo;
    Customer.findById(accountNo).then(data=>{
        if(!data){
            res.status(404).send({
                message:
                    data.message || 'account data not found'
            })
        }
        else
         res.send(data);
    }).catch(err=>{
        res.status(500).send({
            message:
                err.message || 'Some error occurred while reading account data'
        });
    });
}



//update
exports.updateAccount = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    const accountNo=req.params.accountNo;
    Account.findByIdAndUpdate(accountNo,req.body).then(data=>{
        if(!data){
            res.status(404).send({
                message:
                    data.message || 'account data not found and not updated'
            })
        }
        else
        {
            res.send(`Account updated for ${accountNo}`)
        }
    }).catch(err=>{

        res.status(500).send({
            message:
                err.message || 'Some error occurred while reading account data'
        });
    })


};

exports.deleteByAccountNo=(req,res)=>{
    const accountNo=req.params.accountNo;
    Account.findByIdAndDelete(accountNo)
        .then(data=>{
        if(!data){
            res.status(404).send(`Account ${accountNo} not found`)
        }
        else
            res.send(`Account ${id} deleted successfully`);
    }).catch(err=>{
        res.status(500).send({
            message:
                err.message || 'Some error occurred while reading account data'
        });
    });
}
