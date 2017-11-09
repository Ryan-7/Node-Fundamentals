// const MongoClient = require('mongodb').MongoClient;  // Installed MongoDB Node.js driver so we can connect to the Mongo Database using Node.js

const {MongoClient, ObjectID} = require('mongodb'); // Using destructuring to grab the MongoClient property, this is the same code as above. 

let obj = new ObjectID(); // create a new instance of ObjectID. Probably some constructor function that generates that unique id. 
// let obj = new (require('mongodb').ObjectID) ^^ also the same. 
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => { // This URL is where the DB lives, either in AWS or Heroku, etc. For now, localhost. 
    if (err) {
        return console.log('Could not connect to MongoDB Server'); // Using a return statement prevents the rest of the function from running, the below console.log won't run.
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({ // Two arguments, one is an object, the second is a callback function 
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //        return console.log('Unable to Insert todo', err) // also pass the actually error object
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2)) // ops stores all of the docs that are inserted 
    // })


    db.collection('Users').insertOne({ // **** Notice *** We are using the 'db' object from above, we received the db back from a callback. 
      name: 'Ryan',
      age: 28,
      location: 'Madison'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user', err)
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
        console.log(result.ops[0]._id.getTimestamp());     // remember results.ops gives what documents have been inserted, grabbing first one [0] ane extracting the time from the built in time stamp in the id
    })

    db.close(); // This closes the connection with the mongodb server.
}); 

// mongodb:// is the mongo protocol for connecting. 