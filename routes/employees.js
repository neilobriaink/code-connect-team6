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

module.exports = router;
