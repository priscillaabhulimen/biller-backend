const AWS = require('aws-sdk');

const transaction = {}

const TRANSACTION_TABLE = process.env.TRANSACTION_TABLE;

transaction.handler = async event => {
    console.log('event', event);
}

module.exports = transaction;