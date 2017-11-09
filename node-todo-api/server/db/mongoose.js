let mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI); // This connects mongoose to our local database 

// mongoose.connect('mongodb://localhost:27017/TodoApp'); // This connects mongoose to our local database 

mongoose.Promise = require('bluebird'); // 3rd party Promise library for mongoose. 

module.exports = {
    mongoose
}