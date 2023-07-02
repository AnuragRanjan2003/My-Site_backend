const graphql = require('graphql');
const User = require('../models/user');
const Blog = require('../models/blog');
const mongoose = require('mongoose');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLList
} = graphql;

const BlogType = new GraphQLObjectType({
    name: 'Blog',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        discr: { type: GraphQLString },
        user : {
            type : UserType,
            resolve(parent,args){
                console.log(`received ${parent.authorID}`);
                let authId = new mongoose.Types.ObjectId(parent.authorID);
                console.log(`received _id ${authId}`);
                return User.findById(authId);
            }
        }
    }),
});

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
        },
        blogs : {
            type: new GraphQLList(BlogType),
            resolve(parent,args) {
                return Blog.find({ authorID : parent.id});
            }
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

                if (result === null) result = {
                    id: "wrong credentials",
                    email: "wrong credentials",
                    password: "wrong credentials"
                }

                return result;
            }
        },

        blog: {
            type: BlogType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve: async (parent, args) => {

                let res = await Blog.findById(args.id);
                console.log(`response from blog : ${res}`);
                return res;
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
        },
        addBlog : {
            type: BlogType,
            args : {
                title : {type :  new GraphQLNonNull(GraphQLString)},
                discr : {type : new GraphQLNonNull(GraphQLString)},
                authorID : {type : new GraphQLNonNull(GraphQLID)}
            },
            resolve : (parent,args) => {
                let blog = new Blog({
                    title : args.title,
                    discr : args.discr,
                    authorID : args.authorID
                });
                console.log(`blog : ${blog}`);
                return blog.save();
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutations
});