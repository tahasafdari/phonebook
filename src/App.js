import {useEffect, useState} from 'react'

import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import personService from './services/person'

import './index.css'
import Notification from "./components/Notification";

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [showName, setShowName] = useState(true)
    const [newNumber, setNewNumber] = useState('')

    const [filter, setFilter] = useState('')
    const [filterPersons, setFilterPersons] = useState(persons)
    const [message, setMessage] = useState(null)


    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])


    const addName = (event) => {
        event.preventDefault()
        const personsArray = persons.map(e => e.name)
        const nameObject = {
            name: newName,
            number: newNumber
        }

        const existEntry = persons.find(p => p.name === newName)
        if (personsArray.includes(`${nameObject.name}`)) {
            const r = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one? `)
            if (r) {
                personService
                    .update(existEntry.id, nameObject)
                    .then(response => {
                        setPersons(
                            persons.map(p => p.id !== response ? p : response))

                        setMessage({
                            text: `Edited ${response.name}`,
                            type: "success"
                        })
                        setTimeout(() => {
                            setMessage(null)
                        }, 3000)
                    })
                    .catch(error => {
                        setMessage({
                            text: error.response.data.error,
                            type: "error"
                        })
                        setTimeout(() => {
                            setMessage(null)
                        }, 3000)
                    })
                setNewName('')
                setNewNumber('')

            }
        } else {
            personService
                .create(nameObject)
                .then(returnName => {
                    setPersons(persons.concat(returnName))
                    setMessage({
                        text: `Added ${returnName.name}`,
                        type: "success",
                    })
                    setTimeout(() => {
                        setMessage(null)
                    }, 3000)
                })
                .catch(error => {
                    setMessage({
                        text: error.response.data.error,
                        type: "error"
                    })
                    setTimeout(() => {
                        setMessage(null)

                    }, 3000)
                })
            setNewName('')
            setNewNumber('')
        }
    }

    const deletePerson = (person) => {
        const msg = `Delete ${person.name}?`
        const confirm = window.confirm(msg)
        if (confirm) {
            personService
                .deletePerson(person.id)
                .then(persons => setPersons(persons))
            setMessage({
                text: `${person.name} has removed`,
                type: "success"
            })
            setTimeout(() => {
                setMessage(null)
            }, 3000)
        }
    }


    const handleNameChange = (event) => {
        console.log(event.target.value)
        setNewName(event.target.value.toLocaleString())
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
        setFilterPersons(persons.filter((person) =>
            (person.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1)))
    }

    const nameToShow = showName ? persons : persons.filter(person => person.important)

    const addPersonData = {
        newName,
        newNumber,
        handleNameChange,
        handleNumberChange
    }


    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message}/>
            <Filter onChange={handleFilterChange} value={filter}/>
            <h2>add a new</h2>


            <PersonForm addName={addName} data={addPersonData}/>

            <h2>Numbers</h2>
            <p>
                {(filter !== "") ? filterPersons.map(person =>
                    <Persons key={person.name} person={person} number={person.number}/>
                ) : nameToShow.map(person =>
                    <Persons key={person.name} person={person} number={person.number}
                             deleteEntry={() => deletePerson(person)}/>)}
            </p>
        </div>
    )
}

export default App