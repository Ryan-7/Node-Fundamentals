const request = require('supertest');
const expect = require('expect');

const app = require('./server').app; // get the app variable

it('should return hello world response', (done) => {
    request(app)
        .get('/')
        .expect(404)
        .expect((res) => {
            expect(res.body).toInclude({
                error: "Error!"
            })
        })
        .end(done);
})


it('should return status code and array of users', (done) => {
    request(app)
        .get('/users')
        .expect(200)
        .expect((res) => {
            expect(res.body).toInclude({
                name: 'Ryan',
                age: 29
            })
        })
        .end(done);
})


/*

res.body is the JSON object we are sending from server.js 


*/