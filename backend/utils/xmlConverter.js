const xml2js = require("xml2js");
const fs = require("fs");

const xmlBuilder = new xml2js.Builder({ headless: true, rootName: "people" });

const splitPersonsFromText = (text) => {
	let separatePersonsRegex = /(?=P\|)/g;
	return text.split(separatePersonsRegex);
};

const splitFamilyInPersonString = (string) => {
	let separateFamilyRegex = /(?=F\|)/g;
	return string.split(separateFamilyRegex);
};

const splitPipeSymbolFromString = (string) => {
	let separatePipeSymbolRegex = /\|/g;
	return string.split(separatePipeSymbolRegex);
};

const removeNewLinesSymbols = (string) => {
	let removeNewLinesRegex = /\r\n/g;
	return string.split(removeNewLinesRegex).filter(Boolean);
};

const removeEmptyKeysFromObject = (object) => {
	return Object.fromEntries(
		Object.entries(object)
			.filter(([_, value]) => value != null)
			.map(([key, value]) => [
				key,
				value === Object(value) ? removeEmptyKeysFromObject(value) : value,
			])
	);
};

const getXMLDataObject = (strings) => {
	switch (strings[0]) {
		case "P":
			return removeEmptyKeysFromObject({
				firstname: strings[1],
				lastname: strings[2],
			});
		case "F":
			return removeEmptyKeysFromObject({ name: strings[1], born: strings[2] });
		case "T":
			return removeEmptyKeysFromObject({
				phone: { mobile: strings[1], landline: strings[2] },
			});
		case "A":
			return removeEmptyKeysFromObject({
				address: {
					street: strings[1],
					city: strings[2],
					zip: strings[3],
				},
			});
		default:
			break;
	}
};

function getXMLPersonDataObjects(person) {
	return splitFamilyInPersonString(person).map((string) =>
		removeNewLinesSymbols(string).map((string) => {
			let strings = splitPipeSymbolFromString(string);
			return getXMLDataObject(strings);
		})
	);
}

function convertArrayToPersonObject(personDataArray) {
	const personalInformation = Object.assign({}, ...personDataArray[0]);
	const containsFamilyMembers = personDataArray.length > 1;

	if (containsFamilyMembers) {
		const [, ...familyArray] = personDataArray;
		return {
			person: {
				...personalInformation,
				family: familyArray,
			},
		};
	}
	return {
		person: {
			...personalInformation,
		},
	};
}

const convertTextToXMLObject = (text) => {
	return splitPersonsFromText(text).map((person) => {
		const personDataArray = getXMLPersonDataObjects(person);
		return convertArrayToPersonObject(personDataArray);
	});
};

const convertTextToXML = (text) => {
	let xml = xmlBuilder.buildObject(convertTextToXMLObject(text));
	if (xml.length <= 30) {
		xml = "Invalid";
	} else {
		fs.writeFileSync("result.xml", xml);
	}
	return xml;
};

module.exports = { convertTextToXML };
