const {User} = require('./../models/user');

let authenticate = (req, res, next) => {
    let token = req.header('x-auth');


    User.findByToken(token).then((user) => {
        if (!user) {

           return Promise.reject('Cannot Authenticate!')
        }
    
        req.user = user; // make a proprety on the request object 
        req.token = token;  // make a property on the request object 
        next() // since this is middleware, we need to call next to keep the code moving

    }).catch((err) => {
        res.status(401).send(); // Can put a custom error response here 
                                // Don't want to call next because why would we want the get request to run after an error?
    })
    
};

module.exports = {
    authenticate
}

// Middleware interecepts the incoming request (req) and thats where we can add additional properties we want
// before passing it onto the get(/users/me). This controller route can now use the modified req object.  