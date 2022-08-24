const {v4: uuidv4} = require('uuid');
const AWS = require('aws-sdk');

const transaction = {}

const TRANSACTION_TABLE = process.env.TRANSACTION_TABLE;

transaction.handler = async event => {
    let response = {};
    let eventBody = JSON.parse(event.body);
    try{
        if(event.httpMethod === "POST"){
            response = JSON.stringify(await transaction.handleCreateTransaction(eventBody));
        }
    } catch(e){
        response.body = JSON.stringify(e);
        response.statusCode = 500;
    }

    console.log('response', response);
    return response;
}

transaction.handleCreateTransaction = item => {
    return new Promise((resolve, reject) => {
        if(item.provider == null){
            reject("Provider is required");
        }
        else if(item.amount == null){
            reject("Amount is required");
        }
        else if(item.recipient == null){
            reject("Recipient is required");
        }
        else{
            item.transaction_id = uuidv4();
            let documentClient = new AWS.DynamoDB.DocumentClient();

            let params = {
                TableName: TRANSACTION_TABLE,
                Item: item
            };

            documentClient.put(params, (err, data) => {
                if(err) reject(err);
                else resolve(data);
            });
        }
    });
}

module.exports = transaction;