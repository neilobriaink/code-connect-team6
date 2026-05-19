var express = require('express');
var router = express.Router();

const EmployeeService = require('../services/employeeService');
const employeeService = new EmployeeService();

const JobRolesService = require('../services/jobRolesService');
const jobRolesService = new JobRolesService();

router.get('/', (req, res) => {
    const employees = employeeService.getEmployees();
    res.render('employeeList', { employees });
});

/* GET dashboard page. */
router.get('/dashboard', (req, res, next) => {
  res.render('dashboard');
});

// Create a new employee form
router.get('/add', (req, res) => {
  const jobRoles = jobRolesService.getJobRoles();
  
  res.render("addEmployee", {
    jobRoles,
    formData: {}
  });
});

// Update an employee by id form
router.get('/update/:id', (req, res) => {
    const employee = employeeService.getEmployeeById(parseInt(req.params.id));
    if (!employee) return res.status(404).send('Employee not found');
    const jobRoles = jobRolesService.getJobRoles();
    res.render('updateEmployee', { employee, jobRoles });
});

// Update an employee by id
router.post('/update/:id', (req, res) => {
    const updatedEmployee = employeeService.updateEmployee(parseInt(req.params.id), req.body);
    if (!updatedEmployee) return res.status(404).send('Employee not found');
    res.redirect('/employees');
});

function validateEmployee(req, res, next) {
  const { name, address, salary, role } = req.body;
  const errors = [];

  if (!name) errors.push('Name is required');
  if (!address) errors.push('Address is required');
  if (!salary || isNaN(Number(salary))) errors.push('Salary must be a number');

  const jobRoles = jobRolesService.getJobRoles();
  const validRole = jobRoles.find(r => r.name === role);
  if (!validRole) errors.push('A valid job role must be selected');

  if (errors.length) {
    return res.render('addEmployee', { errors, formData: req.body, jobRoles });
  }

  next();
}

router.post('/add', validateEmployee, (req, res) => {
  console.log('POST /employees/add body:', req.body);
  const newEmployee = req.body;
  employeeService.createEmployee(newEmployee);
  res.redirect('/employees/');
});

// Delete an employee
router.post('/delete/:id', (req, res) => {
  const deleted = employeeService.deleteEmployee(parseInt(req.params.id));
  if (!deleted) return res.status(404).send('Employee not found');
  res.redirect('/employees');
});

router.get('/:id', (req, res) => {
    const employee = employeeService.getEmployeeById(req.params.id);
   
    if (!employee) {
        return res.redirect('/employees');
    }
 
    res.render('employeeDetails', { employee });
});

module.exports = router;
