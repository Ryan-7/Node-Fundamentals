
require('./config/config');
let _ = require('lodash');
let express = require('express');
let bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const cors = require('cors');


// We are requiring the entire javascript file
// but we only have access to whatever we export in the object
// therefore we can use object destructuring to grab that piece of object, which is all three of those functions attached to mongoose 

let mongoose = require('./db/mongoose').mongoose
// alternative: let {mongoose} = require('./db/mongoose);
// let mongoose = require('mongoose') // is what its really saying

const {ObjectID} = require('mongodb');

let User = require('./models/user').User;
let {Todo} = require('./models/todo');
let Song = require('./models/song').Song
let {authenticate} = require('./middleware/authenticate');

// Configure a basic server 
let app = express();
const port = process.env.PORT; // a global variable, we set this in our config file 
app.listen(port, () => {
    console.log('App has started on port 3000');
}); 

// Allow cross origin requests for local dev
app.options('*', cors()); 



// Middleware - This will parse the JSON, so we can have access to the body, etc from the request.
// Allows express to read the body and then parse that into a Json object that we can understand it
 app.use(bodyParser.json());

// ** Using Express to do our API routing and mongoose to save to database. 
// When we connect mongoose, we define which database to connect to. In our models, we define which collection to save to.

// In our REST Api's, we have the basic CRUD operations. Going to this route makes a "post" request. 
// Setup our routes. If you hit this API end point with a post request, it will console.log the body of the request. 

app.post('/todos', authenticate, (req, res) => {
    let myTodo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    myTodo.save().then((doc) => {
        res.send(doc);

    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    })
    
})



// Since the browser makes GET requests, if we visit localhost:3000/, it will say "hello", since that is what we're sending in the response.
// Will need to be authenticated to have the server serve up this webpage to you. 

app.get('/test', authenticate, (req, res) => {
    res.send("hello")
});



app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.user._id}).then((results) => {  
        res.send({results: results}); // instead of just res.send(results), we can send back an object so we can send more stuff, like a custom status code
    }).catch((err) => {
        res.status(400).send(err); // send back status of 400 and the error if there is a problem 
    })
})

 
app.get('/todos/:id', authenticate, (req, res) => {

    let id = req.params.id;

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((result) => {
        if(!result) { // Remember, mongoose will not throw an error if there is no id, it will just return null.
            return res.status(404).send('ID not found');
        }
        res.send({result: result}); // send back as an object so you can add other cool stuff to the response if needed. 
    }).catch((err) => {
        if(!ObjectID.isValid(id)) { // it will throw an error however if the id is not valid 
            res.status(400).send('The ID is not valid');
        } else {
            res.status(400).send(); // Don't send back the error, could contain sensitive information 
        }
    });
});


app.delete('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('ID not valid');
    }
    
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((doc) => {
        if (!doc) {     // setup if statement becaues null is returned if no id is found, not an error. 
            return res.status(404).send('ID not found!');
        }
        res.status(200).send({doc: doc});
    }).catch((err) => {
        res.status(400).send();
    })
})


app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']) // _.pick keeps from users adding properties or updating properties we don't want them to. 

    if(!ObjectID.isValid(id)) {
        return res.status(404).send('ID not valid') // remember, 'return' is just ends the function execution, not doing anything special
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime(); 
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: {completed: body.completed, text: body.text, completedAt: body.completedAt}}, {new: true}).then((todo) => { // {new: true} gives us back the updated object 
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo: todo});
    }).then((err) => {
        res.status(404).send();
    })
})


// Sign up 
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']); // simply creates an object and assigns it to the variable body, {email: req.body.email, password: req.body.password }

    let user = new User(body); // body = {email: 'someemail', password: 'somepass'}, just like passing in {email: req.body.email, password: req.body.password}

    User.checkForDuplicates(body.email).then(() => { // might be better to check for duplicate before the user is created with the model 
        return user.save().then(() => { // save user to database, which returns a promise. We must save it a first time so we can generate an _id for the instance, then use that for our JWT.     
            return user.generateAuthToken(); // a function is returend to us, which executes and returns a promise, then returns the token, then we return that token and act on that token with another then() 
        }).then((token) => {
            
            res.header('x-auth', token).send(user);  // prefixing a header with x- is a custom header we make, it's not a default header.
              
        })
    }).catch((err) => {
        res.status(400).send(err);
    })
})

// Authenticate is middleware that we use to modify the request object before passig it on to be used here: 
// Make a protected request

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


// Login
// Every time you login, you'll generate a new auth token which will be saved to the database and sent back as a header 

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {  // return here so we can use the catch call. call the generateAuthToken on that user we just found.
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(400).send();
    });
})

// Logout

app.delete('/users/me/token', authenticate, (req, res) => {

    User.findByIdAndUpdate(req.user._id, {$pull: {tokens: {token: req.token }} }).then((user)=> {
        res.status(200).send();
    }).catch((err) => {
        res.status(400).send();
    })
})

module.exports = {
    app: app 
}







// Build some middleware for authentication

// let authenticate = (req, res, next) => {
//     let token = req.header('x-auth');


//     User.findByToken(token).then((user) => { // if found, we have the entire user object from the database, token and all 
//         if (!user) {

//            return Promise.reject('User Not Found!')
//         }
    
//         req.user = user; // make a proprety on the request object 
//         req.token = token;  // make a property on the request object 
//         next() // since this is middleware, we need to call next to keep the code moving

//     }).catch((err) => {
//         res.status(401).send(err); 
//                                 // Don't want to call next because why would we want the get request to run after an error?
//     })
    
// };



// app.get('/users/me', (req, res) => {
//     let token = req.header('x-auth'); // grab the token from the header 
//     console.log(token)

//     User.findByToken(token).then((user) => { // Use the token to find the user, we decode the token to find the user by their original id, token value and access value 
//         if (!user) {
//            // res.status(401).send('User Not Found!')
//            return Promise.reject('User Not Found!') // this will skip any code below it and automatically run the .catch() and send the string to the err parameter 
//         }
//         res.send(user);
//     }).catch((err) => {
//         res.status(401).send(err);
//     })
// });

/*

We create a new user using the user constructor and sending it the email and password. 
This user is then saved to the database as normal, with a unique id generated by Mongoose.
Then we call the generateAuthToken() method on the instance which creates a token, re-saves the user instance to the database and returns the token for use. (save() always generates an id, which is why there's one in the token array) 
After it saves the user, we call then() again and return the token from the instance, from there we can tack on another then() call and use that token. 

*/

/*

Save the user to the database
(Run the generateAuthFunc) Then create the token, and save the user (now with the auth token) to the database
Then return the token (you can return a string, object, whatever and use the then() call on it. )
Then send the user in the response. 


*/

// app.post('/songs5', (req, res) => {
//     let mySong = new Song({
//         title: req.body.title,
//         lyrics: req.body.lyrics
//     });

//     mySong.save().then((doc) => {
//         console.log(doc)
//         res.send(doc);
//     })
// })


// // 'Typecasting' boolean or a number will not throw an error even if the type is set to String, because mongoose will cast them as strings, ' ' 

// let myTodo = new Todo({
//     text: 'Cook Dinner'
// })

// myTodo.save().then((doc) => {
//     console.log(doc);
// }).catch((err) => {
//     console.log(err);
// })



// let ryan = new User({
//     email: 'ryanb.wisc@gmail.com'
// })

// ryan.save().then((doc) => {
//     console.log(doc);
// })