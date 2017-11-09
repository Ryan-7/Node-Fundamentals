const request = require('request');
const _ = require('lodash');
const yargs = require('yargs');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'address to fetch weather for',
            string: true // Tells yargs to always parse the arugment as a string 
        }
    })
    .help() // adds the help flag, helps the person if they use --help 
    .alias('help', 'h')  // set the alias for the pre registered command "help" (it becomes registered when we call help())
    .argv; // Stores in the argv variable 

//  geocode.getAddress(encodedAddress, (error, res) => {}) this is now clean and reusable !


const encode = (argv) => {
    let encodedAddress = (encodeURIComponent(argv.a));
    geocode.getAddress(encodedAddress, (error, res) => {
        if (error) {
            console.log(error);
        } else {
            console.log(JSON.stringify(res, undefined, 4));     // Convert the JS object to JSON. For no reason apparently... 
            weather.getWeather(res.lat, res.lng, (error, res) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log(res);
                }
            })
        }
    })
}

 encode(argv);


// getAddress(`1301 lombard street philadelphia`, (res) => {
//     let stringResponse = JSON.stringify(res, undefined, 4); // arguments for stringify, response, something else no one ever uses, and the number of spaces in the JSON. 
//     // console.log(stringResponse)  The JSON.stringify function above takes the response and extracts the body (the important part) for us. 
//     // You can't parse a JSON string, with dot notation or lookking for properties.    
//     // let address = stringResponse.results[0].formatted_address; // Won't Work 

        
//     let long = res.results[0].geometry.location.lng;
//     let lat = res.results[0].geometry.location.lat;
//     console.log(long, lat)
// });

// Body is part of HTTP - HyperText Transfer Protocol
// Every time you request HTTP, like in the browser, the Body aka <body> is HTML which the browser knows how to render. 
// In this case, the body is some JSON 
// The body is the core data that comes back from the server.

// The response contains the status code, the body, headers object (also part of HTTP protocol), 