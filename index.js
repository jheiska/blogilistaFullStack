const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const url = process.env.MONGODB_URI
mongoose.connect(url)

mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))


app.use('/api/blogs', blogsRouter)




const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})