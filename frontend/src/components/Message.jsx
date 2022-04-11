import React from "react";
import {Alert} from "react-bootstrap";
import {useState} from "react";

const Message = ({variant, message, resetAlert}) => {
    const [show, setShow] = useState(true);

    const alertReset = () => {
        resetAlert("");
    }

    if (!show) {
        return null
    }

    return (
        <Alert variant={variant} onClose={() => {
            setShow(false);
            alertReset()
        }} dismissible>
            {message}
        </Alert>
    );
}

export default Message