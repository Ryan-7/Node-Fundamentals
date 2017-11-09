const jwt = require('jsonwebtoken');

let data = {
    id: 10,
}; 

let token = jwt.sign(data, '123abc') // returns the token to the variable, first argument is the data, second argument is the secret. 


let decoded = jwt.verify(token, '123abc') // pass in the token and exact same secret

console.log(decoded); 
