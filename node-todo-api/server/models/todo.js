// create a model for a Todo document, what properties it has
// my example: https://jsfiddle.net/qbyk0d1j/2/

// constructor function, it fulfills the myTodo variable value for us depending on the arguments we send it.
// The constructor just gives us the same oject back, it looks redundant, but, the point of the constructor is the cool stuff it can do for us
// varify values, varify types, assigns an id, set default values, set min or max on number, set length max/min for strings, gives us methods to do CRUD operations on db.


// This is a utility cool function, it takes an object and sets up a constructor function for any 'new Todo' to match. The first argument is the collection name.
// Trim will remove any leading or trailing white space

let mongoose = require('mongoose'); // No need to load in the mongoose file, just load in the library 

// I find it confusing that you use the function below to construct objects and to also talk to the collection.


let Todo = mongoose.model('Todo', { // 'Todo' is the collection name, mongoose is "smart" and lowercases it and adds an 's' in the database
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },

    _creator: {
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    }
});

module.exports = {
    Todo: Todo
}