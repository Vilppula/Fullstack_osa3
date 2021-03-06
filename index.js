require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { response } = require('express')

const app = express()



app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('body', (req,res) => JSON.stringify(req.body))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req,res), 'ms',
    tokens.body(req,res)
  ].join(' ')
}))


app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (req, res)=> {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/help', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`<html><head></head><body>
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${new Date()}</p>
                </body><html>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id).then(person => {
    if (person) {
      res.json(person)
    } else {
      response.status(404).end()
    }
  }) .catch (error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id).then(deletedPerson => {
    res.json(deletedPerson)
  }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  var personData = req.body
  const newPerson = new Person({...personData})
  newPerson.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const personData = req.body
  const personUpdate = {
    name: personData.name,
    number: personData.number
  }
  Person.findByIdAndUpdate(id, personUpdate, { new:true })
    .then(updatedPerson => {
      if(updatedPerson === null) {
        res.status(404).send({error:`Person '${personData.name}' have been removed`})
      } else {
        res.json(updatedPerson)
      }    
    })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({error: error.message})
  }
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})