const {ObjectID} = require('mongodb').ObjectID;
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);  // beforeEach will call what's passed into it, { populateTodos() }


describe('Post /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text: text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err); // return just stops the function execution 
                }

                Todo.find({text: text}).then((todos) => {
                    expect(todos.length).toBe(1); // Since we deleted everything above, this will work.
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    return done(err);
                })
            })
    });

    it('should not create todo with invalid body data', (done) => {

        request(app)    // require the express app 
            .post('/todos')  // send post request to the todo route 
            .set('x-auth', users[0].tokens[0].token)
            .send({}) // send an empty object
            .expect(400)    // *** This will pass because in our model, we require the text property to be at least 1 character long. Sends back a 400 error, which we expect, so it passes.
            .end((err, res) => { // end the test 
                if (err) {
                    return done(err); // stop the test if error 
                } else {
                    done(); // must always call done, so if it's not called in the error, it needs to be called at the end of the test
                }

            })
    })
});


describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.results.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`) // Must convert to string. Think of using Postman right here. Using a URL and a GET request and what we expect to see in Postman. 
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
               expect(res.body.result.text).toBe(todos[0].text);
            })
            .end(done);
    })

    it('should return a 404 if todo not found', (done) => {
        let id = new ObjectID();
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
         
    })

    it('should return a 400 if id not valid', (done) => {
        let someId = new ObjectID();
        request(app)
            .get(`/todos/${someId.toHexString() + '343' }`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end(done); 
    })
})

describe('DELETE /todos/:id', () => {
    it ('should delete todo by id', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.doc.text).toBe(todos[0].text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                } else {
                    Todo.findById(todos[0]._id).then((res) => {
                        expect(res).toNotExist();
                        done();
                    }).catch((err) => {
                        done(err);
                    })
                    

                }
            }) 
    });

    it('should return 404 if not found', (done) => {
        let randomId = new ObjectID();
        request(app)
            .delete(`/todos/${randomId.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('should return 400 if not a valid id', (done) => {
        let invalidId = '12345';
        request(app)
            .delete(`/todos/${invalidId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);

    })
})


describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
       let id = todos[0]._id; 
       var text = 'This is the new text';
       request(app)
          .patch(`/todos/${id.toHexString()}`)
          .send({text: text, completed: true})
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
              expect(res.body.todo.text).toBe(text);
              expect(res.body.todo.completed).toBe(true);
              expect(res.body.todo.completedAt).toBeA('number');
          })
          .end(done);
    })

    it('should clear completedAt when todo is not completed', (done) => {
        let id = todos[1]._id; 
        var text = 'This is the new text!!';
        request(app)
           .patch(`/todos/${id.toHexString()}`)
           .send({text: text, completed: false})
           .set('x-auth', users[1].tokens[0].token)
           .expect(200)
           .expect((res) => {
               expect(res.body.todo.text).toBe(text);
               expect(res.body.todo.completed).toBe(false);
               expect(res.body.todo.completedAt).toNotExist();
           })
           .end(done);
     })
    
});


describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        let token = users[0].tokens[0].token;
        request(app)
            .get('/users/me')
            .set('x-auth', token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);

    })

    it('should return a 401 if not authenticated', (done) => {
        let token = '394343'; // provide an invalid or no id for this test 
        request(app)
            .get('/users/me')
            .set('x-auth', token)
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

})

describe('POST /users', () => {

    it('should return the id and email of the new user', (done) => {

    let newUser = {
        email: 'newuser@example.com',
        password: 'password'
    };
    request(app)
        .post('/users/')
        .send(newUser)
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toEqual('newuser@example.com'); // alternative: .toBe(newUser.email);
        })
        .end((err) => {
            if (err) {
                return done(err); 
            }
            User.findOne({email: newUser.email}).then((user) => { // now let's query the database for that new user we just created (the DB does get wiped and repopulated after each test case)
                expect(user).toExist();
                expect(user.passowrd).toNotBe(newUser.password); // the password should have been hashed, so this should not be equal
                done();
            });
        });
    });

    it('should return validation errors', (done) => {
        let newUser = {
            email: "invalidEmail",
            password: "password"
        }
        request(app)
            .post('/users')
            .send(newUser)
            .expect(400)
            .end(done);
    });

    it('should not not create if email is in use', (done) => {
        request(app)
            .post('/users')
            .send({email: 'user1@example.com', password: 'password'}) // this email is already in use, thus we should get a 400 back. 
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should send back a token', (done) => {
        request(app)
            .post('/users/login')
            .send({email: users[1].email, password: users[1].password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    })

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({email: 'fakeemail@test.com', password: 'badpassword'})
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toNotExist();
                    done();
                }).catch((err) => {
                    done(err);
                })
            });
    })
})

describe('DELETE /users/me/token', () => {
    it('should delete the users token',(done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens[0]).toNotExist();
                    done();
                }).catch((err) => {
                    done(err);
                })
            });
    })
})