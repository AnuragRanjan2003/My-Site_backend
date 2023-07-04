const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose.connect(`${process.env.MONGODBURI}`);

mongoose.connection.once('open', () => {
    console.log('connected to mongodb');
}).once('close', () => {
    console.log('disconnected from mongodb');
}).once('error', (err) => {
    console.log(`mongo db error : ${err}`);
});


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', function (req, res) {
    console.log("api was hit by -->  "+req.ip);
    res.send({
        status: 200,
        message : "Welcome to graphql."
    });
});




app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});