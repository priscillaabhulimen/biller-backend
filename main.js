const transaction = require('functions/transaction');

const api = {};

api.handler = async event => {
  let response = {};
  
  if(event.path.includes('transaction')){
    response = transaction.handler(event);
  }

  return response;
}

module.exports = api;
