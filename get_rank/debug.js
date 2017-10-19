var util = require('util');
var getRank = require('./index.js').get_rank;

var events = require('./payload.json');

getRank(events, {}, function (error, result) {
  if (!error) {
    console.log("success: ", util.format("%j", result));
    process.exit(0);
  }
  else {
    console.log(error);
    process.exit(1);
  }
});

