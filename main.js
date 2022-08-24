import {transaction} from 'transaction';

const api = {};

api.handler = async event => {
  if(event.path.includes('transaction')){
    transaction.handler(event);
  }
}

module.exports = api;
