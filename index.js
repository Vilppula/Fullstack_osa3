const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
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

let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]


app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (req, res)=> {
    res.json(persons)
})

app.get('/help', (req, res) => {
    res.send(`<html><head></head><body>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    </body><html>`)
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const foundPerson = persons.find(person => person.id === id)
    if (foundPerson) {
        res.json(foundPerson)
    } else {
        res.status(404).end(s)
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    if (persons.find(person => person.id === id)) {
        persons = persons.filter(person => person.id !== id)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    var newPerson = req.body
    if (newPerson.name === undefined || newPerson.number === undefined) {
        return res.status(400).json({
            error: 'some fields were empty...'
        })
    }
    if (persons.filter(person => person.name === newPerson.name).length>0) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const id = Math.floor((Math.random()*1000000)+4)
    newPerson = {id: id, ...newPerson}
    persons = persons.concat(newPerson)
    res.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})