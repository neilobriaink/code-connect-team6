var express = require('express');
var router = express.Router();

const EmployeeService = require('../services/employeeService');
const employeeService = new EmployeeService();

router.get('/', (req, res) => {
    const employees = employeeService.getEmployees();
    res.render('employeeList', { employees });
});

// Create a new employee form
router.get('/add', (req, res) => {
  res.render('addEmployee')
});

function validateEmployee(req, res, next) {
  const { name, address, salary, role, employeeNum } = req.body;
  const errors = [];

  if (!name) errors.push('Name is required');
  if (!address) errors.push('Address is required');
  if (!salary || isNaN(Number(salary))) errors.push('Salary must be a number');
  if (!role) errors.push('Role is required');

  if (errors.length) {
    return res.render('addEmployee', { errors, formData: req.body });
  }

  next();
}

router.post('/add', validateEmployee, (req, res) => {
  console.log('POST /employees/add body:', req.body);
  const newEmployee = req.body;
  employeeService.createEmployee(newEmployee);
  res.redirect('/employees/');
});

module.exports = router;
