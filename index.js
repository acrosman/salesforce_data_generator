const jsforce = require('jsforce');
const inquirer = require('inquirer');

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
];

function getObjectDetails(conn) {
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
      const objList = response.objects.split(',');
      for (let i = 0; i < objList.length; i += 1) {
        // Check that each exists.
        console.log(objList[i]);

        // Get the Description, and list the fields.
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
 */
function forceConnect(name, password, listAll) {
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

        getObjectDetails(conn);
        return true;
      });
    }
    getObjectDetails(conn);
    return true;
  });
}

inquirer.prompt(loginInfoQuestions).then((answers) => {
  forceConnect(answers.name, answers.password, answers.allObjects);
});
