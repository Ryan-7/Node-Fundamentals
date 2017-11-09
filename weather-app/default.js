const yargs = require('yargs');
const axios = require('axios');
const fs = require('fs');

const argv = yargs
    .options({
        address: {
            demand: false,
            alias: 'a',
            describe: 'address to fetch weather for',
            string: true // Tells yargs to always parse the arugment as a string 
        },
        home: {
            demand: false,
            alias: 'homeAddress',
            describe: 'the default address'
        },
        setDefault: {
            demand: false,
            alias: 's',
            describe: 'set default address',
            string: true
        }
    })
    .help() // adds the help flag, helps the person if they use --help 
    .alias('help', 'h')  // set the alias for the pre registered command "help" (it becomes registered when we call help())
    .argv; // Stores in the argv variable 



const app = (address) => {

    let encodedAddress = encodeURIComponent(address);
    let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`
    
    axios.get(geocodeUrl).then((response) => {  // Axios automatically parses our request into JSON. It also returns a promise, Axios will call resolve or reject for us depending if the request was successful or not. 
        if (response.data.status === 'ZERO_RESULTS') {
            throw new Error('Unable to find this address');  // Throwing an error will skip the other code and go straight to the catch function. 
        } else {
            let lat = response.data.results[0].geometry.location.lat;
            let lng = response.data.results[0].geometry.location.lng;
            const weatherUrl = `https://api.darksky.net/forecast/3892a11e9865045d84ea3f53534b4aac/${lat},${lng}`
            console.log(`You searched for: ${response.data.results[0].formatted_address}`);
            return axios.get(weatherUrl);
        }
    }).then((response) => {
        console.log(`The current temperature is: ${response.data.currently.apparentTemperature}`)
    }).catch((err) => {
        if (err.code === 'ENOTFOUND') {         // Look at the response so we can take care of errors nicely. 
            console.log('Unable to connect to API server')
        } else {
            console.log(err.message);
        }
    })
    
}

if (argv.setDefault) {
    let defaultAddress = {
        address: argv.setDefault
    }
    fs.writeFileSync('defaultAddress.json', JSON.stringify(defaultAddress));
    console.log(`Your home address has been set to: ${defaultAddress.address} Access by using '-home'`);

} else if (argv.home) {

    let readAddress = fs.readFileSync('defaultAddress.json');
    let parsedAddress = JSON.parse(readAddress);
    app(parsedAddress.address);

} else if (argv.address) {
    app(argv.address);
} else {
    console.log("error")
}

