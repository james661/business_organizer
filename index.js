// Require all necessary dependencies
const connection = require("./db/connection");
const inquirer = require("inquirer");
require("console.table");
const mysql = require("mysql2");

init();
// Function to initialize the app
function init() {
  selectionMenu();
}
// List of choices to choose from
function selectionMenu() {
  inquirer
    .prompt({
      type: "list",
      name: "choices",
      message: "What would option would you like?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "View employee by manager",
        "View employee by department",
        "Delete department",
        "Delete role",
        "Delete employee",
        "Quit",
      ],
    })
    // Functions that activate depending on what is chosen
    .then(function ({ choices }) {
      switch (choices) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "View employee by manager":
          viewEmployeeByManager();
          break;
        case "View employee by department":
          viewEmployeeByDepartment();
          break;
        case "Delete department":
          deleteDepartment();
          break;
        case "Delete role":
          deleteRole();
          break;
        case "Delete employee":
          deleteEmployee();
          break;
        // case 'View total budget of department':
        //   viewDepartmentBudget();
        //   break;
        default:
          quit();
      }
    });
}
// Retrieves all departments in the company
function viewAllDepartments() {
  let query = "SELECT id, name AS Department FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    selectionMenu();
  });
}
// Retrieves all roles in the company
function viewAllRoles() {
  let query =
    "SELECT role.title AS Title, role.id AS ID, department.name AS Department, role.salary AS Salary FROM role LEFT JOIN department ON role.department_id = department.id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    selectionMenu();
  });
}
// Retrieves all employees in the company
function viewAllEmployees() {
  let query =
    'SELECT employee.id AS ID, employee.first_name AS "First Name", employee.last_name AS "Last Name", department.name AS Department, role.salary AS Salary, CONCAT(manager.first_name, " ", manager.last_name) AS Manager FROM employee LEFT JOIN role on employee.role_id = role_id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;';
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    selectionMenu();
  });
}
// Allows user to add a department which they can name
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What department would you like to ad?",
      },
    ])
    .then(function (answer) {
      let query = "INSERT INTO department SET ?";
      connection.query(
        query,
        {
          name: answer.department,
        },
        function (err, res) {
          if (err) throw err;
          selectionMenu();
        }
      );
    });
}
// Allows user to add a role that they name
function addRole() {
  let query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const departmentChoices = res.map((data) => ({
      value: data.id,
      name: data.namem,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Role title?",
        },
        {
          type: "input",
          name: "salary",
          message: "Role Salary",
        },
        {
          type: "list",
          name: "department",
          message: "Which Department?",
          choices: departmentChoices,
        },
      ])
      .then(function (answer) {
        let query = `INSERT INTO role SET ?`;

        connection.query(
          query,
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department,
          },
          function (err, res) {
            if (err) throw err;

            viewAllRoles();
          }
        );
      });
  });
}
// Allows user to add an employee along with their role and respective manager
function addEmployee() {
  let query = "SELECT * FROM role";

  connection.query(query, function (err, res) {
    if (err) throw err;

    const roleChoices = res.map((data) => ({
      value: data.id,
      name: data.title,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?",
        },
        {
          type: "list",
          name: "title",
          message: "What is the employee's role?",
          choices: roleChoices,
        },
        {
          type: "input",
          name: "manager_id",
          message: "What is the manager's id?",
          default: 0,
        },
      ])
      .then(function (answer) {
        console.log(answer);

        let query = "INSERT INTO employee SET ?";
        connection.query(
          query,
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.title,
            manager_id: answer.manager_id,
          },
          function (err, res) {
            if (err) throw err;

            viewAllEmployees();
          }
        );
      });
  });
}
// Allows user to change the role of a present employee
function updateEmployeeRole() {
  let employeeChoiceString = "SELECT id, first_name, last_name FROM employee";
  let roleChoiceString = "SELECT id, title FROM role";
  let employeeChoices;
  let roleChoices;
  connection.query(employeeChoiceString, function (err, res) {
    if (err) throw err;
    employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`,
    }));
  });

  connection.query(roleChoiceString, function (err, res) {
    if (err) throw err;
    roleChoices = res.map((data) => ({
      value: data.id,
      name: data.title,
    }));
    updateRole(employeeChoices, roleChoices);
  });
}
// Role-updating function used in the function above
function updateRole(employeeChoices, roleChoices) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Choose an employee to uopdate",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "roleId",
        message: "Choose a new role for them",
        choices: roleChoices,
      },
    ])
    .then(function (answer) {
      let query = "UPDATE employee SET role_id = ? WHERE id = ?";
      connection.query(
        query,
        [answer.roleId, answer.employeeId],
        function (err, res) {
          if (err) throw err;
          viewAllEmployees;
        }
      );
    });
}

function viewEmployeeByManager() {
  let query =
    'SELECT id, CONCAT(first_name, " ", last_name) AS manager FROM employee WHERE isnull(manager_id)';
  connection.query(query, function (err, res) {
    if (err) throw err;
    const managerChoices = res.map((data) => ({
      value: data.id,
      name: data.manager,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "manager",
          message: "Choose a manager.",
          choices: managerChoices,
        },
      ])
      .then(function (answer) {
        const manager = answer.manager;
        let query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department FROM employee JOIN role ON employee.role_id = role.id JOIN department on department.id = role.department_id WHERE employee.manager_id = ${manager}`;
        connection.query(query, answer.departmentId, function (err, res) {
          if (err) throw err;
          console.table(res);
          selectionMenu();
        });
      });
  });
}

function viewEmployeeByDepartment() {
  let query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const departmentChoices = res.map((data) => ({
      value: data.id,
      name: data.name,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Choose a department",
          choices: departmentChoices,
        },
      ])
      .then(function (answer) {
        const department = answer.department;
        let query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department FROM employee JOIN role ON employee.role_id = role.id JOIN department on department.id = role.department_id WHERE department.id = ${department}`;
        console.table(res);
        selectionMenu();
      });
  });
}

function deleteDepartment() {
  let query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const departmentChoices = res.map((data) => ({
      value: data.id,
      name: data.name,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Choose a department to remove",
          choices: departmentChoices,
        },
      ])
      .then(function (answer) {
        let query = "DELETE FROM department WHERE ?";
        connection.query(
          query,
          { id: answer.departmentId },
          function (err, res) {
            if (err) throw err;
            selectionMenu();
          }
        );
      });
  });
}

function deleteRole() {
  let query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const roleChoices = res.map((data) => ({
      value: data.id,
      name: data.title,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "roleId",
          message: "Choose a role to delete",
          choices: roleChoices,
        },
      ])
      .then(function (answer) {
        let query = "DELETE FROM role WHERE ?";
        connection.query(query, { id: answer.roleId }, function (err, res) {
          if (err) throw err;
          selectionMenu();
        });
      });
  });
}

function deleteEmployee() {
  let query =
    "SELECT employee.id, employee.first_name, employee.last_name FROM employee";
  connection.query(query, function (err, res) {
    if (err) throw err;
    const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`,
    }));
    console.table(res);
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Choose an employee to delete",
          choices: deleteEmployeeChoices,
        },
      ])
      .then(function (answer) {
        let query = "DELETE FROM employee WHERE ?";
        connection.query(query, { id: answer.employeeId }, function (err, res) {
          if (err) throw err;
          selectionMenu();
        });
      });
  });
}

function quit() {
  process.exit();
}
