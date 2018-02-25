const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const http = require('http')

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

beforeAll(async () => {
  await Blog.remove({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[3])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[4])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[5])
  await blogObject.save()
})



test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api
    .get('/api/blogs')

  expect(response.body.length).toBe(initialBlogs.length)
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
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(titles).toContain('BlogTest')
})

test('POSTing without likes sets likes to 0', async () => {
  const newBlog = {
    "title": "BlogTest",
    "author": "String",
    "url": "String"
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)

  const response = await api
    .get('/api/blogs')

  const bloglist = response.body
  const addedBlog = bloglist[bloglist.length-1]
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