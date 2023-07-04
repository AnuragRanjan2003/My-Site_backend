const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();

mongoose.connect(`${process.env.MONGODBURI}`);

mongoose.connection.once('open', () => {
    console.log('connected to mongodb');
}).once('close', () => {
    console.log('disconnected from mongodb');
}).once('error', (err) => {
    console.log(`mongo db error : ${err}`);
});

console.log('cors is used');

app.use(cors({
    origin: "*", // Allow requests from this origin
    methods: ['GET', 'POST','OPTIONS'], // Allow specified HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization','Accept','Origin','X-Requested-With'],
}))

app.options('*', cors());

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