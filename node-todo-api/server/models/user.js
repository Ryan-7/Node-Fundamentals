const mongoose = require('mongoose'); // No need to load in the mongoose file, just load in the library 
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// Mongoose middleware lets you run certain code before/after certain events, like before updating a model (so we can hash the password before sending it to the model)

// We need to structure it this way so we can tack on custom methods to the User

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{val} is not a valid email' 
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]  
}); 


// This middleware is called before the user gets saved to the database, it actually gets saved to the DB after we call next();
// We want access to the user instance, we use 'this' to reference it 

UserSchema.pre('save', function(next) {

    if (this.isModified('password')) {  // Only want to hash the password if it was modified (built in method) otherwise we would hash a hash.
        bcrypt.genSalt(10, (err, salt) => { 
            bcrypt.hash(this.password, salt, (err, hash) => { 
                this.password = hash;
                next(); // call next() and not below... 
            });
        });
        
    } else {
        next();
    }
        // can't call next() right here because the hashing is asynchronous, next() and subsequently save() would run before the hashing is completed. 
})

 // This is an object, where we can tack on any methods we like, gives us access to the individual document. 
 // Just like each individual document has methods like save(), etc. 
 // It's called an instance method, because we are creating an instance of the model, just one document, or 'user' 

 // The model has methods on it to interact with the collection, like findById, findOneAndRemove, etc. 
 // The individual document also has methods, like save(), now we're going to add our custom ones

 // https://jsfiddle.net/4mLq3w0x/6/

UserSchema.methods.generateAuthToken = function() {  // use a regular function because we do want to bind to 'this'. Just attaching a method to this object.


    let access = 'auth';
    let token = jwt.sign({_id: this._id.toHexString(), access: access}, 'abc123').toString();

    this.tokens = [];
    this.tokens.push({token: token, access: access});  // push to the EMPTY tokens (empty by default) array on the individual document instance. tokens = [{token: token, access: access}]
    
    return this.save().then(() => {  // simply returning a function, we can use then() on functions, strings, objects, etc.
        return token;                
    })

}

// toJSON is a method that already exists, it determines what is sent back when a Mongoose model is converted into a JSON value.
// We are going to override that method, so we don't return sensitive information, using lodash's pick method to 'pick' the properties we want to return.
// Called everytime we send a res() with express 
UserSchema.methods.toJSON = function() {
    let userObject = this.toObject() // converts our mongoose variable into a JSON object 

    return _.pick(userObject, ['_id', 'email']);
}

// By accessing .statics, these will be turned into Model methods. Think of this being attached to the User Collection, not a User instance. 

UserSchema.statics.findByToken = function(token) {
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc123'); // by decoding the id, we can get what made it, we need the user id off of it to help our query 
        console.log(decoded); // id_: , auth: 'auth', and the time stamp 
    } catch (e) {
        // return new Promise((resolve, reject) => {  // will return new promise, instead of the promise below "this.findOne"
        //     reject();
        // })
        return Promise.reject('Authentication Failed') // this will stop the rest of the function and go immediately to catch()
    }

// Decode the token, pull off the id from the user instance, and the token and the auth string 
// Quotes required when you have a dot in the value (querying nested data)

// this is referring to 'Todo' -- the Todo collection / model
    return this.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

// Given the email and password from the client side
// Look up the user by email,
// Then compare the given password to the hashed password in the database 

UserSchema.statics.findByCredentials = function(email, password) {


    return this.findOne({
        email: email
    }).then((user) => {
        if (!user) {
            return Promise.reject('User Not found!');
        }
        
        return new Promise((resolve, reject) => {   // bcrypt doesn't support promises, only callbacks, let's wrap it in a promise 
            bcrypt.compare(password, user.password, (err, res) => { //bcrypt returns true or false if the password matches 
                if (res) {
                    resolve(user) // return the user so we can use that instance to generate an auth token 
                } else {
                    reject();
                }
            });
        });

    });
}

UserSchema.statics.checkForDuplicates = function(email) {

    return this.findOne({
        email: email
    }).then((user) => {
        if (user) {
            return Promise.reject('Email already taken!')
        }
    })
};



let User = mongoose.model('User', UserSchema)


module.exports = {
    User: User
}
