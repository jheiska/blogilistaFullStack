const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI
mongoose.connect(url)

mongoose.Promise = global.Promise

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog