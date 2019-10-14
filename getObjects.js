const jsforce = require('jsforce');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

// ================ Question Objects of Inquirer ===================
// Questions to gather Username and password:
const loginInfoQuestions = [
  {
    type: 'input',
    name: 'name',
    message: 'Salesforce Username',
  },
  {
    type: 'password',
    name: 'password',
    message: 'Salesforce Password and Security Token',
  },
  {
    type: 'confirm',
    name: 'allObjects',
    message: 'List all objects in this org?',
  },
  {
    type: 'input',
    name: 'outputFileDir',
    message: 'Name of output file directory.',
  },
];

function getObjectDetails(conn, outputFileDir) {
  // Questions to get a list of objects to pull fields for.
  const objectQuestions = [
    {
      type: 'input',
      name: 'objects',
      message: 'Enter a comma seperated list of objects to pull',
    },
  ];

  // Ask for a list of objects to generate data for.
  if (conn) {
    inquirer.prompt(objectQuestions).then((response) => {
      const objList = response.objects.split(',').map((item) => item.trim());
      for (let i = 0; i < objList.length; i += 1) {
        // Get the Description, and list the fields.
        conn.describe(objList[i], (err, meta) => {
          if (err) { return console.error(err); }
          console.log(`Object : ${meta.label}`);
          console.log(`Num of Fields : ${meta.fields.length}`);
          console.log('Fields:');

          for (let j = 0; j < meta.fields.length; j += 1) {
            console.log(`Label: ${meta.fields[j].label}, Name: ${meta.fields[j].name}, Type: ${meta.fields[j].type}`);
          }

          const file = path.join(outputFileDir, `${meta.label}.json`);
          fs.writeFile(file, JSON.stringify(meta, null, 2), 'utf8', (e) => {
            if (e) {
              console.error('An error occured while writing JSON Object to File.');
              return console.error(err);
            }

            console.log(`JSON file has been saved: ${file}`);
            return true;
          });

          return meta;
        });
      }
    });
  }
}

/**
 * Connect to Salesforce and run a simple query.
 * @param String name
 *  Username for connection.
 * @param String password
 *  Password for connection.
 * @param Bool listAll
 *  List all objects in the org before asking which we care about.
 * @param String outputFile
 *  Location to print output file.
 */
function forceConnect(name, password, listAll, outputFileDir) {
  // Make sure the output directory exists.
  fs.mkdirSync(outputFileDir);

  const conn = new jsforce.Connection();
  conn.login(name, password, (err, res) => {
    if (err) {
      console.error(err);
      console.error(res);
      return null;
    }

    if (listAll) {
      conn.describeGlobal((error, result) => {
        if (error) {
          return console.error(error);
        }

        for (let i = 0; i < result.sobjects.length; i += 1) {
          console.log(result.sobjects[i].name);
        }

        getObjectDetails(conn, outputFileDir);
        return true;
      });
    }
    getObjectDetails(conn, outputFileDir);
    return true;
  });
}

inquirer.prompt(loginInfoQuestions).then((answers) => {
  forceConnect(answers.name, answers.password, answers.allObjects, answers.outputFileDir);
});
