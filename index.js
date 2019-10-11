const jsforce = require('jsforce');
const inquirer = require('inquirer');

/**
 * Connect to Salesforce and run a simple query.
 * @param String name
 *  Username for connection.
 * @param String password
 *  Password for connection.
 */
function forceConnect (name, password) {
  const conn = new jsforce.Connection();
  conn.login(name, password, (err, res) => {
    if (err) {
      console.error(err);
      return console.error(res);
    }
    conn.query('SELECT Id, Name FROM Account', (error, result) => {
      if (error) { return console.error(error); }
      return console.log(result);
    });
    return true;
  });
}

// Gather Username and password:
const loginInfo = [
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
];

inquirer.prompt(loginInfo).then((answers) => {
  forceConnect(answers.name, answers.password);
});
