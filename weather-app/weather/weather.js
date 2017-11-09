const request = require('request');

const getWeather = (lat, lng, callback) => {

    request({url: `https://api.darksky.net/forecast/0917c27ff4774d31dbf1561584d85713/${lat},${lng}`, json: true}, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            callback(undefined, body.currently.temperature);
        } else {
            callback("Unable to fetch weather");
        }
    })

}

module.exports.getWeather = getWeather;