import React, { useEffect } from 'react'

const Persons = (props) => {
    return (
        <>  
            {props.persons.map(person => {
                if (props.shownPersons.indexOf(person) !== -1) {
                    return <div key={person.id}><b>{person.name} : {person.number} </b>
                    <button onClick={props.deleteHandler} value={person.name}>delete</button>
                    </div>
                }
            })}
        </>
    )
}
export default Persons
