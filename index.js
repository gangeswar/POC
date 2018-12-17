"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { dialogflow } = require('actions-on-google');

const restService = express();
const app = dialogflow();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

app.intent('echo', (conv) => {
  conv.ask(`${params.talk}`);
});

app.intent('transaction_check_google', (conv) => {
  conv.ask(new TransactionRequirements({
    orderOptions: {
      requestDeliveryAddress: false,
    },
    paymentOptions: {
      googleProvidedOptions: {
        prepaidCardDisallowed: false,
        supportedCardNetworks: ['VISA', 'AMEX'],
        tokenizationParameters: {},
      },
    },
  }));
});

restService.post('/sample', app);

restService.listen(process.env.PORT || 8000, function() {
  console.log(`Server up and listening`);
});
