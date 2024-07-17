/* eslint-disable no-unused-vars */
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

require('dotenv').config()

const app = express()

app.use(express.json())

// app.use(morgan('tiny'))
morgan.token('body', (req, res) => {
  JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.use(cors())
app.use(express.static('dist'))

// app.get("/api/persons", (req, res) => {
//   res.json(persons);
// });

// GET request (display all)
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => next(error))
})

// GET request (display info)
app.get('/info', (req, res, next) => {
  const date = new Date()
  // res.send(
  //   `<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`
  // );
  Person.countDocuments({})
    .then((count) => {
      res.send(`<p>Phonebook has info for ${count} people</p> <p>${date}</p>`)
    })
    .catch((error) => next(error))
})

// GET request (display single person)
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id // dont have to convert to number because it is a string in the object
  // const person = persons.find((p) => p.id === id);
  // if (person) {
  //   res.json(person);
  // } else {
  //   console.log("not found");
  //   res.status(404).end();
  // }
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        console.log('not found')
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// DELETE request (deleting)
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  // persons = persons.filter((p) => p.id !== id);

  // res.status(204).end(); // 204 no content
  Person.findByIdAndDelete(id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

// POST request (adding new)
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    if (!body.name && !body.number) {
      return res.status(400).json({
        error: 'name and number missing',
      })
    }
    if (!body.name) {
      return res.status(400).json({
        error: 'name missing',
      })
    }
    if (!body.number) {
      return res.status(400).json({
        error: 'number missing',
      })
    }
  }

  const person = new Person({
    // id: String(Math.floor(Math.random() * 1000)),
    name: body.name,
    number: body.number,
  })

  // persons.concat(person)
  // res.json(person)
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

// PUT request (updating)
app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const { name, number } = req.body

  Person.findByIdAndUpdate(id, { name , number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if(updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// error handler middleware
const errorHandler = (error, req, res) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
