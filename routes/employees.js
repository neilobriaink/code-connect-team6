var express = require('express');
var router = express.Router();

const EmployeeService = require('../services/employeeService');
const employeeService = new EmployeeService();

router.get('/', (req, res) => {
    const employees = employeeService.getEmployees();
    res.render('employeeList', { employees });
});

// Update an employee by employee number form
router.get('/update/:employeeNumber', (req, res) => {
    const employee = employeeService.getEmployeeByNumber(parseInt(req.params.employeeNumber));
    if (!employee) return res.status(404).send('Employee not found');
    res.render('updateEmployee', { employee });
});

// Update an employee by employee number
router.post('/update/:employeeNumber', (req, res) => {
    const updatedEmployee = employeeService.updateEmployee(parseInt(req.params.employeeNumber), req.body);
    if (!updatedEmployee) return res.status(404).send('Employee not found');
    res.redirect('/employees');
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

router.get('/:id', (req, res) => {
    const employee = employeeService.getEmployeeById(req.params.id);
    
    if (!employee) {
        return res.redirect('/employees');
    }

    res.render('employeeDetails', { employee });
});

module.exports = router;

