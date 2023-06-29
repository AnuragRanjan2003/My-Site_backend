const express = require('express');
const {
    graphqlHTTP
} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.get('/', function (req, res) {
    res.send('Welcome to graphql server');
});

mongoose.connect(process.env.MONGODBURI);

mongoose.connection.once('open', () => {
    console.log('connected to mongodb');
}).once('close', () => {
    console.log('disconnected from mongodb');
}).once('error', () => {
    console.log(`mongo db error : ${err}`);
});



app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});