const core = require('@actions/core');
const exec = require('@actions/exec');
const wait = require('./wait');
const http = require('http');
const fs = require('fs');

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

    
    const file = fs.createWriteStream("ironoxide-cli");
    fs.chmodSync("./ironoxide-cli", "755");
    const request = http.get("http://github.com/IronCoreLabs/ironoxide-cli/releases/download/test/ironoxide-cli", function(response) {
      response.pipe(file);
    });
    test = fs.statSync('./ironoxide-cli');
    console.log(test);
    exec.exec('./ironoxide-cli', [], options);
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
