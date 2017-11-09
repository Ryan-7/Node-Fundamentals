const {ObjectID} = require('mongodb'); // use the isValid() method to check if id is valid 

const {mongoose} = require('./../server/db/mongoose'); // require the mongoose from the file as an exports, has the connection and everything already setup
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/* Use this as a reference for the methods we find on our mongoose model */

Todo.remove({}).then((result) => { // sending an empty object removes everything, otherwise specify by a property, do NOT get anything back
    console.log(result);
})

Todo.findOneAndRemove({}).then((doc) => {  // removes the first one it finds that matches, but also get that information back. 

})

Tood.findByIdAndRemove(id).then((doc) => {  // removes by id, and returns the doc (could have an undo button... )

})

