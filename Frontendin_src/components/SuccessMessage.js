import react from "react";

const SuccessMessage = ({message, style}) => {
    return(
        <div className={style}>{message}</div>
    )
}

export default SuccessMessage