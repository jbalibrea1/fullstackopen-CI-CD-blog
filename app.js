const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const path = require('path')

const cors = require('cors')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const { version } = require('./package.json')

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/login', loginRouter)

app.get('/health', (req, res) => {
  res.send('ok')
})

app.get('/version', (req, res) => {
  res.send(version)
})

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
} else {
  const BUILD_PATH = path.resolve(__dirname, './build')
  const INDEX_PATH = path.resolve(BUILD_PATH, 'index.html')
  app.use(express.static('build'))
  app.get('*', (req, res) => res.sendFile(INDEX_PATH))
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
