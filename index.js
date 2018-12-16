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


app.intent('echo', (conv, params) => {
  conv.ask(`${params.talk}`);
});

restService.post('/sample', app);

restService.listen(process.env.PORT || 8000, function() {
  console.log(`Server up and listening`);
});
