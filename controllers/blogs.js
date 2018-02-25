const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(Blog.format))
})
  
blogsRouter.post('/', async (request, response) => {
  try {
  let { title,author,url,likes } = await request.body
  
  if ( title === undefined || url === undefined ) {
    return response.status(400).json({error: 'title or url missing'})
  }

  if (likes === undefined) {
    likes = 0
  }

  const blog = new Blog ({
    title,
    author,
    url,
    likes   
  })

  blog.save()
  response.status(201).json(blog)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})


blogsRouter.put('/:id', async (request, response) => {
 
  try {
    const body = request.body
    
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true } )
    response.json(blog)

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }

})

/*
blogsRouter.put('/:id', (request, response) => {
  const body = request.body
  
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(result => {
      response.json(result)
    })
})
*/

module.exports = blogsRouter