const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')

/*
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
*/

mongoose
  .connect(config.mongoUrl)
  .then( () => {
    console.log('connected to databases', config.mongoUrl)
  })
  .catch( err => {
    console.log(err)
  })

/*
const url = process.env.MONGODB_URI
mongoose.connect(url)
*/

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))


app.use('/api/blogs', blogsRouter)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}

const PORT = config.port

/*
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
*/