import React, { useState, useEffect } from 'react'
import Filter from './components/Filter.js'
import PersonForm from './components/PersonForm.js'
import Persons from './components/Persons.js'
import Message from './components/Message.js'
import personService from './services/persons.js'


const App = () => {
  const [persons, setPersons] = useState([])
  const [shownPersons, setShownPersons] = useState(persons)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [message, setMessage] = useState(null)
  const [messageStyle, setMessageStyle] = useState('hidden')

  useEffect(() => {
    personService
      .getAll()
      .then(responseData => {
        setPersons(responseData)
        setShownPersons(responseData)
      })
  },[])

  const nameChangeHandler = (event) => {
    setNewName(event.target.value)
  }
  const numberChangeHandler = (event) => {
    setNewNumber(event.target.value)
  }
  const searchChangeHandler = (event) => {
    setSearchValue(event.target.value)
  }
  
  
  const addContact = (event) => {
    event.preventDefault()
    var present = false
    if (newName === '' || newNumber === '') {
      return alert('Some fields were empty')
    }
    persons.forEach(person => {
      if(person.name === newName) {
        const replace = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
        present = true
        setNewName(''); setNewNumber('')
        if (replace) {
          const updatedPerson = {...person, number: newNumber}
          personService  
            .updateContact(updatedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(personObject => personObject.id !== person.id ? personObject : returnedPerson))
              setShownPersons(shownPersons.map(personObject => personObject.id !== person.id ? personObject : returnedPerson))
            })
            .catch(error => {
              setMessage(error.response.data.error)
              setMessageStyle('error')
              setTimeout(() => {
                setMessage(null)
                setMessageStyle('hidden')
              }, 5000)
              setPersons(persons.filter(keepPerson => keepPerson !== person))
            })
        }
      }
    })
    if (!present) {
      const newContact = {name:newName, number:newNumber}
      personService
        .addContact(newContact)
        .then(addedContact => {
          setPersons(persons.concat(addedContact))
          setShownPersons(shownPersons.concat(addedContact))
          setNewName(''); setNewNumber('')
          setMessage(`Added ${addedContact.name}`)
          setMessageStyle('success')
          setTimeout(() => {
            setMessage(null)
            setMessageStyle('hidden')
          }, 5000)
        }).catch(error => {
          setMessage(error.response.data.error)
          setMessageStyle('error')
          setTimeout(() => {
            setMessage(null)
            setMessageStyle('hidden')
          }, 5000)
        })
    }
  }

  const setShownContacts = (event) => {
    event.preventDefault()
    var showThese = []
    persons.forEach(person => {
      console.log('Searching:' +searchValue+ ' in name: ' + person.name)
      if (person.name.toLowerCase().includes(searchValue.toLowerCase())) {
        console.log(person.name + ' contains ' +searchValue)
        showThese = showThese.concat(person)
      }
    })
    setShownPersons(showThese)
  }

  const deletePerson = (event) => {
    event.preventDefault()
    persons.forEach(person => {
      if (person.name === event.target.value) {
        if (window.confirm(`Delete ${person.name}`)) {
          personService
            .deleteContact(person)
            .then(response => {
              console.log(response.status)
              if(response.status === 200) {
                setPersons(persons.filter(keepPerson => keepPerson !== person))
              }
            })
        }
      }
    })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message} style={messageStyle}/>
      <Filter handler={searchChangeHandler} 
              setShownContacts={setShownContacts}
              searchValue = {searchValue}/>
      <h2>add new</h2>
      <PersonForm addContact={addContact}
                  newName = {newName}
                  newNumber = {newNumber}
                  nameChangeHandler = {nameChangeHandler}
                  numberChangeHandler = {numberChangeHandler}/>
      <h2>Numbers</h2>
      <Persons persons = {persons}
               setPersons = {setPersons}
               setShownPersons = {setShownPersons}
               shownPersons = {shownPersons}
               deleteHandler = {deletePerson}/>
    </div>
  )
}

export default App