import React from 'react'

const Persons = ({person, deleteEntry}) => {

    return (
        <div>
            {person.name} {person.number} {" "}
            <button onClick={deleteEntry}>Delete</button>
        </div>

    )

}


export default Persons