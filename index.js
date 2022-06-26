// This simple REST API will implement CRUD using all 4 http verbs/methods:
// GET, POST, PUT and DELETE 

const users = require('./users.json'); // import all users from user.json
const fs = require('fs');   // import the file system module

const express = require('express');     // create a server with express
const app = express();

app.use(express.json()); // use a middleware to allow us to access POST requests data in the req.body

// write a get route for the homepage
app.get('/', (req, res) => {
    res.send('Hello there. Testing with Postman');
})

// write a route to display all users
app.get('/users', (req, res) => {
    res.json(users);
})

// write a route to handle the creation of a new user
app.post('/users', (req, res) => {
    console.log(req.body);                             // show the added user's details in the console
    users.push(req.body);                               // update the users array 
    let newUser = JSON.stringify(users, null, 2);       // null, 2 is to indent the data well
    fs.writeFile('./users.json', newUser, (err) => {    // add the new update users array to the users.json file
        if(err) console.log(err);
        console.log('User created!');
    })
    res.status(200).send('New User succesfully created!')     
})

// write a route to handle fetching a specific user
app.get('/users/:id', (req, res) => {
    let searchId = req.params.id;           // save the id parameter in a variable
    let foundUser = users.find(user => user.id === Number(searchId));   // search the users array for the one with that id
    if(foundUser){
        return res.status(200).json({user: foundUser});
    }
    res.status(404).send(`User with id ${searchId} not found.`);
})


// write a route that handles a search for some users
app.get('/users/search/query', (req, res) => {
    console.log(req.query);
    let searchKey = Object.keys(req.query)[0];
    let searchValue = Object.values(req.query)[0];
    let foundUser = users.filter(user => user.address[searchKey] == searchValue)
    if(foundUser.length > 1){
        return res.status(200).json({message : 'Found results', users: foundUser});
    }
    res.status(404).send('No results found.');
})






// setup the server to listen to (/run on) a port
app.listen(5000, () => {
    console.log('Server is listening on Port 5000 ...');
})