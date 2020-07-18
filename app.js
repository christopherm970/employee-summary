const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMembers = []

function getEmployeeInfo(){
    inquirer.prompt([
      {type: "input",
        message: "What is the employee's name?",
        name: "empName"
      },
      {
        type: "input",
        message: "What is the employee's ID?",
        name: "empID"
      },
      {
        type: "input",
        message: "What is the employee's email?",
        name: "empEmail"
      },
      {
        type: "list",
        message: "What is the employee's role?",
        choices:["Manager", "Engineer", "Intern"],
        name: "empRole"
      },
      // If manager
      {
        type: "input",
        message: "What is the manager's office number?",
        name: "manNum",
        when: response => {
          return (response.empRole === "Manager")
        }
      },
      // If engineer
      {
        type: "input",
        message: "What is the employee's github username?",
        name: "engGit",
        when: response => {
          return (response.empRole === "Engineer")
        },
      },
      // If Intern
      {
        type: "input",
        message: "What is the intern's school name?",
        name: "intSch",
        when: response => {
          return (response.empRole === "Intern")
        }
      },
    ]).then(function(response){
      // if manager
      if(response.empRole === "Manager"){
        let manager = new Manager(response.empName, response.empID, response.empEmail, response.manNum)
        teamMembers.push(manager)
        contQ()
      }
      // if engineer
      if(response.empRole === "Engineer"){
        let engineer = new Engineer(response.empName, response.empID, response.empEmail, response.engGit)
        teamMembers.push(engineer)
        contQ()
      }
      // if intern
      if(response.empRole === "Intern"){
        let intern = new Intern(response.empName, response.empID, response.empEmail, response.intSch)
        teamMembers.push(intern)
        contQ()
      }
    })
}

function contQ() {
  inquirer.prompt([
    {
      type: "confirm",
      message: "Do you want to add another team member?",
      name: "continueQ"
    }
  ]).then(function(response){
    if(response.contQ){
      getEmployeeInfo()
    }else{
      var teamHTML = render(teamMembers)
      fs.writeFile(outputPath, teamHTML, function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("Success!");
      })
    }
  })
}

getEmployeeInfo();
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
