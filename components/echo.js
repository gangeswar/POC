const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  var speech =
    req.body.result &&
      req.body.result.parameters &&
      req.body.result.parameters.echoText
      ? req.body.result.parameters.echoText
      : "Seems like some problem. Speak again.";
  res.json({
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });
});

module.exports = router;
