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

        case 'Exit':
            connection.end();
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

//View all Employees

const allEmployees = () => {
    let query = `
    SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.name AS department, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.depart_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`


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
        INSERT INTO department (name)
        VALUES (?)`

        connection.query(query, [response.newDept], (err, data)=>{
            if(err) throw err
            console.table(response);
            console.log(`Added new department ${response.newDept}!`);
            runSearch()
        })
    })
}


// Adding an employee

function newEmployee(){
    let query = 'SELECT id, title, salary FROM roles'

    connection.query(query, function (err, res) {
        if(err) throw err;

        const roleValues = res.map(({id, title, salary}) => ({
            value: id, title: `${title}`, salary: `${salary}`

        }));

        console.table(res);
        console.log("role to add");

        promptAddEmpData(roleValues);
    });
}

//Adding new employee

function promptAddEmpData(roleValues) {
    inquirer.prompt([
        {
        type:"input",
        name:"firstName",
        message:"What is the first name of the new employee?"
    },
    {
        type:'input',
        name:'lastName',
        message:'What is the last name of the new employee',
    },
    {
        type:'list',
        name:'newRole',
        message: "What is the new employee's role?",
        choices: roleValues
    },

    ]).then(function (answer) {
        let query = `
        INSERT INTO employee SET ?`

        connection.query(query, 
            {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.newRole,
        },
            function(err, res){
                if (err) throw err;
                console.table(answer);
                console.log("Success! New employee added!");
                runSearch()
            });
    });
}


