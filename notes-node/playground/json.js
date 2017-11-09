// var obj = {
//     name: 'Ryan'
// };

// var stringObj = JSON.stringify(obj); // Takes object and returns the JSON stringified version, it's actually a string, no longer an object. 

// console.log(typeof stringObj);
// console.log(stringObj);

// var personString = '{"name": "Andrew", "age": 28}' // Useless as it's just a string, can't get by key value pair. 

// var personObject = JSON.parse(personString);

// console.log(typeof personObject) // Object
// console.log(personObject) // Regular object, no double quotes, only single quotes, JSON only allows single quotes. 

const fs = require('fs');

let originalNote = {
    title: 'Some Title',
    body: 'Some Body'
};

let originalNoteString = JSON.stringify(originalNote);

fs.writeFileSync('notes.json', originalNoteString) // Create file with name and contents (json)

let noteString = fs.readFileSync('notes.json' ) // read that file and write that json string to a variable

let noteObj = JSON.parse(noteString); // convert that json string back to an object 

console.log(noteObj.title); // Now we can use it like regular JSON. 