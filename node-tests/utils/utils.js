module.exports.add = (a, b) => a + b;

module.exports.square = (a) => a * a;

module.exports.setName = (user, fullName) => {
    let firstName = fullName.split(' ')[0];
    let lastName = fullName.split(' ')[1];
    
    return {
        firstName: firstName,
        lastName: lastName
    }
}

module.exports.asyncAdd = (a, b, callback) => {
    setTimeout(() => {
        callback(a + b);
    }, 1000)
}

module.exports.asyncSquare = (x, callback) => {
    setTimeout(() => {
        callback(x * x);
    }, 1000)
}