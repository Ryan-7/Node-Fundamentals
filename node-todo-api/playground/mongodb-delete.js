const {MongoClient, ObjectID} = require('mongodb'); // Using destructuring to grab the MongoClient property, this is the same code as above. 


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => { // This URL is where the DB lives, either in AWS or Heroku, etc. For now, localhost. 
    if (err) {
        return console.log('Could not connect to MongoDB Server'); // Using a return statement prevents the rest of the function from running, the below console.log won't run.
    }
    console.log('Connected to MongoDB server');


    // deleteMany

    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result)
    // }); 

    // deleteOne - deletes the first item it sees that matches the criteria and then stops. 

    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // })    

    // findOneandDelete - Also sends back the object that was deleted so you can tell the user which one was deleted 
    // Could be useful if you had a "undo delete" button, since the data is right there and available, you could put it right back in the database. 

    // db.collection('Todos').findOneAndDelete({_id: new ObjectID('59d6e7f210dce28c0302b7b0')}).then((result) => {
    //     console.log(result.value);
    // })

    // db.collection('Todos').findOneAndDelete({_id: new ObjectID('59d6ea2c10dce28c0302b852')}).then((result) => {
    //     console.log(`You just deleted: ${result.value}`);
    //     db.collection('Todos').insertOne(result.value).then((result) => {
    //         console.log(JSON.stringify(result.ops[0])); 
    //     }).catch((err) => {
    //         console.log(err);
    //     })
    // })

    db.collection('Todos').findOneAndDelete({_id: new ObjectID('59d6ea2c10dce28c0302b852')}).then((result) => {
        console.log(`You just deleted: ${result.value}`);
        db.collection('Todos').insertOne(result.value, (err, result) => {
            console.log(JSON.stringify(result.ops[0]))
        })
    });
}); 
