
// A cool little backend that makes the API call and formats address parsing to make it pretty AND handles errors. 

const request = require('request');

const getAddress = (address, callback) => {
    request({url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address, json: true }, (error, response, body) => { // error, response, body are what we're getting back, when the other function callback(error, response, body)
        if (error) {
            callback("Unable to connect with Google Servers.")
        } else if (body.status === 'ZERO_RESULTS') {
            callback("Unable to find address");
        } else if (body.status === "OK") {
            callback(undefined, {
                address: body.results[0].formatted_address,
                lat: body.results[0].geometry.location.lat,
                lng: body.results[0].geometry.location.lng
            }) 
        }
    });
}

module.exports = {
    getAddress: getAddress
}