import { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import FileDownload from "js-file-download"

const FileUpload = ({ processedTextState, message }) => {
    const [file, setFile] = useState("");

    const sendTextToParentComponent = (data) => {
        processedTextState(data);
    }
    const sendMessageToParentComponent = (data) => {
        message(data);
    }
    const handleChange = e => {
        setFile(e.target.files[0])
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await axios.post("http://localhost:3001/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            sendTextToParentComponent(res.data)
            sendMessageToParentComponent({ message: "Success!", variant: "success" })

            axios({
                url: "http://localhost:3001/download",
                method: "POST",
                responseType: "blob"
            }).then((res) => {
                FileDownload(res.data, "result.xml")
            })

        } catch (err) {
            err.response.status === 500
                ? sendMessageToParentComponent({ message: "There was a problem with the server", variant: "danger" })
                : sendMessageToParentComponent({ message: err.response.data.message, variant: "danger" })
        }


    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control type="file" accept=".txt,.rtf,.md,.file, .doc" onChange={handleChange} />
                </Form.Group>

                <Form.Group>
                    <Button type="submit" className="w-100" variant="primary">
                        Ladda upp
                    </Button>
                </Form.Group>
            </Form>
        </>
    )
};
export default FileUpload