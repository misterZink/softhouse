const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 3001;
const app = express();
const { convertTextToXML } = require("./utils/xmlConverter");

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
	console.log("Server has started on port:", PORT);
});

app.post("/download", (req, res) => {
	res.download("./result.xml");
});

app.post("/upload", (req, res) => {
	if (req.files === null) {
		return res.status(400).json({ message: "No file uploaded!" });
	}

	const file = req.files.file;
	if (!isTextfile(file)) {
		return res.status(415).json({ message: "File is not a textfile!" });
	}

	const text = file.data.toString();
	if (text === "") {
		return res.status(400).json({ message: "File is empty!" });
	}

	let xml = convertTextToXML(text);

	if (xml === "Invalid") {
		return res.status(400).json({ message: "Invalid text format!" });
	}

	res.json({
		xml: xml,
	});
});

const isTextfile = (file) => {
	switch (file.mimetype) {
		case "text/plain":
		case "application/octet-stream":
		case "application/msword":
			return true;
		default:
			return false;
	}
};
