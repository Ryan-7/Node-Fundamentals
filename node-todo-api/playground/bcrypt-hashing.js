// Bcrypt Examples 

const bcrypt = require('bcryptjs');

let password = 'somePassword123';

// The larger the number, the longer it takes bcrypt to salt. 
// This program is intentionally slow so people can't use it to brute force through passwords 

bcrypt.genSalt(10, (err, salt) => {  // # of rounds, a callback with error and the salt we want to use 
    bcrypt.hash(password, salt, (err, hash) => {  // the password to salt, the salt, and a callback with an error and the hash we want to use in our database 
        console.log(hash);
    })
})

let hashedPassword = '$2a$10$A5U8GtdWhcUgqzPVwYi1uOJ71XNiaI.n.YCOSuq1e.S/sbedDI9PO';

bcrypt.compare(password, hashedPassword, (err, res) => {  // response returns true or false
    console.log(res);
})