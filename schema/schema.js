const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLSchema,
    GraphQLNonNull
} = graphql;

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
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                return Users.find((user) => user.email == args.email);
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
                let user = {
                    email: args.email,
                    password: args.password,
                    admin: args.admin
                } 
                Users.push(user);
                console.log(Users.length);
                return user;
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutations
});