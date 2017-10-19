const backand = require('@backand/nodejs-sdk');
const exec = require('child_process').exec;
const crypto = require('crypto');
const fs = require('fs');
const validUrl = require('valid-url');

backand.init({
    appName: 'rankitfinal',
    anonymousToken: 'cafe5aea-90a1-42aa-8816-b20d6212bb88'
});

module.exports.screenshot = (event, context, cb) => {
  // README - Here is the starting point of your code.
  // Do not change the signature of backandCallback.
  // Do not exit anywhere from your code, meaning, do not use process.exit
  // Backand will take care of that for you
  // You should call the respondToBackand callback: function(err, data) { ... }

  //ToDo: need to install phantomjs for linux and mac and copy it under the ./phantomsjs folder
  //download from: http://phantomjs.org/download.html

  // overall constants
  const screenWidth = 1280;
  const screenHeight = 1024;
  const timeout = 30000;

  console.log(event);
  const targetUrl = event.query.url;

  // check if the given url is valid
  if (!validUrl.isUri(targetUrl)) {
    cb(`422, please provide a valid url, not: ${targetUrl}`);
    return false;
  }

  //const targetBucket = event.stageVariables.bucketName;
  const fileName = crypto.createHash('md5').update(targetUrl).digest('hex');

  // build the cmd for phantom to render the url
  var cmd = null;
  if(process.platform == "darwin"){ //mac os
    cmd = `./phantomjs/phantomjs_osx --debug=no --ignore-ssl-errors=true ./phantomjs/screenshot.js ${targetUrl} /tmp/${fileName}.png ${screenWidth} ${screenHeight} ${timeout}`;
  } else { 
    cmd = `./phantomjs/phantomjs_linux-x86_64 --debug=no --ignore-ssl-errors=true ./phantomjs/screenshot.js ${targetUrl} /tmp/${fileName}.png ${screenWidth} ${screenHeight} ${timeout}`; // eslint-disable-line max-len
  }
  console.log(cmd);

  // run the phantomjs command
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      // the command failed (non-zero), fail the entire call
      console.warn(`exec error: ${error}`, stdout, stderr);
      cb(`422, please try again ${error}`,null);
    } else {
      // snapshotting succeeded, let's upload to S3
      // read the file into buffer (perhaps make this async?)
      const fileBuffer = fs.readFileSync(`/tmp/${fileName}.png`);

      // convert binary data to base64 encoded string
      const filedata = new Buffer(fileBuffer).toString('base64');

      backand.file.upload("_root", "files", fileName, filedata)
        .then(function (response) {
          console.log(response.data.url);
          cb(null, {fileUrl: response.data.url});
        })
        .catch(function(error) { 
          cb(error);
        })
    }
  });

};

