console.log("The File Writer");


const fs = require('fs');
const yargs = require('yargs');
const logic = require("./logic");

const argv = (yargs.argv); // parses all the arguments for us
const command = argv._[0];

if (command === 'note') {
    fs.writeFile(argv.name + '.txt', argv.body, () => {
        console.log("Done!");
    });
}

