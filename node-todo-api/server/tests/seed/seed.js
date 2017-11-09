const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const todos = [
    {
        text: 'first test todo',
        _id: new ObjectID(),
        completed: false,
        completedAt: 222,
        _creator: userOneId
    },
    {
        text: 'second test todo',
        _id: new ObjectID(),
        completed: true,
        completedAt: 333,
        _creator: userTwoId
    }
];

const users = [
    {   
        _id: userOneId,
        email: "user1@example.com",
        password: "userOnePass",
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, 'abc123').toString() 
        }]
    },
    {
        _id: userTwoId,
        email: "user2@example.com",
        password: "userTwoPass",
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userTwoId.toHexString(), access: 'auth'}, 'abc123').toString() 
        }]
    }
];


// We must run this every time because everytime we run this file, the ID's of the todos above change, so they would be differnet from the database. 
// Having those todos up top saves us time from having to read the database every test. 
// Middleware 

const populateTodos = (done) => { // Runs before each test case. only works if we call done();
    Todo.remove({}).then(() => { 
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    });
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]); // will not get called until all promises are resolved. Return the promise so we can tack on then() again. 

       // User.insertMany(users); Could also do this, but then we're not using our model validation. 

    }).then(() => {
        done();
    });
};

module.exports = {
    todos: todos,
    populateTodos: populateTodos,
    users: users,
    populateUsers: populateUsers
}