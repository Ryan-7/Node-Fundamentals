// const fs = require('fs');

// const addNote = (title, body) => {
//     var notes = []; 
//     var note = {
//         title,
//         body
//     }
//     notes.push(note);
//     fs.writeFileSync('notes-data.json', JSON.stringify(notes)) // Stringifying the array of objects
// }

// const getAll = () => {
//     console.log("Getting all notes");
// }

// const getNote = (title) => {
//     console.log(`Retreiving: ${title}`)
// }

// const removeNote = (title) => {
//     console.log(`Removing: ${title}`)
// }

// module.exports = {
//     addNote: addNote,
//     getAll: getAll,
//     getNote,
//     removeNote
// }


// Finish the app myself
// Adding a note will append to the text file objects
// Edit a note will edit a note by title
// remove a note will delete one 




const fs = require('fs');
const _ = require('lodash');

// The string is parsed into an Object in my fetchNotes method, that's nice. 


const fetchNotes = () => {
    try {
        const notesString = fs.readFileSync('notes-data.json'); // Read the current notes and assign the JSON string to a variable if it exists 
        return JSON.parse(notesString); // Convert notes to a JSON object so we can add objects to it. // This will cause an error if that file doesn't exist, which we can "Catch" and log below. 
    } catch (e) {
        // return [];
    }
}

const saveNotes = (notes) => {
    fs.writeFileSync('notes-data.json', JSON.stringify(notes)) // Pass in the name and data. Stringifying the array of objects
}



const addNote = (title, body) => {
    var notes = fetchNotes();
    var note = {
        title,
        body
    };

    var duplicateNotes = notes.filter((note) => {  // Called once for every item in the array, returns true or false. If condition is true the item is added to array, false doesn't.
        return note.title === title; // If duplicateNotes has an item in it, that title is a duplicate. 
    })

    if (duplicateNotes.length === 0) {
        notes.push(note);
        saveNotes(notes);
        return note; // Will return to app.js This will not run if the lenght is over 0 and therefor returned undefined. 
         
    } else {
        console.log("Please choose a different title") // This runs first, the entire function finishes. 
    }

}

const editNote = (title, body) => {
    var notes = fs.readFileSync('notes-data.json'); // Assigning that JSON string to a variable 
    notes = JSON.parse(notes); // Parsing the JSON into a JS object. 
    let note = _.findIndex(notes, {title: title}) // Index of the note 
    notes.splice(note, 1, {title: title, body: body}) // Using that index, splice 1 out and put in the new note 
    fs.writeFileSync('notes-data.json', JSON.stringify(notes)) // Convert that JS object back to JSON and create that file with the new "string";
}

const getNote = (title) => {
    let notes = fetchNotes();
    let note = _.find(notes, {title: title})
    return note;

   // let note = notes.filter((note) => note.title === title);  Alternatively. 
   // return note[0]  Return the first item in the array, ie the only item. 
}

const removeNote = (title) => {
    let notes = fetchNotes();
    let notesFiltered = notes.filter((note) => {
        return note.title !== title;
    })
    saveNotes(notesFiltered);

    return notes.length !== notesFiltered.length; 
}

const readNote = (note) => {
    debugger;
    console.log(`
        ${note.title}
        ${note.body}
    `); 
}

const getAll = () => {
    return fetchNotes();
}


module.exports = {
    addNote: addNote,
    getNote,
    removeNote,
    editNote,
    readNote: readNote,
    getAll
}