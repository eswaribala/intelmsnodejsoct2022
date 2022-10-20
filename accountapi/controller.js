const db = require("./dbserver");
const elasticsearch = require("elasticsearch");
const Account = db.accounts;
const log = require("log-to-file");
// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body.accountNo) {
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
//=======================================Elastic Search Engine========================================================
/*
const esClient = elasticsearch.Client({
    host: "http://localhost:9200",
})
*/
//retrieve data from database
//elastic search index name should be in lower case
exports.findAllAccounts=(req,res)=>{
  /*
    esClient.index({
        index: 'accountsinteloct2022',
        body: {
            message:"starts logging",
            currentTime: new Date()
        }
    })
        .then(response => {
            console.log({"message": "Indexing successful"})
        })
        .catch(err => {
           /*
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while reading account data'
            });

            */
       /*
            console.log( err.message || 'Some error occurred while reading account data');
        })
*/
   Account.find().then(data=>{
       log(data);
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
    Account.findById(accountNo).then(data=>{
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

const amqplib=require('amqplib');
let rabbitConnection;
let exchange = 'logs'

//step 1
amqplib.connect('amqp://localhost').then(connection => rabbitConnection = connection);

//step 2
const sendRabbitMqMessage = async (message) => {
    const channel = await rabbitConnection.createChannel();
    await channel.assertExchange(exchange , 'fanout')
    await channel.publish(exchange, '', Buffer.from(message))
}

exports.publishData=async (req, res) => {
//step 3
    const message = req.body.message;
    console.log(`Send message: '${message}'`);
    await sendRabbitMqMessage(message);
    res.send(message)

}

const { Kafka } = require("kafkajs");



exports.publishDataOnKafka=async (req, res) => {
//step 3
    const kafka = new Kafka({ brokers: ["localhost:9092"] });
    const producer = kafka.producer();
    const message = req.body.message;
    await producer.connect();

    await producer.send({
        topic: "account-notify",
        messages: [
            { value: message },
        ]
    });
    res.send(message)

}




