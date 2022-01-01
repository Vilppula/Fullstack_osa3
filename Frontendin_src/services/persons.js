import axios from "axios"
const baseUrl = '/api/persons'

const getAll = () => {
    const getRequest = axios.get(baseUrl)
    return getRequest.then(response => response.data)
}

const addContact = (newContact) => {
    console.log('Lähetetään dataa...')
    const postRequest = axios.post(baseUrl,newContact)
    return postRequest.then(response => response.data)
}

const deleteContact = (person) => {
    return axios.delete(`${baseUrl}/${person.id}`)
}

const updateContact = (person) => {
    const putRequest = axios.put(`${baseUrl}/${person.id}`, person)
    return putRequest.then(response => response.data)
}

export default {getAll, addContact, deleteContact, updateContact}
