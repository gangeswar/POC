"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { dialogflow, TransactionRequirements, DeliveryAddress } = require('actions-on-google');

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
        // These will be provided by payment processor,
        // like Stripe, Braintree, Vantiv, etc.
        tokenizationParameters: {
          parameters: {
            'gateway': 'braintree',
            'braintree:sdkVersion': '1.4.0',
            'braintree:apiVersion': 'v1',
            'braintree:merchantId': '53hw3zycz8q353gn',
            'braintree:clientKey': 'MIIBCgKCAQEAqe+BbqpHWkHTP7Y2SW77GwlQ9tcZ3UID3XKk755gC5kgBPZGSPMtjr1rDTmXOP4YqIJBOIj+VnYtZ/JLE2FW+LqUpfMM0MgY1WeVZ+JXhzx/MjGAq8/CYqAx2zDpxundFwr29UPF/0JvyfKPUNg5ZSq0E5Zpsn3FNG3qgqvUZiJQ6VRsUqdP+QJUwuPlqVUO2ZctMkCSXo15QbkzWLkaYcdGkTcbVxuMIO6rMXQcHM09vOsVPb1jTeuSIxbaCdubXhxLM7DlRpyyV2m/bnI1PnRLQ3crY12slvRMRLKGC1NcsWye6Pa2xdtO4MWOthQ+ZuI/LjFyf9vcHffL9q5w2QIDAQAB',
          },
          tokenizationType: 'PAYMENT_GATEWAY',
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
