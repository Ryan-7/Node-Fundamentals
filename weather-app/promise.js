const asyncAdd = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof a === 'number' && typeof b === 'number') {
                resolve(a + b);
            } else {
                reject("Please use numbers");
            }
        }, 1500)
    })
}

asyncAdd(5, 7).then((res) => {
    console.log(res);
    return asyncAdd(res, '33');
}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});
 

// let someVar = asyncAdd(5, 7);  the promise is returned to the variable in this instance. 

// const somePromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//        // resolve('Hey. It Worked!')
//         reject("Unable to fulfill promise.")
//     }, 2500)
    
// }); 


// somePromise.then((message) => {
//     console.log(message);
// }, (errorMessage) => {
//     console.log(errorMessage)
// })

/*

The promise function takes one argument, which is an anonymous callback function with two parameters, resolve and reject.
Resolve and Reject can only take one argument each.

.then() is only called when the promise is fulfilled. The data that is passed is what's in resolve. 

*/