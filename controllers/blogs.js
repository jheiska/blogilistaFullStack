const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})  
  response.json(blogs.map(Blog.format))
})
  
blogsRouter.post('/', async (request, response) => {
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
})

blogsRouter.delete('/:id', (request, response) => {
  Blog  
    .findByIdAndRemove(request.params.id)
      .then( () => {
      response.status(204).end()
    })
})

module.exports = blogsRouter