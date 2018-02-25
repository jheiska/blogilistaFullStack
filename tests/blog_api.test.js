const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../utils/test_helper')

beforeAll(async () => {
  await Blog.remove({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const blogsBefore = await helper.blogsInDb()
  
  await api
    .get('/api/blogs')

  const blogsAfter = await helper.blogsInDb()

  expect(blogsAfter.length).toBe(blogsBefore.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api
    .get('/api/blogs')

  const titles = response.body.map(r => r.title)
  expect(titles).toContain('TDD harms architecture')
})

test('POST functions correctly', async () => {
  const newBlog = {
    "title": "BlogTest",
    "author": "String",
    "url": "String",
    "likes": 2
  }
  
  const blogsBefore = await helper.blogsInDb()

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter.length).toBe(blogsBefore.length+1)
    expect(blogsAfter).toContainEqual(newBlog)
})

test('POSTing without likes sets likes to 0', async () => {
  const newBlog = {
    "title": "BlogTest",
    "author": "String",
    "url": "String"
  }
  
  const blogsBefore = await helper.blogsInDb()

  await api
    .post('/api/blogs')
    .send(newBlog)

  const blogsAfter = await helper.blogsInDb()

  const addedBlog = blogsAfter[blogsAfter.length-1]
  expect(addedBlog.likes).toBe(0)
})

test('POSTing without title returns 400 Bad request', async () => {
  const newBlog = {
    "author": "String",
    "url": "String",
    "likes": 2
  }
  
  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)
})

test('POSTing without url returns 400 Bad request', async () => {
  const newBlog = {
    "title": "TestBlog",
    "author": "String",
    "likes": 2
  }
  
  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)
})

afterAll(() => {
  server.close()
})