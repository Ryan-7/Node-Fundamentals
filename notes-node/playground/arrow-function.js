const square = (num) => {
    return num * num;
}

console.log(square(3));

// const square = num => num * num;

// function whatever() {

// }

// const whatever = () => {

// }

function cheese() {

}

const user = {
    name: "Ryan",

    sayHi() {
        console.log("Hi")
    },

    sayBye: () => {
        console.log("Bye")
    },

    // sayName: () => {     
    //     console.log(`Hi ${this.name}`)   Does not bind properly, will return undefined. In lieu of arrow function, use new function syntax on object literals
    // }

    sayName() { // Regular function, not an arrow function. New way and BEST way to do it on objects. No function keyword or property with colon.
        console.log(`Hi ${this.name}`) 
    },

    test: function() {      // Old way to put methods on functions
       console.log(`Hi ${this.name}`) // Hi Ryan
    }

}

user.sayHi()

user.sayBye();

user.sayName();

user.test();