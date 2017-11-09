console.log('Starting App.js');

const fileSystem = require('fs'); // core module
const _ = require('lodash'); // same name used in npm install

const yargs = require('yargs');
const notes = require('./notes.js');

const title = {
    describe: 'Title of Note',
    demand: true,
    alias: 't'  
}

const body = {
    describe: 'Body of note',
    demand: true,
    alias: 'b'
}

const argv = yargs
    .command('add', "Adding Note", {
        title: title,
        body: body
    })
    .command('list', 'List all notes')
    .command('read', 'Read a note', {
         title: title //  name of argument, ie --title 
    })
    .command('remove', "Remove a note", {
        title: title
    })
    .help()
    .argv; // Gets the arguments, will automatically parse them, --title=secret, becomes the key value pair of title: secret in the object. 

// let command = process.argv[2]; // Gets the 3rd argument (The first is the process, the second is the name of the file running)

let command = argv._[0];
console.log(process.argv)


if (command === 'add') {
    let note = notes.addNote(argv.title, argv.body); // If nothing is returned, aka, the if statement goes to the else statement, it is undefined. 
    if (note) {
        console.log("Note Added");
        notes.readNote(note);
    } else {
        console.log("Note Title Taken")
    }
} else if (command === 'list') {
    let allNotes = notes.getAll();
    if (allNotes) {
        console.log(`Printing ${allNotes.length} note(s)`);
        allNotes.forEach((note) => {
            notes.readNote(note);
        })
    } else {
        console.log("No Notes Available")
    }
} else if (command === 'read') {
    let note = notes.getNote(argv.title);
    if (note) {
        console.log("Note Read");
        notes.readNote(note);
    } else {
        console.log("Note Not Found");
    }
} else if (command === 'remove') {
   let noteRemoved = notes.removeNote(argv.title);
   let message = noteRemoved ? "Note Removed" : "Note not removed"; 
   console.log(message);
} else if (command === 'edit') {
    notes.editNote(argv.title, argv.body);
} else {
    console.log('Command Invalid');
}

