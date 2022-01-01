import react from "react";

const Message = ({message, style}) => {
    return(
        <div className={style}>{message}</div>
    )
}

export default Message