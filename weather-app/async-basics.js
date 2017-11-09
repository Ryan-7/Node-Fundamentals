console.log("Starting App");

setTimeout(() => {
    console.log("Inside of Callback");
}, 2000)

setTimeout(() => {
    console.log("Second setTimeout");
}, 0)


console.log("Finishing Up");