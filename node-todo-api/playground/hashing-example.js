const {SHA256} = require('crypto-js');

let message = "I am user number 3";

let hash = SHA256(message); // hash the string

console.log(hash) // an object with an array of random numbers 
console.log(hash.toString()); // convert this object to a string 

// Hashing is good for passwords because you can't reverse engineer it, so if someone hacked your database, there would only be hashes. 
// Password = token (the password string is turned into a hash, plus salted on the server side)

// Pretend this is data being sent from the server to the client, and the id is the unique ObjectID of a user from the collection
let data = {
    id: 4
};

// We must make it so a user can't simply change the user id to 5, re-hash it, send the token back, and delete all the todos for user 5. 

// We must use JSON.stringify because we need to convert the JavaScript object to a string, SHA256 only works on strings, obviously, then we convert that SHA256 Object to a string.
let token = {
    data: data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString() // this is the hash value of { id: 4 }
}

/*

If someone somehow figured out this person's unique ID, they could also figure out their hash because any same string converts to the same hash, it's not randomly generated. 
Therefore, we must 'salt' it on the server side, so we add a secret to the hash that only lives on the server, so the hacker could never actually get the right hash even 
with the user's unique id since something extra is added to the hash. 

*/

// User manipulates the data object, and changes the id to 5, and hashes it and tries to get access with the token, but the hash won't match 
// because they don't have access to the secret to make the correct hash

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if (resultHash === token.hash) {
    console.log('Data was not changed')
} else {
    console.log('Data was changed. Do not trust');
}

// This whole process of creating an object and hashing it is called JWT (JSON Web Token), there are libraries for us. 


