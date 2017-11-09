const yargs = require('yargs');
const axios = require('axios');


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


let encodedAddress = encodeURIComponent(argv.address);
let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`

axios.get(geocodeUrl).then((response) => {  // Axios automatically parses our request into JSON. It also returns a promise, Axios will call resolve or reject for us depending if the request was successful or not. 
    if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to find this address');  // Throwing an error will skip the other code and go straight to the catch function. 
    } else {
        let lat = response.data.results[0].geometry.lat;
        let lng = response.data.results[0].geometry.lng;
        const weatherUrl = `https://api.darksky.net/forecast/0917c27ff4774d31dbf1561584d85713/${lat},${lng}`
        console.log(response.data.results[0].formatted_address);
        return axios.get(weatherUrl);
    }
}).then((response) => {
    console.log(response)
}).catch((err) => {
    if (err.code === 'ENOTFOUND') {         // Look at the response so we can take care of errors nicely. 
        console.log('Unable to connect to API server')
    } else {
        console.log(err.message);
    }
})
