// let getUser = (id, callback) => {
//     let users = [{
//         id: 31,
//         name: "Ryan"
//     }, {
//         id: 24,
//         name: "John"
//     }]
//     let userFound = users.filter((user) => {
//         return user.id === id; 
//     })
//     callback(userFound);
// }



// getUser(31, (user) => {
//   console.log(user);  
// })

// let getUser = (id, callback) => {
//     let user = {
//         id: 31,
//         name: "Ryan"
//     }

//     setTimeout(() => {
//         callback(user);
//     }, 3000)

// }


// getUser(31, (user) => {
//   console.log(user);  
// })



// const request = require('request');

// const getAddress = (address, callback) => {
//     let res = request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address);
//     callback(res);
// }


// getAddress(`1301 lombard street philadelphia`, (res) => {
//     console.log(res);
// })

