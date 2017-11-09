
let env = process.env.NODE_ENV || 'development';  // when you start the app, the NODE.ENV global variable is not set, so it will set to development 

// When we require a JSON file, node will automatically parse it into a JavaScript object for us. 

if (env === 'development' || env === 'test') {
    const config = require('./config.json');
    const envConfig = config[env];  // using the variable set above, 'env' which we use to grab the correct object in the config.json file 
    const testConfig = config[env]; 

    Object.keys(envConfig).forEach((key) => { // will give us an array of the object keys, ['PORT', 'MONGODB_URI']
        process.env[key] = envConfig[key];
    }); 

}

// The forEach loop is basically just doing this: 
// process.env.PORT = 3000
// process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest"  


// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }  