const expect = require('expect');
const rewire = require('rewire');

const app = rewire('./app'); // Adds app but also adds two methods
// app.__set__;
// app.__get__;

describe('App', () => {

    const db = {
        saveUser: expect.createSpy()
    };

    app.__set__('db', db); // first argument is what we want to replace in the app file, the second is what we replace it with, our db var with the spy function 

    // ^^ This mocks the db function, but we swap it out with a spy. 

    it('should call the spy correctly', () => {
        let spy = expect.createSpy();
        spy();
        expect(spy).toHaveBeenCalled();
    })

    it('should call saveUser with user object', () => {
        let email = 'ryan@example.com';
        let password = '123abc';

        app.handleSignup(email, password); // this is calling db.saveUser, except we replaced it with our spy 
        expect(db.saveUser).toHaveBeenCalledWith({  // replaced with the spy, but still looks the same, still expects arguments 
            email,
            password
        })
    })

})