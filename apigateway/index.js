const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 4000;

const {
  ACCOUNTS_API_URL,
  CUSTOMER_API_URL,
} = require('./URLs');

const optionsCustomers = {
  target: CUSTOMER_API_URL,
  changeOrigin: true, 
  logger: console,
};

const optionsAccounts = {
  target: ACCOUNTS_API_URL,
  changeOrigin: true, 
  logger: console,
};

const customersProxy = createProxyMiddleware(optionsCustomers);
const accountsProxy = createProxyMiddleware(optionsAccounts);

app.get('/', (req, res)=> res.send('Gateway API Ready!!!!'));

app.get('/accounts', accountsProxy);
app.get('/customers', customersProxy);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
