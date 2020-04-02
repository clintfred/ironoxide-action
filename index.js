const core = require('@actions/core');
const exec = require('@actions/exec');
const wait = require('./wait');
var http = require('follow-redirects').http;
const fs = require('fs');
// var downloadReleases = require('dl-github-releases');

// most @actions toolkit packages have async methods
async function run() {
  try { 

    let myOutput = '';
    let myError = '';
    
    const options = {};
    options.listeners = {
      stdout: (data) => {
        myOutput += data.toString();
      },
      stderr: (data) => {
        myError += data.toString();
      }
    };
    // options.cwd = './lib';

    var download = function(url, dest) {
      var file = fs.createWriteStream(dest);
      http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
          file.close();
        });
      });
    }

    let f = download("http://github.com/IronCoreLabs/ironoxide-cli/releases/download/test/ironoxide-cli", "ironoxide-cli");
    // let f = download("https://github-production-release-asset-2e65be.s3.amazonaws.com/245474850/ec181700-74f6-11ea-9ba9-04d5ef12934b?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20200402%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20200402T220144Z&X-Amz-Expires=300&X-Amz-Signature=57932997b81618d29d4c329cbdd83b662834792b14cc49dd3541d70aa1d4031d&X-Amz-SignedHeaders=host&actor_id=0&response-content-disposition=attachment%3B%20filename%3Dironoxide-cli&response-content-type=application%2Foctet-stream", "ironoxide-cli");
    console.log(f);
    // const file = fs.createWriteStream("ironoxide-cli");
    fs.chmodSync("./ironoxide-cli", "755");
    // const request = http.get("http://github.com/IronCoreLabs/ironoxide-cli/releases/download/test/ironoxide-cli", function(response) {
      // response.pipe(file);
    // });
    let test = fs.statSync('./ironoxide-cli');
    console.log(test);
    await exec.exec('./ironoxide-cli', [], options);
    console.log("My output");
    console.log(myOutput);
    console.log(myError);
    const ms = core.getInput('milliseconds');
    console.log(`Waaiting ${ms} milliseconds ...`)

    core.debug((new Date()).toTimeString())
    await wait(parseInt(ms));
    core.debug((new Date()).toTimeString())

    core.setOutput('time', new Date().toTimeString());
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
