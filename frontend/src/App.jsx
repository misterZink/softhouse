import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import React, { useState } from "react";
import "./App.css"
import Message from "./components/Message"
import XMLViewer from "react-xml-viewer";

import FileUpload from "./components/FileUpload";

function App() {
    const [processedText, setProcessedText] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    return (
        <div className="app">
            {alertMessage
                ? <Message message={alertMessage.message} resetAlert={setAlertMessage} variant={alertMessage.variant} />
                : ""}
            <div className="d-flex">
                <div className="w-50 mx-auto my-auto">
                    <Card className="card mt-5">
                        <Card.Body>
                            <Card.Title>
                                <h1>
                                    Textfile to XML Converter
                                </h1>
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                Ladda upp en textfil
                            </Card.Subtitle>
                            <FileUpload processedTextState={setProcessedText} message={setAlertMessage} />
                        </Card.Body>
                    </Card>

                    {processedText === "" ? "" :
                        <div>

                            <Card className="card mt-5 mb-5 p-5">
                                <h2>
                                    XML:
                                </h2>
                                <div className="xml">
                                    <XMLViewer className="xmlViewer" xml={processedText.xml} invalidXml="Invalid text file format!" />
                                </div>
                            </Card>
                        </div>}
                </div>
            </div >
        </div >
    );
}

export default App;
