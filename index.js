const core = require('@actions/core');
const exec = require('@actions/exec');
const wait = require('./wait');


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
    options.cwd = './lib';

    await exec.exec('ls', [], options);
    console.log("My output");
    console.log(myOutput);
    const ms = core.getInput('milliseconds');
    console.log(`Waiting ${ms} milliseconds ...`)

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
