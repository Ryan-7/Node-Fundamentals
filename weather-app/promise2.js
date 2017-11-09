const request = require('request');

const getAddress = () => {
    return new Promise((resolve, reject) => {
        request({url: 'https://maps.googleapis.com/maps/api/geocode/json?address=53703', json: true }, (error, response, body) => {
            if (error) {
                reject(error);  // We are telling the program to call reject under certain conditions, which means .catch will be called
            } else if (body.status === 'ZERO_RESULTS') {
                reject("Unable to find address");
            } else {
                resolve(body);
            }
        })
    })
}

getAddress().then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
})