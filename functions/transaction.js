const {v4: uuidv4} = require('uuid');
const AWS = require('aws-sdk');

const transaction = {};
const data = {};

const TRANSACTION_TABLE = process.env.TRANSACTION_TABLE;

transaction.handler = async event => {
    let response = {};
    let eventBody = JSON.parse(event.body);
    try{
        if(event.httpMethod === "POST"){
            if(event.pathParameters){
                eventBody.transaction_id = event.pathParameters.id;
                response.body = JSON.stringify(await transaction.handleVendAirtime(eventBody));
                response.statusCode = response.body.statusCode;
            }
            else{
                response.body = JSON.stringify(await transaction.handleCreateTransaction(eventBody));
                response.statusCode = response.body.statusCode;
            }
        }
    } catch(e){
        response.body = JSON.stringify(e);
        response.statusCode = e.statusCode;
    }

    console.log('response', response);
    return response;
}

transaction.handleCreateTransaction = item => {
    return new Promise((resolve, reject) => {
        if(item.provider == null){
            reject({
                statusCode: 400,
                status: false,
                message: "Provider field is required",
                data: {}
            });
        }
        else if(item.amount == null){
            reject({
                statusCode: 400,
                status: false,
                message: "Amount field is required",
                data: {} 
            });
        }
        else if(isNaN(item.amount)){
            reject({
                statusCode: 400,
                status: false,
                message: "Invalid amount, please enter a valid amount",
                data: {} 
            });
        }
        else if(item.recipient == null){
            reject({
                statusCode: 400,
                status: false,
                message: "Recipient field is required",
                data: {}
            });
        }
        else{
            let date = new Date().toISOString();
            let data = {
                transaction_id : uuidv4(10),
                date: date,
                ...item
            }
            
            let documentClient = new AWS.DynamoDB.DocumentClient();

            let params = {
                TableName: TRANSACTION_TABLE,
                Item: data
            };

            documentClient.put(params, (err, result) => {
                console.log("ERROR", err);
                if(err) reject({
                    statusCode: 400,
                    status: false,
                    message: err,
                    data: {}
                });
                else resolve({
                    statusCode: 200,
                    status: true,
                    message: "Success",
                    data: data
                });
            });
        }
    });
}

transaction.handleVendAirtime = data => {
    
    return new Promise((resolve, reject) => {

        let documentClient = new AWS.DynamoDB.DocumentClient();

        let params = {
            TableName: TRANSACTION_TABLE,
            Item: {
                status: "success",
                ...data
            }
        };

        documentClient.put(params, (err, result) => {
            console.log("ERROR", err);
            if(err) reject({
                statusCode: 400,
                status: false,
                message: err,
                data: {}
            });
            else resolve({
                statusCode: 200,
                status: true,
                message: "Success",
                data: data
            });
        });
    });
}

module.exports = transaction;