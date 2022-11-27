import axios from "axios";
const url = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(url)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(url, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${url}/${id}`, newObject)
    return request.then(response => response.data)

}

const deletePerson = id => {
    axios.delete(`${url}/${id}`)
    return getAll()
}

export default {
    getAll: getAll,
    create: create,
    update: update,
    deletePerson: deletePerson
}