import React from 'react'

const Filter = (props) => {
    
    return (
        <>
            <form onSubmit={props.setShownContacts}>
                filter shown with <input value = {props.searchValue} onChange={props.handler}/>
            </form>
        </>
    )
}

export default Filter