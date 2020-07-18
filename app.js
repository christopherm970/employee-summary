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
    if(response.continueQ){
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