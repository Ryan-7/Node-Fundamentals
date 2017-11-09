// A test is a function that runs some code 

const expect = require('expect');
const utils = require('./utils');

it('should add two numbers', () => {
    const res = utils.add(33, 11);

    expect(res).toBe(44).toBeA('number');

    // if (res !== 44) {
    //     throw new Error(`Expected 44, but got ${res}`)
    // }
}); 

it('should square a number', () => {
    const res = utils.square(7);

    expect(res).toBe(49).toBeA('number');

    // if (res !== 49) {
    //     throw new Error(`Expected 49, but got ${res}`)
    // }
})

it('should expect some value', () => {
   // expect(12).toNotBe(11);
   // expect({name: 'Ryan'}).toEqual({name: 'Ryan'})  // toBe would not work here since they're two different objects. 
   // expect(['ryan', 'jim', 'bob']).toInclude('ryan');

   expect({
       name: "Ryan",
       age: 28,
       location: "Madison"
   }).toInclude({
       location: "Madison"
   }).toExclude({
       name: "Jim"
   })

})

console.log(utils.setName("rburch", "Ryan Burch"))

it('should return a first and last name', () => {
    let user = {location: "Madison", age: 28}
    const response = utils.setName(user, "Ryan Burch");

    expect(response).toInclude({
        firstName: "Ryan",
        lastName: "Burch"
    })
})

describe('#Async Tests', () => {
    it('should aysnc add two numbers', (done) => { // done tells Mocha that you have an asynchronous test. 
        utils.asyncAdd(4, 3, (sum) => {
            expect(sum).toBe(7).toBeA('number');
            done();
        })
    })
    
    it('should async square a number', (done) => {
        utils.asyncSquare(5, (res) => {
            expect(res).toBe(25).toBeA('number');
            done();
        })
    })
})


