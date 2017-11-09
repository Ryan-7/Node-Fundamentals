// Alternative ways to use mongooose to query our data, instead of just find() as we used in the server.js file

const {ObjectID} = require('mongodb'); // use the isValid() method to check if id is valid 
const {mongoose} = require('./../server/db/mongoose'); // require the mongoose from the file as an exports, has the connection and everything already setup
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//*** this are the same methods we find on our mongoose model when querying the collection */

// let id = '59dee0d0c9d774644ad553be';

// ObjectID.isValid(id); // returns true or false if the id is valid (not necessarily found, but valid)

// if (!ObjectID.isValid(id)) {
//     console.log('ID is not valid'); 
// }

// Null or Empty array is returned if the ID is valid, but not found. Like incrementing one of the numbers, however, if we add characters...
// ..then the id is no longer a valid id and we will get real errors. 

// Todo.find({  // This query method returns an array, which may not be the most optimal, if you're just trying to find one, use findOne so you dont have to deal with the array.
//     _id: id  // Mongoose, unlike Mongo Driver, doesn't need the new ObjectID to query by ID. If ID does not exist (but is valid), it will return empty array, use error handling like if array.length > 1
// }).then((results) => {
//     console.log(results);
// })

// Todo.findOne({  // if id does not exist (but is valid), it will return null, not an error 
//     _id: id
// }).then((result) => {
//     console.log(result);
// })

// Todo.findById(id).then((result) => {    // if id does not exist (but valid), it will return null, not an error, so we must use some error handling. 
//     if (!result) {
//         return console.log('ID not found');
//     }
//     console.log(result);
// }).catch((e) => {
//     console.log(e)
// })

userId = '59d91a9127fe03103ea44774';



User.findById(userId).then((result) => {
    if (!result) {
        console.log('User not found!');
    } else {
        console.log(result);
    }
}).catch((err) => {
    if (!ObjectID.isValid(userId)) {
        console.log('Invalid ID!')
    } else {
       console.log(err);
    }
})