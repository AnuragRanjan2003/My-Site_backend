const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
require('dotenv').config();

const app = express();

app.use('/graphql', graphqlHTTP(
    {
    schema,
    graphiql:true,
}
));

const PORT = 3000||process.env.PORT;

app.listen(PORT , ()=> {
    console.log(`listening on port ${PORT}`) ;
});