const jsforce = require('jsforce');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

// ================ Question Objects of Inquirer ===================
// Questions to gather Username and password:
const loginInfoQuestions = [
  {
    type: 'input',
    name: 'fieldMetaFileDir',
    message: 'Directory with field meta data files.',
  },
];

async function loadFieldMetaData(directory) {
  fs.readdir(directory, (err, items) => {
    const allObjects = {
      sObjects: {},
    };
    console.log(items);
    let fileName;
    let rawData;
    let details;
    for (let i = 0; i < items.length; i += 1) {
      console.log(items[i]);
      fileName = path.join(directory, items[i]);
      rawData = fs.readFileSync(fileName);
      details = JSON.parse(rawData)
      allObjects.sObjects[details.name] = details;
    }
  });
}

inquirer.prompt(loginInfoQuestions).then((answers) => {
  loadFieldMetaData(answers.fieldMetaFileDir);
});
