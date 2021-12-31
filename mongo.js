const mongoose = require('mongoose')

if (!process.argv[2]) {
    console.log('Please give database access password')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://Vilppula:${password}@cluster0.bfnr6.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)


if(process.argv[3] && process.argv[4]) {
    const name = process.argv[3]
    const number = process.argv[4]
    const newPerson  = Person({
        name: name,
        number: number
    })
    newPerson.save().then(response => {
        console.log(`added ${name} number ${number}`)
        mongoose.connection.close()
    })
}


else {
    Person.find({}).then(response => {
        console.log('phonebook:')
        response.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
        process.exit()
    })
}
