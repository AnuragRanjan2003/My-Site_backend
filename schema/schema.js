const graphql = require('graphql');
const User = require('../models/user');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLList
} = graphql;

//Dummy data for testing purposes

const Users = [{
        id: '1',
        email: 'foo@bar.com',
        password: 'abc',
        admin: true
    },
    {
        id: '2',
        email: 'abc@mail.com',
        password: '123',
        admin: false
    },
    {
        id: '3',
        email: 'xyz@mail.com',
        password: 'pqr',
        admin: false
    },
    {
        id: '3',
        email: '123@mail.com',
        password: '123',
        admin: false
    },
];


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        email: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        },
        admin: {
            type: GraphQLBoolean
        }
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        user: {
            type: UserType,
            args: {
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(parent, args) {
                return User.findOne({ email: args.email});
            }
        },
        users : {
            type : new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        }
    }
});

const mutations = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
        addUser: {
            type: UserType,
            args: {
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                password: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                admin: {
                    type: new GraphQLNonNull(GraphQLBoolean)
                }
            },
            resolve(parent, args) {
                let user  = new User({
                    email: args.email,
                    password: args.password,
                    admin: args.admin
                })
                console.log(`User added ${user}`);
                return user.save();
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutations
});