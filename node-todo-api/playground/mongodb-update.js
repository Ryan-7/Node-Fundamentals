const {MongoClient, ObjectID} = require('mongodb'); // Using destructuring to grab the MongoClient property, this is the same code as above. 


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => { // This URL is where the DB lives, either in AWS or Heroku, etc. For now, localhost. 
    if (err) {
        return console.log('Could not connect to MongoDB Server'); // Using a return statement prevents the rest of the function from running, the below console.log won't run.
    }
    console.log('Connected to MongoDB server');

    // We must use the MongoDB update operators for updates. 
    // $set: {
    //    {completed: true}
    // }, 
    // $inc: {
    //     {age: 1}
    // }

    // We want to return the updated document, so we set returnOriginal to false. 


    // db.collection('Todos').findOneAndUpdate({_id: new ObjectID('59d6ea2c10dce28c0302b852')}, {$set: {completed: true}}, {returnOriginal: false}).then((result) => {
    //     console.log(result);
    // })

    // find one and updated takes three arguments, the query, the operators, and options 
    // what if a particular property didn't exist that we tried to update..? It simply adds the key value to the document.


    db.collection('Users').findOneAndUpdate({name: 'Ryan'}, {$set: {name: 'Ryan Burch', title: 'Mr.'}, $inc: {age: 1}}, {returnOriginal: false}).then((result) => {
        console.log(result);
    })

}); 
