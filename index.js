require('dotenv').config()

const mysql = require('mysql');
const inquirer = require('inquirer');
const console = require('console');

const connection = mysql.createConnection({
  host: 'localhost',

  // The port
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: process.env.DB_PASS,
  database: 'employeetrackerDB',
});

// To call console.table() blank table WHERE SHOULD THIS CALL GO
// console.table([]); 


connection.connect((err) => {
  if (err) throw err;
  runSearch();
});

const runSearch = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'Add department',
        'Add role',
        'Add employee',
        'View all department',
        'View all roles',
        'View all employees',
        'Update employee role',
        'Exit'
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all department':
          allDepartments();
          break;

        case 'View all roles':
          allRoles();
          break;

        case 'View all employees':
          allEmployees();
          break;

        case 'Add department':
          newDept();
          break;

        case 'Add role':
          newRole();
          break;
          
        case 'Add employee':
            newEmployee();
            break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};


// Query to show all departments

const allDepartments = () => {
    let query = `
    SELECT *
    FROM department`

    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data)
        console.log("\n")
        runSearch()
    })
}

// Query to show all roles

const allRoles = () => {
    let query = `
    SELECT *
    FROM roles`

    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data)
        console.log("\n")
        runSearch()
    })
}

// Query to show all employees

const allEmployees = () => {
    let query = `
    SELECT *
    FROM employee`

    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data)
        console.log("\n")
        runSearch()
    })
}

// Adding a new department

const newDept = () => {
    inquirer.prompt([{
        type:"input",
        name:"newDept",
        message:"What is the name of the new department?"
    }]).then(response => {
        let query = `
        INSERT INTO department (dept_name)
        VALUES (?)`

        connection.query(query, [response.newDept], (err, data)=>{
            if(err) throw err
            console.log("added new department.")
        })
    })
}

