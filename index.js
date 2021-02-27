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

  // Password protected with .env file
  password: process.env.DB_PASS,
  database: 'employeetrackerDB',
});


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
          addNewRole();
          break;
          
        case 'Add employee':
            newEmployee();
            break;

        case 'Update employee role':
            updateEmployee();
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


//View all departments

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

//View all roles

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

// Add a new department

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


// Add an employee - create an array for employee

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

//Add new employee - run inquirer to input new employee info

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

// Add role 

const addNewRole = () => {
    inquirer.prompt([{
        type:"input",
        name:"createRole",
        message:"What is the name of the new role?"
    
    }]).then(response => {
        let query = `INSERT INTO roles (title) VALUES (?)`

        connection.query(query, [response.createRole], (err, data)=>{
            if(err) throw err
            console.table(response);
            console.log(`Added new role ${response.createRole}!`);
            runSearch()
        })
    })
}

//Updating an employee

function updateEmployee() {
    employeeData();
}

function employeeData() {
    let query = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON department.id = roles.depart_id JOIN employee manager ON manager.id = employee.manager_id`

    connection.query(query, function (err, res) {
        if (err) throw err;

        let employeeOptions = res.map(({ id, first_name, last_name}) => ({
            value: id, name: `${first_name} ${last_name}`
        }));
        console.table(res);

        roleArray(employeeOptions);
    });
}
function roleArray(employeeOptions) {
    let query = 
    `SELECT roles.id, roles.title, roles.salary FROM roles`
    let roleOptions;

    connection.query(query, function(err, res) {
        if (err) throw err;

        roleOptions = res.map(({id, title, salary}) => ({
            value: id, tile: `${title}`, salary: `${salary}`
        }));
        console.table(res);
        promptNewRole(employeeOptions, roleOptions);
    });
}
function promptNewRole(employeeOptions, roleOptions) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'pickEmployee',
            message: 'Which employee do you want to update?',
            choices: employeeOptions
        },
        {
            type: 'input',
            name: 'pickRole',
            message: 'Which role do you want to update?',
            choices: 'roleOptions'
        }
    ]).then(function (answer) {
        let query = `UPDATE employee SET role_id = ? WHERE id = ?`

        connection.query (query, 
            [answer.pickRole,
            answer.pickEmployee
        ],
        function (err, res) {
            if (err) throw err;

            console.table(answer);
            console.log('Success employee updated!');
            runSearch();

        });
    });
}
