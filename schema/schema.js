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
                return User.findOne({
                    email: args.email
                });
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        },

        logInUser: {
            type: UserType,
            args: {
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                password: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (parent, args) => {
                let result = null;
                result = await User.findOne({
                    email: args.email,
                    password: args.password
                });

                if(result === null) result ={ id : "wrong credentials" , email : "wrong credentials", password : "wrong credentials"}

                return result;
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
            resolve: async (parent, args) => {
                let user = new User({
                    email: args.email,
                    password: args.password,
                    admin: args.admin
                })
                let result = null;
                result = await User.findOne({
                    email: args.email
                });
                console.log(`result value : ${result}`);

                if (result != null) {
                    return {
                        email: "email alread exists",
                        password: "email already exists",
                        id: "user already exists"
                    };
                }

                return user.save();




            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutations
});