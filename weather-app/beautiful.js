const request = require('request');

// Also a good example of callback hell. 

const getAddress = (address, callback) => {
    request({url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address, json: true }, (error, response, body) => { // error, response, body are what we're getting back, when the other function callback(error, response, body). NOT SENDING ANYTHING HERE, THIS IS WHERE WE GET BACK THE ARGUMENTS FROM THE CALLBACK
                                                                                                        // <- ^^ This is the callback
        try {
            console.log(response);
        }
        catch (error) {
            console.log(error);
        }

        // if (error) { // What this is saying is, if error is truthy, then do something. We always get error back, but its null if no error. 

        // }
        // callback(body);
    });
}


getAddress(`1301 lombard street philadelphia`, (res) => {
    console.log(JSON.stringify(res, undefined, 4));
});



// whats going on on the backend of the request function probably looks like this:

function request(addressObject, callback) {
    let address = addressObject.url; 
    let json = addressObject.json;
    // Hit the database to retrieve address
    // Use backend to parse data before returning 
    let response = allStuffCombinedObject;
    let error = thisResultOftheDatabaseCall;
    let body = imNotSure;

    callback(response, error, body);

}