"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { dialogflow, TransactionDecision, DeliveryAddress } = require('actions-on-google');

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
  conv.ask(new TransactionDecision({
    orderOptions: {
      requestDeliveryAddress: false,
    },
    paymentOptions: {
      googleProvidedOptions: {
        prepaidCardDisallowed: false,
        supportedCardNetworks: ['VISA', 'AMEX'],
        // These will be provided by payment processor,
        // like Stripe, Braintree, Vantiv, etc.
        tokenizationParameters: {
          tokenizationType: 'PAYMENT_GATEWAY',
          parameters: { 
            'gateway': 'stripe',
            'stripe:publishableKey': (conv.sandbox ? 'pk_test_key' : 'pk_live_key'),
            'stripe:version': '2017-04-06'
          },
        },
      },
    },
  }));
});

app.intent('transaction_check_complete', (conv) => {
  const arg = conv.arguments.get('TRANSACTION_REQUIREMENTS_CHECK_RESULT');
  if (arg && arg.resultType === 'OK') {
    // Normally take the user through cart building flow
    conv.ask(`Looks like you're good to go! ` +
      `Try saying "Get Delivery Address".`);
  } else {
    conv.close('Transaction failed.');
  }
});

app.intent('delivery_address', (conv) => {
  conv.ask(new DeliveryAddress({
    addressOptions: {
      reason: 'To know where to send the order',
    },
  }));
});

app.intent('delivery_address_complete', (conv) => {
  const arg = conv.arguments.get('DELIVERY_ADDRESS_VALUE');
  if (arg.userDecision ==='ACCEPTED') {
    console.log('DELIVERY ADDRESS: ' +
    arg.location.postalAddress.addressLines[0]);
    conv.data.deliveryAddress = arg.location;
    conv.ask('Great, got your address! Now say "confirm transaction".');
  } else {
    conv.close('I failed to get your delivery address.');
  }
});

restService.post('/sample', app);

restService.listen(process.env.PORT || 8000, function () {
  console.log(`Server up and listening`);
});
