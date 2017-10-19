require('dotenv').config();

// const backand = require('@backand/nodejs-sdk');
// backand.init({
//     appName: '<your app name>',
//     anonymousToken: '<app anonymous token>'
// });

//exports.run = function(event, context) {
module.exports.get_rank = (event, context, cb) => {
  // README - Here is the starting point of your code.
  // Do not change the signature of backandCallback.
  // Do not exit anywhere from your code, meaning, do not use process.exit
  // Backand will take care of that for you
  // You should call the respondToBackand callback: function(err, data) { ... }

  //Make parameters.runBackandSDKDemo to true to run Backand CRUD demo.
  //To make the demo run, you need to un-comment backandCrudDemo method below.
  var awis = require('awis');

  var client = awis({
    key: process.env.key,
    secret: process.env.secret
  });
  console.log("input url: " + event.url);
  client({
    'Action': 'UrlInfo',
    'Url': event.url,
    'ResponseGroup': 'TrafficData'
  }, function (err, data) {
    if(err){
      console.log(err);
    } else{
      console.log("rank: " + data.trafficData.rank);
    }
    cb(err, data.trafficData);
  });
};
