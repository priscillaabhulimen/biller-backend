transaction = require('functions/transaction');

const api = {};

api.handler = async event => {
  console.log(event);
  if(event.path.includes('transaction')){
    transaction.handler(event);
  }
}

module.exports = api;
