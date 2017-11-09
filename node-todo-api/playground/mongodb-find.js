const {MongoClient, ObjectID} = require('mongodb'); // Using destructuring to grab the MongoClient property, this is the same code as above. 

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => { // This URL is where the DB lives, either in AWS or Heroku, etc. For now, localhost. 
    if (err) {
        return console.log('Could not connect to MongoDB Server'); // Using a return statement prevents the rest of the function from running, the below console.log won't run.
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').find().toArray().then((res) => { // Fetch everything in our collection
    //     console.log(JSON.stringify(res, undefined, 2));
    // }).catch((err) => {
    //     console.log('Unable to fetch todos', err)
    // })


    db.collection('Users').find({name: 'Ryan'}).toArray().then((res) => { // Inside of find() is where we put our Query. 
        console.log(JSON.stringify(res, undefined, 2));
    }).catch((err) => {
        console.log('Unable to fetch todos', err)
    })

    
    // db.collection('Todos').find({
    //     _id: new ObjectID('59d6cad010dce28c0302b2c1') // Looking for the document with this id, must use the ObjectID constructor function 
    // }).toArray().then((res) => { // Inside of find() is where we put our Query. 
    //     console.log(JSON.stringify(res, undefined, 2));
    // }).catch((err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    // db.collection('Todos').find().count().then((res) => { // Counts the number of documents in our collection 
    //     console.log(res);
    // }).catch((err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    
}); 
