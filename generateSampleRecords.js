const jsforce = require('jsforce');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ================ Question Objects of Inquirer ===================
// Questions to gather Username and password:
const loginInfoQuestions = [
  {
    type: 'input',
    name: 'fieldMetaFileDir',
    message: 'Directory with field meta data files.',
  },
  {
    type: 'integer',
    name: 'objectCount',
    message: 'Number of objects to generate of each type.',
  },
];

function generateSampleObject(objectName, fields) {
  // Hashes are not desided to be secure, and do not need to be.
  // Fast is better than good here.
  const hash = crypto.createHash('md5');
  const currentDate = (new Date()).valueOf().toString();
  const random = Math.random().toString();

  const sObject = {
    attributes: {
      type: objectName,
      referenceId: hash.update(currentDate + random).digest('hex'),
    },
  };

  for (let i = 0; i < fields.length; i += 1) {
    sObject[fields[i].name] = 'Something';
  }

  return sObject;
}

function generatePlanData(sampleData) {

}

function loadFieldMetaData(directory) {
  fs.readdir(directory, (err, items) => {
    const allObjects = {
      sObjects: {},
      samples: {},
    };
    console.log(items);
    let fileName;
    let rawData;
    let details;
    let sample;
    for (let i = 0; i < items.length; i += 1) {
      fileName = path.join(directory, items[i]);
      rawData = fs.readFileSync(fileName);
      details = JSON.parse(rawData);
      allObjects.sObjects[details.name] = details;
      sample = generateSampleObject(details.name, details.fields);
      allObjects.samples[sample.attributes.referenceId] = sample;
    }
  });
}

inquirer.prompt(loginInfoQuestions).then((answers) => {
  loadFieldMetaData(answers.fieldMetaFileDir);
});
