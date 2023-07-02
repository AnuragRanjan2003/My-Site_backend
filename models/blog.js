const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const blogSchema = new Schema({
    title: String,
    discr: String,
    authorID: String,
});

module.exports = mongoose.model('Blog', blogSchema);