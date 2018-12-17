"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { dialogflow, TransactionRequirements } = require('actions-on-google');

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
        tokenizationParameters: {
          parameters: {
            'gateway': 'braintree',
            'braintree:sdkVersion': '1.4.0',
            'braintree:apiVersion': 'v1',
            'braintree:merchantId': 'xxxxxxxxxxx',
            'braintree:clientKey': 'sandbox_xxxxxxxxxxxxxxx',
            'braintree:authorizationFingerprint': 'sandbox_xxxxxxxxxxxxxxx',
          },
          tokenizationType: 'PAYMENT_GATEWAY',
        },
      },
    },
  }));

app.intent('transaction_check_complete', (conv) => {
  const arg = conv.arguments.get('TRANSACTION_REQUIREMENTS_CHECK_RESULT');
  if (arg && arg.resultType ==='OK') {
    // Normally take the user through cart building flow
    conv.ask(`Looks like you're good to go! ` +
      `Try saying "Get Delivery Address".`);
  } else {
    conv.close('Transaction failed.');
  }
});

restService.post('/sample', app);

restService.listen(process.env.PORT || 8000, function() {
  console.log(`Server up and listening`);
});
